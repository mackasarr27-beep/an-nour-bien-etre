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

export const ADMIN_EMAILS = ["mackasarr27@gmail.com", "nouruah@gmail.com"];

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isAdminEmail(email?: string | null) {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
}

function getAuthErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code?: string }).code) : "";

  switch (code) {
    case "auth/invalid-email":
      return "Veuillez saisir une adresse email valide.";
    case "auth/user-not-found":
      return "Email ou mot de passe incorrect.";
    case "auth/wrong-password":
      return "Email ou mot de passe incorrect.";
    case "auth/invalid-credential":
      return "Email ou mot de passe incorrect.";
    case "auth/user-disabled":
      return "Ce compte a été désactivé.";
    case "auth/too-many-requests":
      return "Trop de tentatives. Veuillez réessayer plus tard.";
    case "auth/email-already-in-use":
      return "Un compte existe déjà avec cette adresse email.";
    case "auth/popup-closed-by-user":
      return "La fenêtre de connexion Google a été fermée.";
    default:
      return "Une erreur est survenue. Veuillez réessayer.";
  }
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
  if (!auth) {
    throw new Error("Le service d’authentification n’est pas disponible pour le moment.");
  }

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error("Veuillez saisir une adresse email valide.");
  }

  if (!password || !password.trim()) {
    throw new Error("Veuillez saisir un mot de passe.");
  }

  try {
    const result = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    await ensureUserProfile(result.user);
    return result;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function registerWithFirebase(email: string, password: string) {
  if (!auth) {
    throw new Error("Le service d’authentification n’est pas disponible pour le moment.");
  }

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error("Veuillez saisir une adresse email valide.");
  }

  if (!password || !password.trim()) {
    throw new Error("Veuillez saisir un mot de passe.");
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    await ensureUserProfile(result.user);
    return result;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function signInWithGoogle() {
  if (!auth) {
    throw new Error("Le service d’authentification n’est pas disponible pour le moment.");
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    await ensureUserProfile(result.user);
    return result;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function signOutSecure() {
  if (!auth) return;
  await signOut(auth);
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
