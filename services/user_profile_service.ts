import { db } from "../utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

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

export const getUserProfile = async (uid: string) => {
  try {
    const userRef = doc(db, "user_profiles", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Failed to fetch user profile: " + (error as Error).message);
  }
};