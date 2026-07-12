"use client";
import React from "react";
import { useCart } from "./CartContext";
import CartItem from "./CartItem";
import Link from "next/link";

export default function CartDrawer() {
  const { items, total, clear } = useCart();

  return (
    <aside className="fixed right-4 top-20 w-80 bg-white dark:bg-gray-900 border rounded shadow-lg p-4">
      <h3 className="font-semibold">Votre panier</h3>
      <div className="mt-3 space-y-3 max-h-64 overflow-auto">
        {items.length ? items.map((it) => <CartItem key={it.id} item={it} />) : <div>Panier vide</div>}
      </div>
      <div className="mt-4">
        <div className="flex justify-between"><span>Total</span><strong>{total.toFixed(2)}</strong></div>
        <div className="mt-3 flex gap-2">
          <Link href="/cart" className="flex-1 px-3 py-2 border rounded text-center">Voir le panier</Link>
          <Link href="/checkout" className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-center">Commander</Link>
        </div>
        <button onClick={clear} className="mt-3 text-sm text-red-600">Vider</button>
      </div>
    </aside>
  );
}
