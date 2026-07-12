"use client";
import React from "react";
import { CartProvider, useCart } from "../../components/CartContext";
import CartItem from "../../components/CartItem";
import Link from "next/link";

function CartView() {
  const { items, total, clear } = useCart();
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Votre panier</h1>
      <div className="mt-6 space-y-4">
        {items.length ? items.map((it) => <CartItem key={it.id} item={it} />) : <div>Panier vide</div>}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div className="text-lg font-medium">Total: {total.toFixed(2)}</div>
        <div className="flex gap-2">
          <Link href="/checkout" className="px-4 py-2 bg-green-600 text-white rounded">Commander</Link>
          <button onClick={clear} className="px-4 py-2 border rounded">Vider</button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <CartProvider>
      <CartView />
    </CartProvider>
  );
}
