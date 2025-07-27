import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile } from "../services/user_profile_service";

export const signUpNewUser = async (
  username: string,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await createUserProfile(user.uid, username, email);

  await sendEmailVerification(user);

  return user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await user.reload();

  if (!user.emailVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  return user;
};
