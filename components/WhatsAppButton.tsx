"use client";
import React from "react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/221782160741"
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
    >
      <span aria-hidden="true">◉</span>
      WhatsApp
    </a>
  );
}
