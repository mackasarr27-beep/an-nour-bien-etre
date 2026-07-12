"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HeroBanner() {
  return (
    <section className="w-full overflow-hidden">
      <div className="relative isolate min-h-[78svh] sm:min-h-[82svh] lg:min-h-[90svh]">
        <Image
          src="/Bannière.png"
          alt="Bannière An Nour"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-contain md:object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/65" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center px-4 pb-6 sm:pb-10 lg:pb-14">
          <div className="w-full max-w-3xl rounded-[28px] border border-white/20 bg-black/35 px-4 py-5 text-center text-white shadow-2xl backdrop-blur-md sm:px-8 sm:py-7">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Soins premium • Bien-être • Sérénité</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">AN NOUR BIEN-ÊTRE</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
              Un espace premium pour retrouver équilibre, détente et beauté naturelle.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/appointments" className="rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold shadow-lg transition hover:bg-emerald-500">Prendre rendez-vous</Link>
              <Link href="/services" className="rounded-full border border-white/80 px-4 py-3 text-sm font-semibold transition hover:bg-white/10">Découvrir nos soins</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
