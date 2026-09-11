import React from "react";

type Props = {
  title: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
};

export default function ServiceCard({ title, description, href, ctaLabel = "Découvrir" }: Props) {
  return (
    <div className="flex h-full flex-col rounded-[24px] border border-emerald-900/10 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-[0_16px_40px_rgba(15,118,110,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,118,110,0.10)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-800">
        {title.charAt(0).toUpperCase()}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-2 text-sm leading-7 text-gray-600">{description}</p>}
      {href && (
        <div className="mt-auto pt-5">
          <a href={href} className="inline-flex items-center rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50">
            {ctaLabel}
          </a>
        </div>
      )}
    </div>
  );
}
