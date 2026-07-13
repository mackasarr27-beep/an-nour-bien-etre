"use client";
import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  status?: string;
};

export default function AppointmentAdminBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  type AppointmentDoc = {
    id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    service: string;
    status?: string;
  };

  const loadAppointments = async () => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setAppointments(
      snap.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<AppointmentDoc, "id">) })) as AppointmentDoc[]
    );
    setLoading(false);
  };

  useEffect(() => {
    void loadAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "appointments", id), { status });
    await loadAppointments();
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestion des rendez-vous</h3>
          <p className="text-sm text-gray-500">Confirmez, reportez ou annulez les réservations.</p>
        </div>
      </div>
      {loading ? (
        <div className="mt-4 text-sm text-gray-500">Chargement...</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-3">Client</th>
                <th className="py-3">Date</th>
                <th className="py-3">Soin</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-100">
                  <td className="py-3">{appointment.name}</td>
                  <td className="py-3">{appointment.date} {appointment.time}</td>
                  <td className="py-3">{appointment.service}</td>
                  <td className="py-3">{appointment.status || "En attente"}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => void updateStatus(appointment.id, "Confirmé")} className="rounded-full border px-3 py-1">Confirmer</button>
                      <button onClick={() => void updateStatus(appointment.id, "Reporté")} className="rounded-full border px-3 py-1">Reporter</button>
                      <button onClick={() => void updateStatus(appointment.id, "Annulé")} className="rounded-full border px-3 py-1 text-red-600">Annuler</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
