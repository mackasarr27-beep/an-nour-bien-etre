import React from "react";
import Image from "next/image";

type Props = {
  title: string;
  category?: string;
  subtitle?: string;
  price?: number | string;
  img?: string;
  stock?: number;
};

function formatPrice(value: number | string | undefined) {
  if (value === undefined || value === null || value === "") {
    return "Prix sur demande";
  }

  const numericValue = typeof value === "number" ? value : Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return `${new Intl.NumberFormat("fr-FR").format(numericValue)} FCFA`;
}

export default function ProductCard({ title, category, subtitle, price, img, stock }: Props) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-[0_18px_50px_rgba(15,118,110,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,118,110,0.10)]">
      {img ? (
        <div className="relative h-56 overflow-hidden bg-slate-100">
          <Image src={img} alt={title} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </div>
      ) : (
        <div className="flex h-56 items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 text-sm font-medium text-slate-500">
          Image indisponible
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {category ? <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-emerald-700">{category}</p> : null}
        {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-base font-bold text-emerald-800">{formatPrice(price)}</span>
          {stock !== undefined ? (
            <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${stock > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"}`}>
              {stock > 0 ? `${stock} en stock` : "Rupture"}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
