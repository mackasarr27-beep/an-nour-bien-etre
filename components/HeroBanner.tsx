"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HeroBanner() {
  return (
    <section className="w-full">
      <div className="relative w-full h-[420px] sm:h-[520px] lg:h-[680px]">
        <Image
          src="/Bannière.png"
          alt="Bannière An Nour"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white drop-shadow-lg px-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold">AN NOUR BIEN-ÊTRE</h1>
            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base">Espace premium de détente et soins naturels.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/appointments" className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold">Prendre rendez-vous</Link>
              <Link href="/services" className="rounded-full border border-white px-4 py-2 text-sm font-semibold">Découvrir nos soins</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
