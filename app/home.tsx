import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { getTasksForUser } from '../services/task_service';
import { Timestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile } from '../services/user_profile_service';
import { formatDistanceToNow } from 'date-fns';

type Task = {
    id: string;
    name: string;
    description: string;
    deadline: Timestamp;
    status: 'not_started' | 'in_progress' | 'completed';
    course: string;
    priority: number;
};

export default function HomePage() {
    const { user } = useLocalSearchParams();
    const parsedUser = user ? JSON.parse(user as string) : null;
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);

    useFocusEffect(
        useCallback(() => {
            const fetchTasks = async () => {
                if (parsedUser?.uid) {
                    if (username === '') {
                        const profile = await getUserProfile(parsedUser.uid);
                        if (profile && profile.username) {
                            setUsername(profile.username);
                        }
                    }

                    const data = await getTasksForUser(parsedUser.uid);
                    const grouped: { [key: string]: Task[] } = {};
                    const originalCourseNames: { [key: string]: string } = {};

                    (data as Task[]).forEach((task) => {
                        const courseKey = task.course.toLowerCase();
                        if (!grouped[courseKey]) {
                            grouped[courseKey] = [];
                            originalCourseNames[courseKey] = task.course;
                        }
                        grouped[courseKey].push(task);
                    });

                    Object.keys(grouped).forEach((courseKey) => {
                        grouped[courseKey].sort((a, b) => b.priority - a.priority);
                    });

                    const sortedTasks = Object.keys(grouped)
                        .sort((a, b) => a.localeCompare(b))
                        .flatMap((courseKey) => grouped[courseKey]);

                    setTasks(sortedTasks);
                }
            };
            fetchTasks();
        }, [parsedUser?.uid])
    );

    const handleSignOut = () => {
        Alert.alert('Signed out');
        router.replace('/');
    };

    const handleTaskPress = (taskId: string) => {
        router.push({
            pathname: '/task',
            params: { taskId: taskId, uid: parsedUser.uid },
        });
    };

    const getStatusStyle = (status: Task['status']) => {
        switch (status) {
            case 'not_started':
                return { color: '#999', icon: 'pause-circle-outline', label: 'Not Started' };
            case 'in_progress':
                return { color: '#007bff', icon: 'play-circle-outline', label: 'In Progress' };
            case 'completed':
                return { color: '#28a745', icon: 'checkmark-done-circle-outline', label: 'Completed' };
            default:
                return { color: '#ccc', icon: 'help-circle-outline', label: 'Unknown' };
        }
    };

    const getPriorityStars = (priority: number): string => {
        return '★'.repeat(priority + 1);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome, {username}</Text>
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: '/task',
                            params: { uid: parsedUser?.uid },
                        })
                    }
                >
                    <Ionicons name="add-circle-outline" size={28} color="blue" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.taskList}>
                {tasks.map((task) => {
                    const deadlineDate = task.deadline.toDate();
                    const timeLeft = deadlineDate.getTime() - new Date().getTime();
                    const deadlineText = formatDistanceToNow(deadlineDate, { addSuffix: true });

                    let deadlineColor = '#555';
                    let isUrgent = false;

                    if (timeLeft < 0) {
                        deadlineColor = 'red';
                    } else if (timeLeft < 24 * 60 * 60 * 1000) {
                        isUrgent = true;
                    }

                    const { color, icon, label } = getStatusStyle(task.status);

                    return (
                        <TouchableOpacity
                            key={task.id}
                            style={styles.taskItem}
                            onPress={() => handleTaskPress(task.id)}
                        >
                            <View style={styles.taskNameRow}>
                                <Text style={styles.taskName}>
                                    {task.name}
                                    <Text style={styles.courseText}> ({task.course})</Text>
                                </Text>
                                <Text style={styles.priorityStars}>{getPriorityStars(task.priority)}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                <Ionicons name="hourglass-outline" size={16} color={deadlineColor} style={{ marginRight: 6 }} />
                                <Text style={[styles.deadline, { color: deadlineColor }]}>
                                    Due {deadlineText}
                                </Text>
                                {isUrgent && (
                                    <Text style={{ color: 'red', fontWeight: 'bold', marginLeft: 6 }}>
                                        (URGENT)
                                    </Text>
                                )}
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                                <Ionicons name={icon as any} size={18} color={color} style={{ marginRight: 6 }} />
                                <Text style={{ color, fontWeight: '600' }}>{label}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={{ marginTop: 100 }}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSignOut}>
                    <Text style={styles.saveButtonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    taskList: {
        flex: 1,
    },
    taskItem: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    taskNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskName: {
        fontSize: 18,
        fontWeight: '600',
        flexShrink: 1,
        marginRight: 10,
    },
    priorityStars: {
        fontSize: 16,
        color: '#f5b301',
        fontWeight: 'bold',
    },
    deadline: {
        fontSize: 12,
        marginTop: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#222',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20,
        width: '80%',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    courseText: {
        color: '#888',
        fontSize: 14,
    },
});