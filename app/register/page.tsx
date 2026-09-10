"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerWithFirebase, signInWithGoogle } from "../../lib/firebase-auth";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await registerWithFirebase(email, password);
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'inscription";
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
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-14">
      <div className="rounded-[28px] border border-emerald-900/10 bg-white/95 p-6 shadow-[0_24px_70px_rgba(15,118,110,0.14)] sm:p-8">
        <Link href="/" className="mb-8 inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">← Retour</Link>
        <div className="flex items-center gap-3">
          <Image src="/Bannière.png" alt="AN NOUR BIEN-ÊTRE" width={48} height={48} className="rounded-2xl object-contain" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">AN NOUR BIEN-ÊTRE</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Créer un compte</h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">Inscrivez-vous pour réserver et suivre votre expérience.</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">Email
            <input className="rounded-2xl border border-emerald-900/20 px-4 py-3 font-normal text-slate-900" placeholder="Votre adresse e-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">Mot de passe
            <input className="rounded-2xl border border-emerald-900/20 px-4 py-3 font-normal text-slate-900" placeholder="Votre mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</div>}
          <button type="submit" disabled={loading} className="rounded-full bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Création..." : "S'inscrire"}
          </button>
          <button type="button" onClick={handleGoogle} disabled={loading} className="rounded-full border border-emerald-900/15 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60">
            Continuer avec Google
          </button>
        </form>
      </div>
    </div>
  );
}
