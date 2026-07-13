"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithFirebase, signInWithGoogle } from "../../lib/firebase-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithFirebase(email, password);
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la connexion";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connexion Google impossible";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Connexion</h1>
        <p className="mt-2 text-sm text-gray-500">Accédez à votre espace personnel et gérez vos réservations.</p>
        <form onSubmit={signIn} className="mt-6 flex flex-col gap-4">
          <input className="rounded-2xl border border-gray-200 px-3 py-3" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="rounded-2xl border border-gray-200 px-3 py-3" placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-4 py-3 font-semibold text-white">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <button type="button" onClick={handleGoogle} disabled={loading} className="rounded-full border border-gray-200 px-4 py-3 font-semibold text-gray-700">
            Continuer avec Google
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-500">
          Pas encore de compte ? <Link href="/register" className="font-semibold text-emerald-600">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}
