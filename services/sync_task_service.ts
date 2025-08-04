import { 
  getTasksForUser, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask 
} from './task_service';
import { 
  getLocalTasks, 
  setLocalTasks, 
  updateLocalTask, 
  deleteLocalTask 
} from './local_task_service';
import { 
  getSyncQueue, 
  addToSyncQueue, 
  setSyncQueue 
} from './task_sync_queue';
import { isOnline } from '../utils/network';

export const getTasks = async (uid: string) => {
  let localTasks = await getLocalTasks(uid);
  if (await isOnline()) {
    const remoteTasks = await getTasksForUser(uid);
    await setLocalTasks(uid, remoteTasks);
    return remoteTasks;
  }
  return localTasks;
};

export const getTask = async (uid: string, taskId: string) => {
  const tasks = await getLocalTasks(uid);
  const task = tasks.find((t: any) => t.id === taskId);
  if (task) return task;
  if (await isOnline()) {
    const remoteTask = await getTaskById(uid, taskId);
    if (remoteTask) await updateLocalTask(uid, { id: taskId, ...remoteTask });
    return remoteTask;
  }
  return null;
};

export const saveTask = async (
  uid: string,
  task: any,
  id?: string,
  isNew: boolean = false
) => {
  if (!id) id = task.id;
  await updateLocalTask(uid, { ...task, id });

  await addToSyncQueue(uid, {
    op: isNew ? 'create' : 'update',
    task: { ...task, id }
  });

  if (await isOnline()) {
    await syncTasksWithServer(uid);
  }
};

export const removeTask = async (uid: string, taskId: string) => {
  await deleteLocalTask(uid, taskId);
  await addToSyncQueue(uid, { op: 'delete', id: taskId, task: { id: taskId } });
  if (await isOnline()) {
    await syncTasksWithServer(uid);
  }
};

export const syncTasksWithServer = async (uid: string) => {
  const queue = await getSyncQueue(uid);
  const newQueue = [];
  for (const action of queue) {
    try {
      if (action.op === 'create') {
        await createTask(uid, action.task);
      } else if (action.op === 'update') {
        await updateTask(uid, action.task.id, action.task);
      } else if (action.op === 'delete') {
        await deleteTask(uid, action.id);
      }
    } catch (e) {
      newQueue.push(action);
    }
  }
  await setSyncQueue(uid, newQueue);
};