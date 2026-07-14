"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function OrdersTable() {
  type Order = {
    id: string;
    client?: { name?: string };
    total?: number;
    status?: string;
    createdAt?: { toDate?: () => Date };
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!db) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setOrders(
        snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Order, "id">) })) as Order[]
      );
      setLoading(false);
    };
    void fetchOrders();
  }, []);

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Commandes</h3>
        <p className="text-sm text-gray-500">Suivez les commandes clients.</p>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-800 text-gray-500">
              <tr>
                <th className="py-3">Client</th>
                <th className="py-3">Total</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{order.client?.name}</td>
                  <td className="py-3">{order.total?.toFixed?.(2) ?? order.total}</td>
                  <td className="py-3">{order.status}</td>
                  <td className="py-3">{order.createdAt?.toDate?.()?.toLocaleDateString() || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
