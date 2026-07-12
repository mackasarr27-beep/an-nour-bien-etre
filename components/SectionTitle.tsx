import React from "react";

type Props = { title: string; subtitle?: string };

export default function SectionTitle({ title, subtitle }: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
}
