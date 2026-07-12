"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function CustomerTable() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "clients"), orderBy("name"));
      const snap = await getDocs(q);
      setCustomers(snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Clients</h3>
        <p className="text-sm text-gray-500">Gestion des clients enregistrés.</p>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-800 text-gray-500">
              <tr>
                <th className="py-3">Nom</th>
                <th className="py-3">Email</th>
                <th className="py-3">Téléphone</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{customer.name}</td>
                  <td className="py-3">{customer.email}</td>
                  <td className="py-3">{customer.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
