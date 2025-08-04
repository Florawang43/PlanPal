import AsyncStorage from '@react-native-async-storage/async-storage';

const SYNC_QUEUE_KEY = 'TASKS_SYNC_QUEUE';

export type SyncAction = {
  op: 'create' | 'update' | 'delete';
  task: any;
  id?: string;
};

export const getSyncQueue = async (uid: string) => {
  const data = await AsyncStorage.getItem(`${SYNC_QUEUE_KEY}_${uid}`);
  return data ? JSON.parse(data) : [];
};

export const addToSyncQueue = async (uid: string, action: SyncAction) => {
  const queue = await getSyncQueue(uid);
  queue.push(action);
  await AsyncStorage.setItem(`${SYNC_QUEUE_KEY}_${uid}`, JSON.stringify(queue));
};

export const setSyncQueue = async (uid: string, queue: SyncAction[]) => {
  await AsyncStorage.setItem(`${SYNC_QUEUE_KEY}_${uid}`, JSON.stringify(queue));
};