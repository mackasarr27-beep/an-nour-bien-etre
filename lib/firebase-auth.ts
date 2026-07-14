import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export type UserRole = "admin" | "client";

export type AuthProfile = {
  uid: string;
  email: string;
  role: UserRole;
};

export const ADMIN_EMAILS = ["mackasarr27@gmail.com"];

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

function isAdminEmail(email?: string | null) {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
}

function getAuthOrThrow() {
  if (!auth) {
    throw new Error("Firebase Auth is not configured. Please check the Firebase environment variables.");
  }
  return auth;
}

export async function ensureUserProfile(user: User | null): Promise<AuthProfile | null> {
  if (!user || !db) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const role: UserRole = isAdminEmail(user.email) ? "admin" : "client";

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email ?? "",
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(
      ref,
      {
        uid: user.uid,
        email: user.email ?? "",
        role,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  return { uid: user.uid, email: user.email ?? "", role };
}

export async function signInWithFirebase(email: string, password: string) {
  const authInstance = getAuthOrThrow();
  const result = await signInWithEmailAndPassword(authInstance, email, password);
  await ensureUserProfile(result.user);
  return result;
}

export async function registerWithFirebase(email: string, password: string) {
  const authInstance = getAuthOrThrow();
  const result = await createUserWithEmailAndPassword(authInstance, email, password);
  await ensureUserProfile(result.user);
  return result;
}

export async function signInWithGoogle() {
  const authInstance = getAuthOrThrow();
  const result = await signInWithPopup(authInstance, googleProvider);
  await ensureUserProfile(result.user);
  return result;
}

export async function signOutSecure() {
  const authInstance = getAuthOrThrow();
  await signOut(authInstance);
}

export function listenToAuthState(callback: (user: User | null, profile: AuthProfile | null) => void) {
  if (!auth) {
    callback(null, null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, async (user) => {
    const profile = await ensureUserProfile(user);
    callback(user, profile);
  });
}
