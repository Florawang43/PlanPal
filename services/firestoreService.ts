import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export interface UserProfile {
  uid: string;
  email: string;
  createdAt: any;
  displayName?: string;
}

export async function createUserProfile(profile: Omit<UserProfile, "createdAt">) {
  const userRef = doc(db, "users", profile.uid);
  await setDoc(userRef, {
    ...profile,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
}

export async function deleteUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
}

export async function listActiveUsers(): Promise<UserProfile[]> {
  const q = query(
    collection(db, "users"),
    where("isActive", "==", true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserProfile);
}
