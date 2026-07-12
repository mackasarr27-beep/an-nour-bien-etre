"use client";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { listenToAuthState, type AuthProfile } from "../lib/firebase-auth";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenToAuthState((u, p) => {
      setUser(u);
      setProfile(p);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, profile, loading } as const;
}
