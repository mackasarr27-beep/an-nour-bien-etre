import React from "react";

type Props = {
  title: string;
  description?: string;
};

export default function ServiceCard({ title, description }: Props) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
    </div>
  );
}
