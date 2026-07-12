import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

function readEnv(name: string, fallback: string) {
  const value = process.env[name]?.trim();
  return value ? value : fallback;
}

const firebaseConfig = {
  apiKey: readEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "AIzaSyC7U-Wn6clgx-QrBtarxwfMtf9elfFLXPM"),
  authDomain: readEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "an-nour-bien-etre-2026.firebaseapp.com"),
  projectId: readEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "an-nour-bien-etre-2026"),
  storageBucket: readEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "an-nour-bien-etre-2026.firebasestorage.app"),
  messagingSenderId: readEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "1085307872775"),
  appId: readEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "1:1085307872775:web:15a2f6adfd426ca3bf2ca2"),
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
export default app;
