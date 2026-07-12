import Link from "next/link";
import React from "react";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-green-400 to-teal-500 text-white py-12 rounded-lg shadow-lg mt-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-semibold">Offrez-vous un moment de détente</h2>
        <p className="mt-2 opacity-90">Prenez rendez-vous avec nos experts pour un soin sur mesure.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/appointments" className="bg-white text-green-600 px-4 py-2 rounded-full font-semibold">Prendre rendez-vous</Link>
          <Link href="/services" className="border border-white/80 px-4 py-2 rounded-full">Découvrir nos soins</Link>
        </div>
      </div>
    </section>
  );
}
