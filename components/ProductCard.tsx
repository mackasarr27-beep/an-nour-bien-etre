"use client";

import React, { useEffect, useState } from "react";

type Props = {
  title: string;
  category?: string;
  brand?: string;
  subtitle?: string;
  price?: number | string;
  oldPrice?: number | string;
  promotion?: boolean;
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

export default function ProductCard({ title, category, brand, subtitle, price, oldPrice, promotion, img, stock }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [img]);

  const imageSrc = img && !imageFailed ? img : "";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-emerald-900/10 bg-white shadow-[0_18px_50px_rgba(15,118,110,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,118,110,0.10)]">
      <div className="relative h-48 overflow-hidden bg-white sm:h-56 md:h-60">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 p-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Image indisponible
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {(promotion || (oldPrice !== undefined && oldPrice !== null && oldPrice !== "" && Number(oldPrice) > 0)) ? (
          <span className="mb-2 inline-flex w-fit rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800">
            Promotion
          </span>
        ) : null}

        <h3 className="line-clamp-2 text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
        {brand ? <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">{brand}</p> : null}
        {category ? <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">{category}</p> : null}
        {subtitle ? <p className="mt-2 line-clamp-2 text-sm text-slate-600">{subtitle}</p> : null}

        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="flex min-w-0 flex-col">
            <span className="text-base font-bold text-emerald-800 sm:text-lg">{formatPrice(price)}</span>
            {oldPrice !== undefined && oldPrice !== null && oldPrice !== "" ? (
              <span className="text-[11px] text-slate-400 line-through">{formatPrice(oldPrice)}</span>
            ) : null}
          </div>
          {stock !== undefined ? (
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold sm:text-[11px] ${stock > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"}`}>
              {stock > 0 ? `${stock} en stock` : "Rupture"}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
