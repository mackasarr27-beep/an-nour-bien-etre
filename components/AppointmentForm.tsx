"use client";
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

type FormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
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

const NEIGHBORHOOD_OPTIONS = [
  "Dakar Plateau",
  "Médina",
  "Fass",
  "Colobane",
  "Gueule Tapée",
  "Fann",
  "Point E",
  "Mermoz",
  "Sacré-Cœur",
  "Sicap",
  "Liberté",
  "Grand Dakar",
  "HLM",
  "Biscuiterie",
  "Ouakam",
  "Ngor",
  "Almadies",
  "Yoff",
  "Cambérène",
  "Parcelles Assainies",
  "Grand-Yoff",
  "Hann",
  "Hann Bel-Air",
  "Pikine",
  "Guédiawaye",
  "Keur Massar",
  "Malika",
  "Yeumbeul",
  "Yeumbeul Nord",
  "Yeumbeul Sud",
  "Keur Mbaye Fall",
  "Jaxaay",
  "Rufisque",
  "Bargny",
  "Diamniadio",
  "Keur Ndiaye Lo",
  "Mermoz",
  "Grand Yoff",
  "Médina",
  "Sicap Baobabs",
  "Sicap Amitié",
  "Arafat",
  "Patte d'Oie",
  "Bel Air",
  "Hlm Grand Yoff",
  "Goree",
  "Bramy",
  "Mbao",
  "Bambilor",
  "Yenne",
  "Thiaroye",
  "Thiaroye sur Mer",
  "Sangalkam",
  "Tivaouane Diack",
  "Mbeubeuss",
  "Pikine Ouest",
  "Pikine Est",
  "Cité Keur Gorgui",
  "Amitié",
  "Médina Gounass",
  "Village de la Croix",
  "Ménik",
  "Parchi",
  "Keur Massar Sud",
  "Keur Massar Nord",
];

export default function AppointmentForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    address: "",
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
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email invalide.";
    if (!form.address.trim()) return "L’adresse / quartier est requis.";
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

      const normalizedAddress = form.address.trim();
      const appointment = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: normalizedAddress,
        neighborhood: normalizedAddress,
        date: form.date,
        time: form.time,
        service: form.service,
        message: form.message.trim(),
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
            address: appointment.address,
            neighborhood: appointment.neighborhood,
            date: appointment.date,
            time: appointment.time,
            service: appointment.service,
            message: appointment.message,
            status: appointment.status,
          },
        }),
      }).then(async (response) => {
        if (!response.ok) {
          console.error("Appointment notification email failed", response.status, await response.text());
        }
      }).catch((emailError) => console.error("Appointment notification email request failed", emailError));
      setSuccess(true);
      setForm({ name: "", phone: "", email: "", address: "", date: "", time: "", service: SERVICES[0], message: "" });
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="appointment-name" className="mb-1 block text-sm font-medium text-slate-700">Nom complet</label>
          <input id="appointment-name" className="w-full rounded-2xl border border-emerald-900/20 px-4 py-3" placeholder="Nom complet" value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>

        <div>
          <label htmlFor="appointment-phone" className="mb-1 block text-sm font-medium text-slate-700">Téléphone</label>
          <input id="appointment-phone" className="w-full rounded-2xl border border-emerald-900/20 px-4 py-3" placeholder="Téléphone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>

        <div>
          <label htmlFor="appointment-email" className="mb-1 block text-sm font-medium text-slate-700">Email (facultatif)</label>
          <input id="appointment-email" className="w-full rounded-2xl border border-emerald-900/20 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="appointment-address" className="mb-1 block text-sm font-medium text-slate-700">Adresse / Quartier</label>
          <div className="relative">
            <input
              id="appointment-address"
              className="w-full rounded-2xl border border-emerald-900/20 px-4 py-3 pr-11"
              list="dakar-neighborhoods"
              placeholder="Sélectionnez votre quartier ou saisissez votre adresse"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
            <button
              type="button"
              aria-label="Afficher les quartiers"
              className="absolute inset-y-1 right-1 flex items-center justify-center rounded-xl border border-emerald-900/10 bg-emerald-50 px-3 text-slate-700 transition hover:bg-emerald-100"
              onClick={() => {
                const input = document.getElementById("appointment-address") as HTMLInputElement | null;
                input?.focus();
                input?.click();
              }}
            >
              ▼
            </button>
          </div>
          <datalist id="dakar-neighborhoods">
            {NEIGHBORHOOD_OPTIONS.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="appointment-date" className="mb-1 block text-sm font-medium text-slate-700">Date du rendez-vous</label>
          <input id="appointment-date" className="w-full rounded-2xl border border-emerald-900/20 px-4 py-3" type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
        </div>

        <div>
          <label htmlFor="appointment-time" className="mb-1 block text-sm font-medium text-slate-700">Heure du rendez-vous</label>
          <input id="appointment-time" className="w-full rounded-2xl border border-emerald-900/20 px-4 py-3" type="time" value={form.time} onChange={(e) => update("time", e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="appointment-service" className="mb-1 block text-sm font-medium text-slate-700">Type de soin</label>
          <select id="appointment-service" className="w-full rounded-2xl border border-emerald-900/20 px-4 py-3" value={form.service} onChange={(e) => update("service", e.target.value)}>
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="appointment-message" className="mb-1 block text-sm font-medium text-slate-700">Message (optionnel)</label>
        <textarea id="appointment-message" className="min-h-[100px] w-full rounded-2xl border border-emerald-900/20 px-4 py-3" placeholder="Message (optionnel)" value={form.message} onChange={(e) => update("message", e.target.value)} />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={loading} className="rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1">{loading ? "En cours..." : "Réserver"}</button>
        <button type="button" onClick={() => setForm({ name: "", phone: "", email: "", address: "", date: "", time: "", service: SERVICES[0], message: "" })} className="rounded-full border border-emerald-900/15 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-emerald-50 sm:flex-1">Effacer</button>
      </div>
    </form>
  );
}
