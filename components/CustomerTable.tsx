"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function CustomerTable() {
  type Customer = {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
  };

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!db) {
        setCustomers([]);
        setLoading(false);
        return;
      }

      const q = query(collection(db, "clients"), orderBy("name"));
      const snap = await getDocs(q);
      setCustomers(
        snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Customer, "id">) })) as Customer[]
      );
      setLoading(false);
    };
    void fetchCustomers();
  }, []);

  return (
    <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,118,110,0.08)] sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Clients</h3>
        <p className="text-sm text-slate-600">Gestion des clients enregistrés.</p>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[620px] table-fixed text-left text-sm">
            <colgroup>
              <col className="w-[34%]" />
              <col className="w-[40%]" />
              <col className="w-[26%]" />
            </colgroup>
            <thead className="border-b border-emerald-900/10 text-xs uppercase tracking-[0.12em] text-slate-600">
              <tr>
                <th className="py-3">Nom</th>
                <th className="py-3">Email</th>
                <th className="py-3">Téléphone</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-emerald-900/10 text-slate-800">
                  <td className="break-words px-3 py-4 font-semibold first:pl-0">{customer.name || "-"}</td>
                  <td className="break-words px-3 py-4">{customer.email || "-"}</td>
                  <td className="whitespace-nowrap px-3 py-4 last:pr-0">{customer.phone || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
