import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
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
import DropDownPicker from 'react-native-dropdown-picker';
import { scheduleReminder } from '../utils/notification_util';

export default function TaskDetailPage() {
  const { taskId, uid } = useLocalSearchParams();
  const router = useRouter();
  const isNewTask = !taskId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 2 * 60 * 1000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [course, setCourse] = useState('');

  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [priority, setPriority] = useState<0 | 1 | 2 | 3>(1);
  const [notificationInterval, setNotificationInterval] = useState<24 | 12 | 6>(24);

  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [intervalOpen, setIntervalOpen] = useState(false);

  const [statusItems, setStatusItems] = useState([
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ]);
  const [priorityItems, setPriorityItems] = useState([
    { label: 'Low', value: 0 },
    { label: 'Normal', value: 1 },
    { label: 'High', value: 2 },
    { label: 'Critical', value: 3 },
  ]);
  const [intervalItems, setIntervalItems] = useState([
    { label: 'Every 24 hours', value: 24 },
    { label: 'Every 12 hours', value: 12 },
    { label: 'Every 6 hours', value: 6 },
  ]);

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
          setNotificationInterval(data.notificationInterval ?? 24);
        }
      };
      fetchTask();
    }
  }, [uid, taskId]);

  const generateNotificationSchedule = (
    start: Date,
    end: Date,
    intervalHours: number
  ): Date[] => {
    const schedule: Date[] = [];
    const deadlineReminder = new Date(end.getTime());
    schedule.push(deadlineReminder);
    const oneHourBeforeDeadline = new Date(end.getTime() - 60 * 60 * 1000);
    if (oneHourBeforeDeadline > start && oneHourBeforeDeadline < end) {
      schedule.push(oneHourBeforeDeadline);
    }
    const intervalMillis = intervalHours * 60 * 60 * 1000;
    let current = new Date(start.getTime());
    while (current < end) {
      schedule.push(new Date(current.getTime()));
      current = new Date(current.getTime() + intervalMillis);
    }
    const uniqueTimestamps = Array.from(new Set(schedule.map(d => d.getTime())));
    const uniqueDates = uniqueTimestamps
      .map(ts => new Date(ts))
      .filter(d => d > new Date());
    return uniqueDates;
  };

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
        notificationInterval,
      };
      if (isNewTask) {
        await createTask(uid as string, taskData);
        Alert.alert('Task created');
      } else {
        await updateTask(uid as string, taskId as string, taskData);
        Alert.alert('Task updated');
      }
      const now = new Date();
      const notificationTimes = generateNotificationSchedule(
        now,
        deadline,
        notificationInterval
      );
      let allSucceeded = true;
      for (const time of notificationTimes) {
        const success = await scheduleReminder(name, description, time);
        if (!success) {
          allSucceeded = false;
          break;
        }
      }
      if (allSucceeded) {
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

      <Text style={styles.label}>Course</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter course"
        value={course}
        onChangeText={setCourse}
      />

      <Text style={styles.label}>Task Content</Text>
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
      <DropDownPicker
        open={statusOpen}
        value={status}
        items={statusItems}
        setOpen={setStatusOpen}
        setValue={setStatus}
        setItems={setStatusItems}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={3000}
        zIndexInverse={1000}
        listMode="SCROLLVIEW"
      />

      <Text style={styles.label}>Priority</Text>
      <DropDownPicker
        open={priorityOpen}
        value={priority}
        items={priorityItems}
        setOpen={setPriorityOpen}
        setValue={setPriority}
        setItems={setPriorityItems}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={2000}
        zIndexInverse={2000}
        listMode="SCROLLVIEW"
      />

      <Text style={styles.label}>Notification Interval</Text>
      <DropDownPicker
        open={intervalOpen}
        value={notificationInterval}
        items={intervalItems}
        setOpen={setIntervalOpen}
        setValue={setNotificationInterval}
        setItems={setIntervalItems}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={1000}
        zIndexInverse={3000}
        listMode="SCROLLVIEW"
      />

      <Button title="Save Task" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    zIndex: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    minHeight: 45,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 8,
  },
});