"use client";
import React from "react";

export default function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white px-2 py-1.5 shadow-[0_12px_30px_rgba(15,118,110,0.08)]">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span aria-hidden="true" className="pl-2 text-base text-emerald-700">🔍</span>
        <input
          aria-label="Rechercher"
          className="h-11 w-full border-0 bg-transparent px-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none sm:text-base"
          placeholder="Rechercher"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <button
        type="button"
        aria-label="Rechercher"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white transition hover:bg-emerald-800"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" />
        </svg>
      </button>
    </div>
  );
}
