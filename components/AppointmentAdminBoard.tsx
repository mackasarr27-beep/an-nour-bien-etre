"use client";
import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import ConfirmDialog from "./ConfirmDialog";

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  neighborhood?: string;
  date: string;
  time: string;
  service: string;
  message?: string;
  status?: string;
};

async function fetchAppointments(): Promise<Appointment[]> {
  if (!db) return [];

  const appointmentsQuery = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
  const snap = await getDocs(appointmentsQuery);
  return snap.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Appointment, "id">) }));
}

export default function AppointmentAdminBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    void fetchAppointments()
      .then((items) => {
        if (!active) return;
        setAppointments(items);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!db) return;
    try {
      const previousAppointment = appointments.find((appointment) => appointment.id === id);
      await updateDoc(doc(db, "appointments", id), { status });
      const updatedAppointments = await fetchAppointments();
      setAppointments(updatedAppointments);
      const updatedAppointment = updatedAppointments.find((appointment) => appointment.id === id);
      if (status === "Confirmé" && previousAppointment?.status !== "Confirmé" && updatedAppointment) {
        void fetch("/api/appointment-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "confirmed",
            appointment: {
              name: updatedAppointment.name,
              phone: updatedAppointment.phone,
              email: updatedAppointment.email,
              date: updatedAppointment.date,
              time: updatedAppointment.time,
              service: updatedAppointment.service,
              message: updatedAppointment.message,
              status: updatedAppointment.status,
            },
          }),
        }).then(async (response) => {
          if (!response.ok) {
            console.error("Appointment confirmation email failed", response.status, await response.text());
          }
        }).catch((emailError) => console.error("Appointment confirmation email request failed", emailError));
      }
    } catch {
      setFeedback({ type: "error", message: "Impossible de mettre à jour le statut. Veuillez réessayer." });
    }
  };

  const deleteAppointment = async () => {
    if (!db || !selectedAppointment) return;

    setDeleting(true);
    try {
      await deleteDoc(doc(db, "appointments", selectedAppointment.id));
      setAppointments(await fetchAppointments());
      setSelectedAppointment(null);
      setFeedback({ type: "success", message: "Le rendez-vous a été supprimé avec succès." });
    } catch {
      setFeedback({ type: "error", message: "Impossible de supprimer le rendez-vous. Veuillez réessayer." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,118,110,0.08)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Gestion des rendez-vous</h3>
          <p className="text-sm text-slate-600">Consultez les informations reçues et confirmez, reportez ou annulez les réservations.</p>
        </div>
      </div>
      {feedback && (
        <div role="status" className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
          {feedback.message}
        </div>
      )}
      {loading ? (
        <div className="mt-4 text-sm text-slate-600">Chargement...</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-[1320px] table-fixed text-left text-sm">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[16%]" />
              <col className="w-[12%]" />
              <col className="w-[8%]" />
              <col className="w-[7%]" />
              <col className="w-[11%]" />
              <col className="w-[17%]" />
              <col className="w-[9%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead className="border-b border-emerald-900/10 text-xs uppercase tracking-[0.12em] text-slate-600">
              <tr>
                <th className="py-3">Client</th>
                <th className="py-3">Téléphone</th>
                <th className="py-3">Email</th>
                <th className="py-3">Adresse</th>
                <th className="py-3">Date</th>
                <th className="py-3">Heure</th>
                <th className="py-3">Soin</th>
                <th className="py-3">Message</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-600">Aucun rendez-vous enregistré.</td>
                </tr>
              ) : appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-emerald-900/10 align-top text-slate-800">
                  <td className="break-words px-3 py-4 font-semibold first:pl-0">{appointment.name}</td>
                  <td className="whitespace-nowrap px-3 py-4">{appointment.phone}</td>
                  <td className="break-words px-3 py-4">{appointment.email || "Non renseigné"}</td>
                  <td className="break-words px-3 py-4">{appointment.address || appointment.neighborhood || "Non renseignée"}</td>
                  <td className="whitespace-nowrap px-3 py-4">{appointment.date}</td>
                  <td className="whitespace-nowrap px-3 py-4">{appointment.time}</td>
                  <td className="break-words px-3 py-4">{appointment.service}</td>
                  <td className="break-words px-3 py-4 text-slate-600">{appointment.message || "-"}</td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${appointment.status === "Confirmé" ? "bg-emerald-100 text-emerald-800" : appointment.status === "Annulé" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                      {appointment.status || "En attente"}
                    </span>
                  </td>
                  <td className="px-3 py-4 last:pr-0">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => void updateStatus(appointment.id, "Confirmé")} className="rounded-full bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800">Confirmer</button>
                      <button onClick={() => void updateStatus(appointment.id, "Reporté")} className="rounded-full border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100">Reporter</button>
                      <button onClick={() => void updateStatus(appointment.id, "Annulé")} className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100">Annuler</button>
                      <button onClick={() => { setFeedback(null); setSelectedAppointment(appointment); }} className="rounded-full border border-rose-300 bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-900 transition hover:bg-rose-200">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog
        open={selectedAppointment !== null}
        title="Supprimer le rendez-vous ?"
        message="Voulez-vous vraiment supprimer ce rendez-vous ? Cette action est irréversible."
        confirmLabel={deleting ? "Suppression..." : "Supprimer définitivement"}
        onCancel={() => { if (!deleting) setSelectedAppointment(null); }}
        onConfirm={() => void deleteAppointment()}
      />
    </div>
  );
}
