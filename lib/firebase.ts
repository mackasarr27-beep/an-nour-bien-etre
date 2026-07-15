import type { FirebaseOptions } from "firebase/app";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const rawFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

const firebaseConfig: FirebaseOptions = {
  apiKey: rawFirebaseConfig.apiKey.trim(),
  authDomain: rawFirebaseConfig.authDomain.trim(),
  projectId: rawFirebaseConfig.projectId.trim(),
  storageBucket: rawFirebaseConfig.storageBucket.trim(),
  messagingSenderId: rawFirebaseConfig.messagingSenderId.trim(),
  appId: rawFirebaseConfig.appId.trim(),
};

console.log("Firebase env raw:", rawFirebaseConfig);
console.log("Firebase config trimmed:", firebaseConfig);

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length) {
  console.error("Firebase environment variables missing or empty:", missingKeys);
}

let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

try {
  if (missingKeys.length === 0) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);

    if (typeof window !== "undefined") {
      auth = getAuth(app);
      storage = getStorage(app);
    }
  }
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
}

export { db, auth, storage };
export default app;
