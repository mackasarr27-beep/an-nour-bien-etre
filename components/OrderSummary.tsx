"use client";
import React from "react";
import { useCart } from "./CartContext";

export default function OrderSummary() {
  const { items, total } = useCart();
  return (
    <div className="border rounded p-4 bg-white dark:bg-gray-800">
      <h4 className="font-semibold">Résumé de la commande</h4>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it.id} className="flex justify-between text-sm">
            <span>{it.title} x {it.qty}</span>
            <span>{(it.price * it.qty).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between font-medium">Total <span>{total.toFixed(2)}</span></div>
    </div>
  );
}
