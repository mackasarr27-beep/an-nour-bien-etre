"use client";
import React from "react";

export default function ConfirmDialog({ open, title, message, confirmLabel = "Supprimer", onConfirm, onCancel }: { open: boolean; title: string; message: string; confirmLabel?: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-3xl border border-emerald-900/10 bg-white p-6 text-slate-900 shadow-xl">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3 text-gray-600 dark:text-gray-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-full border border-emerald-900/15 px-4 py-2 font-semibold text-slate-700 transition hover:bg-emerald-50">Annuler</button>
          <button onClick={onConfirm} className="rounded-full bg-rose-700 px-4 py-2 font-semibold text-white transition hover:bg-rose-800">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
