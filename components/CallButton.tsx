"use client";
import React from "react";

export default function CallButton() {
  return (
    <a href="tel:+221782160741" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
      <span aria-hidden="true">📞</span>
      Appel
    </a>
  );
}
