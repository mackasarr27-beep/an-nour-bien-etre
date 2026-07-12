import React from "react";

type Props = {
  title: string;
  description?: string;
};

export default function ServiceCard({ title, description }: Props) {
  return (
    <div className="rounded-[24px] border border-gray-200 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="h-10 w-10 rounded-full bg-emerald-100" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 text-sm leading-7 text-gray-600">{description}</p>}
    </div>
  );
}
