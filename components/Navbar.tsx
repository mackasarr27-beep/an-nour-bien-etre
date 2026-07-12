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
    <header className="w-full bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/Bannière.png" alt="An Nour" width={48} height={48} className="object-contain rounded" />
              <span className="font-semibold">AN NOUR</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="/search" className="text-sm px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Recherche</a>
            <a href="/cart" className="text-sm px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Panier</a>
            <WhatsAppButton />
            <CallButton />
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Menu"
              className="p-2 rounded-md focus:outline-none"
              onClick={() => setOpen((v) => !v)}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  className={`transition-transform duration-300 ${open ? "transform rotate-45 translate-y-0.5" : ""}`}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden fixed inset-x-4 top-20 z-50 rounded-lg bg-white/95 dark:bg-gray-900/95 shadow-lg transform transition-all duration-300 origin-top ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
      >
        <div className="px-4 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-2">
            <WhatsAppButton />
            <CallButton />
          </div>
        </div>
      </div>
    </header>
  );
}
