import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
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

export const ADMIN_EMAILS = ["admin@an-nour-bien-etre.com"];

function isAdminEmail(email?: string | null) {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
}

export async function ensureUserProfile(user: User | null): Promise<AuthProfile | null> {
  if (!user) return null;

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
  const result = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(result.user);
  return result;
}

export async function registerWithFirebase(email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(result.user);
  return result;
}

export async function signOutSecure() {
  await signOut(auth);
}

export function listenToAuthState(callback: (user: User | null, profile: AuthProfile | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    const profile = await ensureUserProfile(user);
    callback(user, profile);
  });
}
