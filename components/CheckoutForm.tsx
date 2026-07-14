"use client";
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useCart } from "./CartContext";
import PaymentSelector, { PaymentMethod } from "./PaymentSelector";
import OrderSummary from "./OrderSummary";
import { useRouter } from "next/navigation";

export default function CheckoutForm() {
  const { items, total, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("wave");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!items.length) return setError("Panier vide");
    if (!name || !phone || !email) return setError("Veuillez remplir les informations client");
    setLoading(true);
    try {
      if (!db) {
        throw new Error("Le paiement n’est pas disponible pour le moment.");
      }

      const order = {
        items,
        total,
        client: { name, phone, email, address },
        paymentMethod: payment,
        status: "pending",
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "orders"), order);
      await addDoc(collection(db, "clients"), { name, phone, email, address, createdAt: serverTimestamp() });
      clear();
      router.push("/shop");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la commande";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Informations client</h3>
        {error && <div className="text-red-600">{error}</div>}
        <input className="w-full border rounded px-3 py-2" placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Adresse (optionnel)" value={address} onChange={(e) => setAddress(e.target.value)} />

        <div className="mt-4">
          <h4 className="font-medium">Mode de paiement</h4>
          <PaymentSelector value={payment} onChange={setPayment} />
        </div>

        <div className="mt-4">
          <button disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? "En cours..." : "Valider la commande"}</button>
        </div>
      </div>

      <div>
        <OrderSummary />
      </div>
    </form>
  );
}
