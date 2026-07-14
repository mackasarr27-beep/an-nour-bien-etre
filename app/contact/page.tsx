"use client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import SectionTitle from "../../components/SectionTitle";
import { db } from "../../lib/firebase";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!db) {
        setStatus("La messagerie n’est pas disponible pour le moment.");
        return;
      }

      await addDoc(collection(db, "messages"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setStatus("Votre message a bien été envoyé. Nous vous répondrons rapidement.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionTitle title="Contact" subtitle="Nous contacter" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Prêt à prendre rendez-vous ?</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">Écrivez-nous pour une demande de soin, une question sur la boutique ou tout autre besoin. Votre message apparaîtra dans l’espace administrateur.</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom" className="rounded-2xl border border-gray-200 px-4 py-3" />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="rounded-2xl border border-gray-200 px-4 py-3" />
          </div>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Téléphone" className="mt-4 w-full rounded-2xl border border-gray-200 px-4 py-3" />
          <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Votre message" className="mt-4 min-h-[140px] w-full rounded-2xl border border-gray-200 px-4 py-3" />
          {status && <p className="mt-3 text-sm text-emerald-600">{status}</p>}
          <button type="submit" className="mt-6 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">Envoyer</button>
        </form>
      </div>
    </div>
  );
}
