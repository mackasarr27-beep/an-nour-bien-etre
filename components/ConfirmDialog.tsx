"use client";
import React from "react";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: { open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-gray-950 p-6 shadow-xl">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3 text-gray-600 dark:text-gray-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-full border">Annuler</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-full bg-red-600 text-white">Supprimer</button>
        </div>
      </div>
    </div>
  );
}
