"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function AppointmentTable() {
  type AppointmentRow = {
    id: string;
    name: string;
    date: string;
    time: string;
    service: string;
  };

  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!db) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setAppointments(
        snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<AppointmentRow, "id">) })) as AppointmentRow[]
      );
      setLoading(false);
    };
    void fetchAppointments();
  }, []);

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Rendez-vous</h3>
        <p className="text-sm text-gray-500">Suivi des réservations clients.</p>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-800 text-gray-500">
              <tr>
                <th className="py-3">Client</th>
                <th className="py-3">Date</th>
                <th className="py-3">Heure</th>
                <th className="py-3">Soin</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{item.name}</td>
                  <td className="py-3">{item.date}</td>
                  <td className="py-3">{item.time}</td>
                  <td className="py-3">{item.service}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
