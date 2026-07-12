"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerWithFirebase, signInWithFirebase } from "../../lib/firebase-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithFirebase(email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion");
    }
  };

  const register = async () => {
    try {
      await registerWithFirebase(email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Connexion</h1>
      <form onSubmit={signIn} className="mt-6 flex flex-col gap-4">
        <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Se connecter</button>
          <button type="button" onClick={register} className="px-4 py-2 border rounded">Créer un compte</button>
        </div>
      </form>
    </div>
  );
}
