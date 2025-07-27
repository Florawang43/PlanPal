import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCP-4GMg73OcpUNjURALdK7uMDwsBjoSbE",
  authDomain: "securitycrudapp.firebaseapp.com",
  projectId: "securitycrudapp",
  storageBucket: "securitycrudapp.firebasestorage.app",
  messagingSenderId: "66376414628",
  appId: "1:66376414628:web:8d924da079553333517d31",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
