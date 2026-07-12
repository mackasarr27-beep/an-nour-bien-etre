"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_EMAILS, registerWithFirebase, signInWithFirebase, signInWithGoogle } from "../../lib/firebase-auth";
import useAuth from "../../hooks/useAuth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@an-nour-bien-etre.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && profile?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [authLoading, profile?.role, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithFirebase(email, password);
      const isAdmin = ADMIN_EMAILS.includes((result.user.email || "").toLowerCase());
      router.replace(isAdmin ? "/admin/dashboard" : "/");
    } catch (err: any) {
      setError(err.message || "Connexion impossible");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerWithFirebase(email, password);
      const isAdmin = ADMIN_EMAILS.includes((result.user.email || "").toLowerCase());
      router.replace(isAdmin ? "/admin/dashboard" : "/");
    } catch (err: any) {
      setError(err.message || "Création du compte impossible");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      const isAdmin = ADMIN_EMAILS.includes((result.user.email || "").toLowerCase());
      router.replace(isAdmin ? "/admin/dashboard" : "/");
    } catch (err: any) {
      setError(err.message || "Connexion Google impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-gray-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Administration</p>
          <h1 className="mt-2 text-3xl font-semibold">Connexion sécurisée</h1>
          <p className="mt-3 text-sm text-gray-500">Accès réservé au propriétaire du site An Nour Bien-Être.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-2xl border border-gray-200 px-4 py-3" placeholder="Email administrateur" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-2xl border border-gray-200 px-4 py-3" placeholder="Mot de passe" />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-emerald-600 px-4 py-3 font-semibold text-white">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <button type="button" onClick={handleCreateAdmin} disabled={loading} className="w-full rounded-full border border-gray-200 px-4 py-3 font-semibold text-gray-700">
            {loading ? "Création..." : "Créer le compte administrateur"}
          </button>
          <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="w-full rounded-full border border-emerald-200 bg-emerald-50 px-4 py-3 font-semibold text-emerald-700">
            {loading ? "Connexion..." : "Se connecter avec Google"}
          </button>
        </form>
      </div>
    </div>
  );
}
