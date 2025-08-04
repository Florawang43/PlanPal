import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'TASKS_CACHE';

export const getLocalTasks = async (uid: string) => {
  const data = await AsyncStorage.getItem(`${TASKS_KEY}_${uid}`);
  return data ? JSON.parse(data) : [];
};

export const setLocalTasks = async (uid: string, tasks: any[]) => {
  await AsyncStorage.setItem(`${TASKS_KEY}_${uid}`, JSON.stringify(tasks));
};

export const updateLocalTask = async (uid: string, task: any) => {
  const tasks = await getLocalTasks(uid);
  const idx = tasks.findIndex((t: any) => t.id === task.id);
  if (idx > -1) {
    tasks[idx] = task;
  } else {
    tasks.push(task);
  }
  await setLocalTasks(uid, tasks);
};

export const deleteLocalTask = async (uid: string, taskId: string) => {
  const tasks = await getLocalTasks(uid);
  const newTasks = tasks.filter((t: any) => t.id !== taskId);
  await setLocalTasks(uid, newTasks);
};