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
  firstName: string;
  lastName: string;
  displayName: string;
  isActive: boolean;
}

// CREATE
export async function createUserProfile(profile: Omit<UserProfile, "createdAt" | "isActive">) {
  const userRef = doc(db, "users", profile.uid);
  await setDoc(userRef, {
    uid: profile.uid,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    isActive: true,
    createdAt: serverTimestamp(),
  });
}

// READ
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

// UPDATE
export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
}

// DELETE
export async function deleteUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
}

// LIST ACTIVE USERS
export async function listActiveUsers(): Promise<UserProfile[]> {
  const q = query(collection(db, "users"), where("isActive", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserProfile);
}
