import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCWxEtaa5wq9PtkpVEEzSU7vtZDN4gtbV4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sdps-health-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sdps-health-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sdps-health-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1096125543138",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1096125543138:web:85db490245c758737ce4bb"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
googleProvider.addScope('email');
googleProvider.addScope('profile');

export {
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
};
export default app;
