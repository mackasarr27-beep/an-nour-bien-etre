"use client";
import React from "react";

export type PaymentMethod = "wave" | "orange" | "card" | "cod";

export default function PaymentSelector({ value, onChange }: { value: PaymentMethod; onChange: (v: PaymentMethod) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <label className={`p-3 border rounded cursor-pointer ${value === "wave" ? "ring-2 ring-green-400" : ""}`}>
        <input className="hidden" type="radio" name="payment" checked={value === "wave"} onChange={() => onChange("wave")} />
        <div className="font-medium">Wave</div>
        <div className="text-xs text-gray-500">Interface Wave (non connectée)</div>
      </label>
      <label className={`p-3 border rounded cursor-pointer ${value === "orange" ? "ring-2 ring-green-400" : ""}`}>
        <input className="hidden" type="radio" name="payment" checked={value === "orange"} onChange={() => onChange("orange")} />
        <div className="font-medium">Orange Money</div>
        <div className="text-xs text-gray-500">Interface Orange Money (non connectée)</div>
      </label>
      <label className={`p-3 border rounded cursor-pointer ${value === "card" ? "ring-2 ring-green-400" : ""}`}>
        <input className="hidden" type="radio" name="payment" checked={value === "card"} onChange={() => onChange("card")} />
        <div className="font-medium">Carte bancaire</div>
        <div className="text-xs text-gray-500">Interface CB (non connectée)</div>
      </label>
      <label className={`p-3 border rounded cursor-pointer ${value === "cod" ? "ring-2 ring-green-400" : ""}`}>
        <input className="hidden" type="radio" name="payment" checked={value === "cod"} onChange={() => onChange("cod" as any)} />
        <div className="font-medium">Paiement à la livraison</div>
        <div className="text-xs text-gray-500">Payer lors de la réception</div>
      </label>
    </div>
  );
}
