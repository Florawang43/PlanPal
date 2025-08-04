import { View, Text, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { getTasksForUser } from '../services/task_service';
import { Timestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { getUserProfile } from '../services/user_profile_service';

type Task = {
    id: string;
    name: string;
    description: string;
    deadline: Timestamp;
    status: 'active' | 'inactive';
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
                    (data as Task[]).forEach((task) => {
                        if (!grouped[task.course]) {
                            grouped[task.course] = [];
                        }
                        grouped[task.course].push(task);
                    });

                    Object.keys(grouped).forEach((course) => {
                        grouped[course].sort((a, b) => a.priority - b.priority);
                    });

                    const sortedTasks = Object.keys(grouped)
                        .sort((a, b) => a.localeCompare(b))
                        .flatMap((course) => grouped[course]);

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
                {tasks.map((task) => (
                    <TouchableOpacity
                        key={task.id}
                        style={styles.taskItem}
                        onPress={() => handleTaskPress(task.id)}
                    >
                        <Text style={styles.taskName}>{task.name}</Text>
                        <Text>{task.description}</Text>
                        <Text style={styles.deadline}>
                            Deadline: {task.deadline.toDate().toLocaleString()}
                        </Text>
                        <Text style={{ color: task.status === 'active' ? 'green' : 'gray' }}>
                            {task.status.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
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
    taskName: {
        fontSize: 18,
        fontWeight: '600',
    },
    deadline: {
        fontSize: 12,
        color: '#555',
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
        width: '80%'
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});