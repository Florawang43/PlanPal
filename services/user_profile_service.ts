import { db } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";

export const createUserProfile = async (uid: string, username: string, email: string) => {
  try {
    await setDoc(doc(db, "user_profiles", uid), {
      uid,
      username,
      email,
      createdAt: new Date()
    });
    return uid;
  } catch (error) {
    throw new Error("Failed to create user profile: " + (error as Error).message);
  }
};