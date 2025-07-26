import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} from '../services/task_service';
import { Ionicons } from '@expo/vector-icons';

export default function TaskDetailPage() {
    const { taskId, uid } = useLocalSearchParams();
    const router = useRouter();
    const isNewTask = !taskId;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');

    useEffect(() => {
        if (uid && taskId) {
            const fetchTask = async () => {
                const data = await getTaskById(uid as string, taskId as string);
                if (data != null) {
                    setName(data.name);
                    setDescription(data.description);
                    setDeadline(data.deadline.toDate().toISOString().slice(0, 16)); // yyyy-MM-ddTHH:mm
                    setStatus(data.status);
                }
            };
            fetchTask();
        }
    }, [uid, taskId]);

    const handleSave = async () => {
        if (!uid) return;
        try {
            const deadlineDate = new Date(deadline);
            const taskData = { name, description, deadline: deadlineDate, status };

            if (isNewTask) {
                await createTask(uid as string, taskData);
                Alert.alert('Task created');
            } else {
                await updateTask(uid as string, taskId as string, taskData);
                Alert.alert('Task updated');
            }

            router.replace({ pathname: '/home', params: { user: JSON.stringify({ uid }) } });
        } catch (err) {
            Alert.alert('Error saving task');
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!uid || !taskId) return;
        try {
            await deleteTask(uid as string, taskId as string);
            Alert.alert('Task deleted');
            router.replace({ pathname: '/home', params: { user: JSON.stringify({ uid }) } });
        } catch (err) {
            Alert.alert('Error deleting task');
            console.error(err);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons
                    name="arrow-back"
                    size={28}
                    color="black"
                    onPress={() => router.back()}
                />
                <Text style={styles.title}>
                    {isNewTask ? 'Create New Task' : 'Edit Task'}
                </Text>
                <View style={{ width: 28 }} />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Task Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Deadline (YYYY-MM-DDTHH:mm)"
                value={deadline}
                onChangeText={setDeadline}
            />
            <TextInput
                style={styles.input}
                placeholder="Status (active/inactive)"
                value={status}
                onChangeText={(val) =>
                    setStatus(val === 'active' || val === 'inactive' ? val : 'inactive')
                }
            />
            <Button title="Save Task" onPress={handleSave} />
            {!isNewTask && (
                <Button title="Delete Task" color="red" onPress={handleDelete} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    }
});