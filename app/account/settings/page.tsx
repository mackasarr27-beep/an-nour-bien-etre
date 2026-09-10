"use client";

import Link from "next/link";
import useAuth from "../../../hooks/useAuth";

export default function AccountSettingsPage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="px-4 py-12 text-sm font-medium text-slate-600">Chargement des paramètres...</div>;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
        <div className="rounded-[24px] border border-emerald-100 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,118,110,0.12)] sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Espace personnel</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Paramètres</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Connectez-vous pour accéder à vos paramètres.</p>
          <Link href="/login" className="mt-6 inline-flex rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">Connexion</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
      <div className="rounded-[24px] border border-emerald-900/10 bg-white/95 p-5 shadow-[0_24px_70px_rgba(15,118,110,0.14)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Espace personnel</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Paramètres</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Les paramètres de votre compte seront disponibles ici.</p>
        <Link href="/account" className="mt-6 inline-flex rounded-full border border-emerald-900/15 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">Retour à Mon compte</Link>
      </div>
    </div>
  );
}