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
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white dark:bg-gray-950 rounded-xl shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold">Tableau de bord administrateur</h1>
        <p className="text-sm text-gray-500">Gestion des produits, commandes et clients.</p>
      </div>
      <button onClick={handleSignOut} className="px-4 py-2 bg-red-600 text-white rounded-full">Déconnexion</button>
    </header>
  );
}
