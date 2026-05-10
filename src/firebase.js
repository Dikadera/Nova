// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeiyP6oYNCUGhvtuUQxgJ48oto_sDQgFE",
  authDomain: "nova-websbank.firebaseapp.com",
  projectId: "nova-websbank",
  storageBucket: "nova-websbank.firebasestorage.app",
  messagingSenderId: "29832970840",
  appId: "1:29832970840:web:23c5441bcfd14abdc0002d",
  measurementId: "G-VTJD79G2MS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
