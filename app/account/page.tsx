"use client";
import React from "react";
import Link from "next/link";
import useAuth from "../../hooks/useAuth";
import { signOutSecure } from "../../lib/firebase-auth";
import ClientMessages from "../../components/ClientMessages";

export default function AccountPage() {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="px-4 py-12 text-sm font-medium text-slate-600">Chargement du compte...</div>;
  if (!user) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
        <div className="rounded-[24px] border border-emerald-100 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,118,110,0.12)] sm:p-7">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Mon compte</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Connectez-vous pour accéder à votre espace personnel.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/login" className="rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">Connexion</Link>
            <Link href="/register" className="rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">Créer un compte</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
      <div className="rounded-[24px] border border-emerald-900/10 bg-white/95 p-5 shadow-[0_24px_70px_rgba(15,118,110,0.14)] sm:p-8">
        <Link href="/" className="inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">← Retour</Link>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Espace personnel</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Mon compte</h1>
        <p className="mt-2 break-all text-sm leading-6 text-slate-600">Bienvenue, {user.email}</p>
        <div className="mt-6 divide-y divide-emerald-900/10 rounded-2xl border border-emerald-900/10 bg-emerald-50/70 text-sm">
          <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="font-semibold text-slate-600">Email</span>
            <span className="break-all text-slate-900">{user.email}</span>
          </div>
          <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="font-semibold text-slate-600">Rôle</span>
            <span className="font-semibold text-slate-900">{profile?.role === "admin" ? "Administrateur" : "Utilisateur"}</span>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/account/settings" className="rounded-full border border-emerald-900/15 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">Paramètres</Link>
          {profile?.role === "admin" && (
            <Link href="/admin/dashboard" className="rounded-full bg-emerald-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800">Administrateur</Link>
          )}
          <button onClick={() => signOutSecure()} className="rounded-full bg-rose-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-800">Déconnexion</button>
        </div>
      </div>
      <ClientMessages user={user} />
    </div>
  );
}
