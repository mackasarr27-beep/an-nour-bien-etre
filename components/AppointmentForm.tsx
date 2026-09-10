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
      if (!db) {
        throw new Error("La réservation n’est pas disponible pour le moment.");
      }

      const appointment = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        date: form.date,
        time: form.time,
        service: form.service,
        message: form.message,
        status: "pending",
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "appointments"), appointment);
      void fetch("/api/appointment-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pending",
          appointment: {
            name: appointment.name,
            phone: appointment.phone,
            email: appointment.email,
            date: appointment.date,
            time: appointment.time,
            service: appointment.service,
            message: appointment.message,
            status: appointment.status,
          },
        }),
      }).catch((emailError) => console.error("Appointment notification email failed", emailError));
      setSuccess(true);
      setForm({ name: "", phone: "", email: "", date: "", time: "", service: SERVICES[0], message: "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la réservation.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl rounded-[28px] border border-emerald-900/10 bg-white/95 p-5 shadow-[0_24px_70px_rgba(15,118,110,0.1)] sm:p-7">
      <h3 className="mb-4 text-xl font-semibold text-slate-900">Prendre rendez-vous</h3>
      {error && <div role="alert" className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</div>}
      {success && <div role="status" className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">Votre rendez-vous a été enregistré. Nous vous contacterons bientôt.</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input className="rounded-2xl border border-emerald-900/20 px-4 py-3" placeholder="Nom complet" value={form.name} onChange={(e) => update("name", e.target.value)} />
        <input className="rounded-2xl border border-emerald-900/20 px-4 py-3" placeholder="Téléphone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        <input className="rounded-2xl border border-emerald-900/20 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        <input className="rounded-2xl border border-emerald-900/20 px-4 py-3" type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
        <input className="rounded-2xl border border-emerald-900/20 px-4 py-3" type="time" value={form.time} onChange={(e) => update("time", e.target.value)} />
        <select className="rounded-2xl border border-emerald-900/20 px-4 py-3" value={form.service} onChange={(e) => update("service", e.target.value)}>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <textarea className="min-h-[100px] w-full rounded-2xl border border-emerald-900/20 px-4 py-3" placeholder="Message (optionnel)" value={form.message} onChange={(e) => update("message", e.target.value)} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={loading} className="rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "En cours..." : "Réserver"}</button>
        <button type="button" onClick={() => setForm({ name: "", phone: "", email: "", date: "", time: "", service: SERVICES[0], message: "" })} className="rounded-full border border-emerald-900/15 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-emerald-50">Effacer</button>
      </div>
    </form>
  );
}
