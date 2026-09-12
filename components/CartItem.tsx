"use client";
import React from "react";
import { CartProduct, useCart } from "./CartContext";

function formatPrice(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

export default function CartItem({ item }: { item: CartProduct }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-white p-3 shadow-[0_10px_30px_rgba(15,118,110,0.04)]">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-emerald-900/10 bg-slate-100">
        {item.img ? (
          <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{item.title}</h3>
            <p className="mt-1 text-xs text-slate-500">Prix unitaire : {formatPrice(item.price)}</p>
          </div>
          <div className="text-sm font-bold text-emerald-800">{formatPrice(item.price * item.qty)}</div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center overflow-hidden rounded-full border border-emerald-900/15 bg-emerald-50">
            <button
              type="button"
              onClick={() => updateQty(item.id, item.qty - 1)}
              className="flex h-8 w-8 items-center justify-center text-base font-semibold text-slate-700 transition hover:bg-emerald-100"
              aria-label={`Retirer une quantité de ${item.title}`}
            >
              −
            </button>
            <span className="min-w-10 text-center text-sm font-semibold text-slate-800">{item.qty}</span>
            <button
              type="button"
              onClick={() => updateQty(item.id, item.qty + 1)}
              className="flex h-8 w-8 items-center justify-center text-base font-semibold text-slate-700 transition hover:bg-emerald-100"
              aria-label={`Ajouter une quantité de ${item.title}`}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="ml-auto rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
