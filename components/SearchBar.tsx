"use client";
import React from "react";

export default function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <input
        className="w-full rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 pl-10 shadow-sm focus:border-green-500 focus:outline-none"
        placeholder="Rechercher"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</div>
    </div>
  );
}
