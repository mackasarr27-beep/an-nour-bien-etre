"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import WhatsAppButton from "./WhatsAppButton";
import CallButton from "./CallButton";
import useAuth from "../hooks/useAuth";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/services", label: "Nos soins" },
  { href: "/shop", label: "Boutique" },
  { href: "/appointments", label: "Rendez-vous" },
  { href: "/gallery", label: "Galerie" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { profile, loading } = useAuth();
  const isAdmin = !loading && profile?.role === "admin";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-900/10 bg-[linear-gradient(100deg,rgba(255,255,255,0.96),rgba(236,250,246,0.92),rgba(244,248,255,0.94))] text-slate-800 shadow-[0_8px_30px_rgba(15,118,110,0.06)] backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 2xl:px-8">
        <div className="flex min-h-16 items-center gap-3 2xl:grid 2xl:grid-cols-[auto_1fr_auto] 2xl:gap-5">
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap">
              <Image src="/logo.png" alt="AN NOUR BIEN-ÊTRE" width={44} height={44} className="rounded object-contain" />
              <span className="text-sm font-semibold tracking-wide text-emerald-950 2xl:text-base">AN NOUR</span>
            </Link>
          </div>

          <nav className="hidden min-w-0 items-center justify-center gap-3 2xl:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="shrink-0 whitespace-nowrap text-[13px] font-medium text-slate-700 transition hover:text-emerald-700">
                {l.label}
              </Link>
            ))}
            {isAdmin && (
                <Link href="/admin/dashboard" className="ml-1 shrink-0 whitespace-nowrap rounded-full bg-emerald-700 px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-emerald-800">
                Administration
              </Link>
            )}
          </nav>

          <div className="hidden shrink-0 items-center justify-end gap-1 2xl:flex">
            <a href="/search" className="whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800">Recherche</a>
            <a href="/cart" className="whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800">Panier</a>
            <Link href="/account" className="whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800">Mon compte</Link>
            <WhatsAppButton />
            <CallButton />
          </div>

          <div className="ml-auto flex items-center 2xl:hidden">
            <button
              aria-label="Menu"
              className="rounded-full border border-emerald-900/15 bg-white/80 p-2 shadow-sm transition hover:scale-105"
              onClick={() => setOpen((v) => !v)}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 6L18 18M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-30 bg-black/70 backdrop-blur-sm transition-opacity duration-300 2xl:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setOpen(false)} />

      <div className={`fixed inset-x-3 top-16 z-40 mx-auto max-w-2xl rounded-2xl border border-emerald-900/15 bg-white p-4 text-slate-900 shadow-2xl transition-all duration-300 2xl:hidden ${open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"}`}>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-900">Navigation</span>
          <button className="rounded-full border border-slate-200 bg-slate-100 p-2 text-slate-900 transition hover:bg-slate-200" onClick={() => setOpen(false)} aria-label="Fermer le menu">✕</button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-xl px-3 py-3 font-medium text-slate-800 transition hover:bg-emerald-50 hover:text-emerald-800" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/search" className="rounded-xl border border-emerald-900/15 bg-emerald-50 px-3 py-3 font-medium text-emerald-900 transition hover:bg-emerald-100" onClick={() => setOpen(false)}>
            🔍 Recherche
          </Link>
          <Link href="/cart" className="rounded-xl border border-emerald-900/15 bg-emerald-50 px-3 py-3 font-medium text-emerald-900 transition hover:bg-emerald-100" onClick={() => setOpen(false)}>
            🛒 Panier
          </Link>
          {isAdmin && (
            <Link href="/admin/dashboard" className="rounded-xl bg-emerald-600 px-3 py-3 text-center font-semibold text-white" onClick={() => setOpen(false)}>
              Administration
            </Link>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/account" className="rounded-full border border-emerald-900/15 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900" onClick={() => setOpen(false)}>
              Mon compte
            </Link>
            <WhatsAppButton />
            <CallButton />
          </div>
        </div>
      </div>
    </header>
  );
}
