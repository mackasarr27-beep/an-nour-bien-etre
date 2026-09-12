"use client";
import Link from "next/link";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import WhatsAppButton from "./WhatsAppButton";
import CallButton from "./CallButton";
import useAuth from "../hooks/useAuth";
import { useCart } from "./CartContext";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/services", label: "Nos soins" },
  { href: "/brands", label: "Marques" },
  { href: "/appointments", label: "Rendez-vous" },
  { href: "/gallery", label: "Galerie" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { profile, loading } = useAuth();
  const { items } = useCart();
  const router = useRouter();
  const isAdmin = !loading && profile?.role === "admin";
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSearch = searchText.trim();
    if (!trimmedSearch) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedSearch)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-emerald-900/10 bg-[linear-gradient(100deg,rgba(255,255,255,0.96),rgba(236,250,246,0.92),rgba(244,248,255,0.94))] text-slate-800 shadow-[0_8px_30px_rgba(15,118,110,0.06)] backdrop-blur-xl">
      <div className="bg-emerald-700 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-white sm:text-[11px]">
        <div className="mx-auto max-w-[1600px] px-4 py-2">Livraison rapide • Paiement sécurisé • Boutique AN NOUR</div>
      </div>

      <div className="mx-auto max-w-[1600px] px-3 sm:px-6 2xl:px-8">
        <div className="flex min-h-[76px] items-center gap-3 py-2 2xl:grid 2xl:grid-cols-[1fr_minmax(0,1.5fr)_1fr] 2xl:items-center 2xl:gap-5">
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="Ouvrir le menu"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-900/15 bg-white/90 text-slate-800 shadow-sm transition hover:bg-emerald-50 2xl:hidden"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={open ? "M6 6L18 18M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            <Link href="/" className="flex min-w-0 items-center gap-2">
              <Image src="/logo.png" alt="AN NOUR BIEN-ÊTRE" width={46} height={46} className="rounded object-contain" />
              <span className="text-[11px] font-semibold leading-tight tracking-[0.12em] text-emerald-950 sm:text-xs 2xl:text-base">
                AN NOUR BIEN ÊTRE
              </span>
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center 2xl:flex">
            <form onSubmit={handleSearchSubmit} className="flex w-full max-w-xl items-center gap-2 rounded-full border border-emerald-900/15 bg-white px-2 py-2 shadow-[0_12px_30px_rgba(15,118,110,0.08)]">
              <input
                aria-label="Rechercher un produit"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Rechercher un produit, marque ou catégorie"
                className="h-11 w-full border-0 bg-transparent px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-white transition hover:bg-emerald-800"
                aria-label="Lancer la recherche"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="6" />
                  <path d="m16 16 4 4" />
                </svg>
              </button>
            </form>
          </div>

          <div className="ml-auto flex items-center gap-2 2xl:hidden">
            <Link href="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-900/15 bg-white/90 text-slate-800 shadow-sm transition hover:bg-emerald-50" aria-label="Voir le panier">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="18" r="1.5" />
                <circle cx="17" cy="18" r="1.5" />
                <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L20 7H6" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="hidden shrink-0 items-center justify-end gap-1 2xl:flex">
            <Link href="/brands" className="rounded-full px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">Marques</Link>
            <Link href="/account" className="rounded-full px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">Mon compte</Link>
            <Link href="/cart" className="relative rounded-full px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
              Panier
              {cartCount > 0 && (
                <span className="ml-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1.5 text-[10px] font-bold text-white align-middle">
                  {cartCount}
                </span>
              )}
            </Link>
            <WhatsAppButton />
            <CallButton />
          </div>
        </div>

        <div className="pb-3 2xl:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white p-1.5 shadow-[0_12px_30px_rgba(15,118,110,0.08)]">
            <input
              aria-label="Rechercher un produit"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Rechercher un produit..."
              className="h-12 w-full border-0 bg-transparent px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white transition hover:bg-emerald-800"
              aria-label="Rechercher"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 4 4" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div className={`fixed inset-0 z-30 bg-black/70 backdrop-blur-sm transition-opacity duration-300 2xl:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setOpen(false)} />

      <div className={`fixed inset-0 z-40 bg-white text-slate-900 shadow-2xl transition-all duration-300 2xl:hidden ${open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-emerald-900/10 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
            <span className="font-semibold text-slate-900">Navigation</span>
            <button className="rounded-full border border-slate-200 bg-slate-100 p-2 text-slate-900 transition hover:bg-slate-200" onClick={() => setOpen(false)} aria-label="Fermer le menu">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
            <div className="flex flex-col gap-2">
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

              <button
                type="button"
                onClick={() => setShowMore((value) => !value)}
                className="mt-1 rounded-xl border border-emerald-900/15 bg-white px-3 py-3 text-left text-base font-semibold text-slate-800 transition hover:bg-emerald-50"
              >
                ⋯ Plus {showMore ? "−" : "+"}
              </button>

              {showMore ? (
                <div className="mt-1 grid gap-2 sm:grid-cols-3">
                  <Link href="/account" className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-900/15 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900" onClick={() => setOpen(false)}>
                    <span aria-hidden="true">👤</span>
                    Mon compte
                  </Link>
                  <div className="inline-flex items-center justify-center">
                    <WhatsAppButton />
                  </div>
                  <div className="inline-flex items-center justify-center">
                    <CallButton />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

    </header>
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-emerald-900/10 bg-white/95 px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(15,118,110,0.08)] 2xl:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        <Link href="/" className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
          <span aria-hidden="true" className="text-base">🏠</span>
          <span>Accueil</span>
        </Link>
        <Link href="/brands" className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
          <span aria-hidden="true" className="text-base">▦</span>
          <span>Marques</span>
        </Link>
        <Link href="/cart" className="relative flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
          <span aria-hidden="true" className="text-base">🛒</span>
          <span>Panier</span>
          {cartCount > 0 && (
            <span className="absolute right-3 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-700 px-1 text-[9px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </Link>
        <Link href="/account" className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
          <span aria-hidden="true" className="text-base">👤</span>
          <span>Compte</span>
        </Link>
      </div>
</nav>
    </>
  );
}
