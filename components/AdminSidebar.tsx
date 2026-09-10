"use client";
import Link from "next/link";
import React from "react";

const sections = [
  { href: "/admin/dashboard", label: "Tableau de bord" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/appointments", label: "Rendez-vous" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/customers", label: "Clients" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-full border-r border-emerald-900/10 bg-white/90 p-4 shadow-sm backdrop-blur-sm lg:w-72">
      <div className="mb-6">
        <div className="text-lg font-semibold text-emerald-950">Admin</div>
        <div className="text-sm text-slate-600">Tableau de bord premium</div>
      </div>
      <nav className="space-y-2">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="block rounded-xl px-3 py-3 font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
            {section.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
