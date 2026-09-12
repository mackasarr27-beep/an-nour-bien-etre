"use client";
import React from "react";
import { CartProvider, useCart } from "../../components/CartContext";
import CartItem from "../../components/CartItem";
import Link from "next/link";

function CartView() {
  const { items, total, clear } = useCart();

  const formattedTotal = `${new Intl.NumberFormat("fr-FR").format(total)} FCFA`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-emerald-900/10 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,118,110,0.08)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Boutique</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Mon Panier</h1>
          </div>
          {items.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Vider le panier
            </button>
          ) : null}
        </div>

        {items.length ? (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[24px] border border-dashed border-emerald-900/15 bg-emerald-50/70 p-6 text-center">
            <p className="text-lg font-semibold text-slate-900">Votre panier est vide.</p>
            <p className="mt-2 text-sm text-slate-600">Ajoutez des produits pour continuer votre commande.</p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              RETOUR À LA BOUTIQUE
            </Link>
          </div>
        )}

        {items.length > 0 ? (
          <div className="mt-6 rounded-[24px] border border-emerald-900/10 bg-emerald-50/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-600">Total général</p>
                <p className="text-2xl font-bold text-emerald-900">{formattedTotal}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-900/15 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50"
                >
                  Continuer les achats
                </Link>
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Commander
                </Link>
              </div>
            </div>
          </div>
        ) : null}
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
