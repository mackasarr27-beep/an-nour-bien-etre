"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HeroBanner() {
  return (
    <section className="w-full overflow-hidden">
      <div className="relative isolate">
        <div className="relative w-full overflow-hidden sm:h-[66svh] sm:min-h-[480px] sm:max-h-none lg:h-[82svh] lg:min-h-[680px]">
          <Image
            src="/Bannière.png"
            alt="Bannière An Nour"
            width={1983}
            height={793}
            priority
            quality={75}
            sizes="100vw"
            className="block h-auto w-full sm:absolute sm:inset-0 sm:h-full sm:w-full sm:object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        </div>

        <div className="flex justify-center px-3 pb-3 sm:absolute sm:inset-x-0 sm:bottom-0 sm:px-4 sm:pb-8 lg:pb-12">
          <div className="w-full max-w-3xl rounded-[24px] border border-white/25 bg-slate-950/65 px-3 py-4 text-center text-white shadow-2xl backdrop-blur-sm sm:rounded-[28px] sm:px-8 sm:py-7">
            <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-200 sm:text-xs">Soins premium • Bien-être • Sérénité</p>
            <h1 className="mt-2 text-[1.7rem] font-semibold leading-tight sm:mt-3 sm:text-4xl md:text-6xl">AN NOUR BIEN-ÊTRE</h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-white/90 sm:mt-3 sm:text-base">
              Un espace premium pour retrouver équilibre, détente et beauté naturelle.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:justify-center sm:gap-3">
              <Link href="/appointments" className="rounded-full bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-800">Prendre rendez-vous</Link>
              <Link href="/services" className="rounded-full border border-white bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">Découvrir nos soins</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
