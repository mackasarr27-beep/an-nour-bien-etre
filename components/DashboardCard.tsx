"use client";
import React from "react";

type Props = { title: string; value: string | number; description: string };

export default function DashboardCard({ title, value, description }: Props) {
  return (
    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 shadow-sm transition hover:-translate-y-1">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-sm text-gray-500">{description}</div>
    </div>
  );
}
