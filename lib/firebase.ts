import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC7U-Wn6clgx-QrBtarxwfMtf9elfFLXPM",
  authDomain: "an-nour-bien-etre-2026.firebaseapp.com",
  projectId: "an-nour-bien-etre-2026",
  storageBucket: "an-nour-bien-etre-2026.firebasestorage.app",
  messagingSenderId: "1085307872775",
  appId: "1:1085307872775:web:15a2f6adfd426ca3bf2ca2",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
export default app;
