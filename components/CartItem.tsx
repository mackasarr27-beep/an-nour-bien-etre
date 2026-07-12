"use client";
import React from "react";
import { CartProduct, useCart } from "./CartContext";

export default function CartItem({ item }: { item: CartProduct }) {
  const { updateQty, removeItem } = useCart();
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div className="font-medium">{item.title}</div>
          <div className="text-sm">{(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2 py-1 border rounded">-</button>
          <span>{item.qty}</span>
          <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2 py-1 border rounded">+</button>
          <button onClick={() => removeItem(item.id)} className="ml-auto text-sm text-red-600">Supprimer</button>
        </div>
      </div>
    </div>
  );
}
