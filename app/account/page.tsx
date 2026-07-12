"use client";
import React from "react";
import Link from "next/link";
import useAuth from "../../hooks/useAuth";
import { signOutSecure } from "../../lib/firebase-auth";

export default function AccountPage() {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="px-4 py-12 text-sm text-gray-500">Chargement du compte...</div>;
  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Mon compte</h1>
          <p className="mt-3 text-sm text-gray-500">Connectez-vous pour accéder à votre espace personnel.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">Connexion</Link>
            <Link href="/register" className="rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold">Créer un compte</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Mon compte</h1>
        <p className="mt-2 text-sm text-gray-500">Bienvenue, {user.email}</p>
        <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
          <div>Rôle : {profile?.role === "admin" ? "Administrateur" : "Utilisateur"}</div>
          <div className="mt-2">Email : {user.email}</div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => signOutSecure()} className="rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white">Déconnexion</button>
          {profile?.role === "admin" && (
            <Link href="/admin/dashboard" className="rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold">Administration</Link>
          )}
        </div>
      </div>
    </div>
  );
}
