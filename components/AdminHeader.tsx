"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { signOutSecure } from "../lib/firebase-auth";

export default function AdminHeader() {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOutSecure();
    router.push("/");
  };
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-emerald-900/10 bg-white/95 p-4 shadow-[0_16px_40px_rgba(15,118,110,0.08)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tableau de bord administrateur</h1>
        <p className="text-sm text-slate-600">Gestion des produits, commandes et clients.</p>
      </div>
      <button onClick={handleSignOut} className="rounded-full bg-rose-700 px-4 py-2 font-semibold text-white transition hover:bg-rose-800">Déconnexion</button>
    </header>
  );
}
