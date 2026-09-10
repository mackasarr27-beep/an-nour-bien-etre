"use client";
import React from "react";
import Link from "next/link";
import { CartProvider } from "../../components/CartContext";
import CheckoutForm from "../../components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <CartProvider>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/cart" className="inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">← Retour au panier</Link>
        <h1 className="text-2xl font-semibold">Paiement</h1>
        <p className="mt-2 text-gray-600">Sélectionnez vos options de paiement et confirmez la commande.</p>
        <div className="mt-6">
          <CheckoutForm />
        </div>
      </div>
    </CartProvider>
  );
}
