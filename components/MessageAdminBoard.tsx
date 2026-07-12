"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function MessageAdminBoard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setMessages(snap.docs.map((item) => ({ id: item.id, ...(item.data() as any) })));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Messages reçus</h3>
          <p className="text-sm text-gray-500">Consultez les demandes de contact et d’information.</p>
        </div>
      </div>
      {loading ? (
        <div className="mt-4 text-sm text-gray-500">Chargement...</div>
      ) : (
        <div className="mt-6 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">{message.name}</div>
                <div className="text-sm text-gray-500">{message.email}</div>
              </div>
              <div className="mt-2 text-sm text-gray-600">{message.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
