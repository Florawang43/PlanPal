import { db } from "../utils/firebase";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

export const getTasksForUser = async (uid: string) => {
  const tasksRef = collection(db, "user_profiles", uid, "tasks");
  const snapshot = await getDocs(tasksRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getTaskById = async (uid: string, taskId: string) => {
  const taskRef = doc(db, "user_profiles", uid, "tasks", taskId);
  const snapshot = await getDoc(taskRef);
  if (snapshot.exists()) {
    return snapshot.data();
  }
  return null;
};

export const createTask = async (
  uid: string,
  task: { name: string; course: string; description: string; deadline: Date; status: string; priority: number }
) => {
  const taskData = {
    ...task,
    deadline: Timestamp.fromDate(task.deadline),
  };
  const ref = await addDoc(
    collection(db, "user_profiles", uid, "tasks"),
    taskData
  );
  return ref.id;
};

export const updateTask = async (
  uid: string,
  taskId: string,
  updates: { name: string; course: string; description: string; deadline: Date; status: string; priority: number }
) => {
  const taskRef = doc(db, "user_profiles", uid, "tasks", taskId);
  return await setDoc(
    taskRef,
    {
      ...updates,
      deadline: Timestamp.fromDate(updates.deadline),
    },
    { merge: true }
  );
};

export const deleteTask = async (uid: string, taskId: string) => {
  const taskRef = doc(db, "user_profiles", uid, "tasks", taskId);
  return await deleteDoc(taskRef);
};
