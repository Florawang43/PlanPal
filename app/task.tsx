import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../services/task_service';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { scheduleReminder } from '../utils/notification_util';

export default function TaskDetailPage() {
  const { taskId, uid } = useLocalSearchParams();
  const router = useRouter();
  const isNewTask = !taskId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [course, setCourse] = useState('');
  const [priority, setPriority] = useState<0 | 1 | 2 | 3>(1);

  useEffect(() => {
    if (uid && taskId) {
      const fetchTask = async () => {
        const data = await getTaskById(uid as string, taskId as string);
        if (data != null) {
          setName(data.name);
          setDescription(data.description);
          setDeadline(data.deadline.toDate());
          setStatus(data.status);
          setCourse(data.course || '');
          setPriority(data.priority ?? 1);
        }
      };
      fetchTask();
    }
  }, [uid, taskId]);

  const handleSave = async () => {
    if (!uid) return;
    try {
      const taskData = {
        name,
        description,
        deadline,
        status,
        course,
        priority,
      };
      if (isNewTask) {
        await createTask(uid as string, taskData);
        Alert.alert('Task created');
      } else {
        await updateTask(uid as string, taskId as string, taskData);
        Alert.alert('Task updated');
      }
      if (scheduleReminder(name, description, deadline)) {
        Alert.alert('Reminder set!');
      }
      router.replace({
        pathname: '/home',
        params: { user: JSON.stringify({ uid }) },
      });
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
      router.replace({
        pathname: '/home',
        params: { user: JSON.stringify({ uid }) },
      });
    } catch (err) {
      Alert.alert('Error deleting task');
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
            {!isNewTask ? (
              <Ionicons
                name="trash-outline"
                size={24}
                color="red"
                onPress={handleDelete}
              />
            ) : (
              <View style={{ width: 28 }} />
            )}
          </View>

          <Text style={styles.label}>Task Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Deadline</Text>
          <Button
            title={deadline.toLocaleString()}
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={deadline}
              mode="datetime"
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDeadline(selectedDate);
                }
              }}
            />
          )}

          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
            >
              <Picker.Item label="Active" value="active" />
              <Picker.Item label="Inactive" value="inactive" />
            </Picker>
          </View>

          <Text style={styles.label}>Course</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter course"
            value={course}
            onChangeText={setCourse}
          />

          <Text style={styles.label}>Priority</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={priority}
              onValueChange={(itemValue) => setPriority(itemValue)}
            >
              <Picker.Item label="Low" value={0} />
              <Picker.Item label="Normal" value={1} />
              <Picker.Item label="High" value={2} />
              <Picker.Item label="Critical" value={3} />
            </Picker>
          </View>

          <Button title="Save Task" onPress={handleSave} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
});