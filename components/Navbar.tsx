"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import WhatsAppButton from "./WhatsAppButton";
import CallButton from "./CallButton";

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

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl dark:bg-black/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/Bannière.png" alt="An Nour" width={48} height={48} className="rounded object-contain" />
              <span className="font-semibold">AN NOUR</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-4 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm transition hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a href="/search" className="rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">Recherche</a>
            <a href="/cart" className="rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">Panier</a>
            <WhatsAppButton />
            <CallButton />
          </div>

          <div className="flex items-center md:hidden">
            <button
              aria-label="Menu"
              className="rounded-full border border-gray-200 bg-white/90 p-2 shadow-sm transition hover:scale-105 dark:border-gray-700 dark:bg-gray-900"
              onClick={() => setOpen((v) => !v)}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 6L18 18M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setOpen(false)} />

      <div className={`fixed inset-x-3 top-16 z-40 mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-2xl transition-all duration-300 md:hidden ${open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"}`}>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Navigation</span>
          <button className="rounded-full p-2 hover:bg-gray-100" onClick={() => setOpen(false)} aria-label="Fermer le menu">✕</button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-xl px-3 py-3 transition hover:bg-gray-100" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-wrap gap-2">
            <WhatsAppButton />
            <CallButton />
          </div>
        </div>
      </div>
    </header>
  );
}
