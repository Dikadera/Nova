// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

let analyticsInstance = null;
try {
  analyticsInstance = getAnalytics(app);
} catch (e) {
  console.warn("Firebase Analytics could not be initialized (likely blocked by browser settings).", e);
}
export const analytics = analyticsInstance;

export const auth = getAuth(app);
export const db = getFirestore(app);
