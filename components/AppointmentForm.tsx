"use client";
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

type FormState = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  message: string;
};

const SERVICES = [
  "Soin visage",
  "Massage relaxant",
  "Aromathérapie",
  "Soin corps",
];

export default function AppointmentForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    service: SERVICES[0],
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function validate() {
    if (!form.name.trim()) return "Le nom est requis.";
    if (!form.phone.trim()) return "Le téléphone est requis.";
    if (!/^[\d+\s-]{6,20}$/.test(form.phone)) return "Numéro de téléphone invalide.";
    if (!form.email.trim()) return "L'email est requis.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email invalide.";
    if (!form.date) return "La date est requise.";
    if (!form.time) return "L'heure est requise.";
    if (!form.service) return "Le type de soin est requis.";
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "appointments"), {
        name: form.name,
        phone: form.phone,
        email: form.email,
        date: form.date,
        time: form.time,
        service: form.service,
        message: form.message,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setForm({ name: "", phone: "", email: "", date: "", time: "", service: SERVICES[0], message: "" });
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la réservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 className="text-xl font-semibold mb-4">Prendre rendez-vous</h3>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      {success && <div className="text-green-600 mb-3">Votre rendez-vous a été enregistré. Nous vous contacterons bientôt.</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input className="border rounded px-3 py-2" placeholder="Nom complet" value={form.name} onChange={(e) => update("name", e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Téléphone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        <input className="border rounded px-3 py-2" type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
        <input className="border rounded px-3 py-2" type="time" value={form.time} onChange={(e) => update("time", e.target.value)} />
        <select className="border rounded px-3 py-2" value={form.service} onChange={(e) => update("service", e.target.value)}>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <textarea className="w-full border rounded px-3 py-2 min-h-[100px]" placeholder="Message (optionnel)" value={form.message} onChange={(e) => update("message", e.target.value)} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60">{loading ? "En cours..." : "Réserver"}</button>
        <button type="button" onClick={() => setForm({ name: "", phone: "", email: "", date: "", time: "", service: SERVICES[0], message: "" })} className="px-4 py-2 border rounded">Effacer</button>
      </div>
    </form>
  );
}
