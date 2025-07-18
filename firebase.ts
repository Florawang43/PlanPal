import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvlstozjoE94nFbnvNltnCL1rRwo_OkvE",
  authDomain: "planpal-264fb.firebaseapp.com",
  projectId: "planpal-264fb",
  storageBucket: "planpal-264fb.appspot.com",
  messagingSenderId: "1061955625733",
  appId: "1:1061955625733:web:3d40e7e9d47b95fcb38d6c",
  measurementId: "G-M6MTRM8CCR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
