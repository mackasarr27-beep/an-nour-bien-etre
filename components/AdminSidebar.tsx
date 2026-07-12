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
    <aside className="w-full lg:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 shadow-sm">
      <div className="mb-6">
        <div className="text-lg font-semibold">Admin</div>
        <div className="text-sm text-gray-500">Tableau de bord premium</div>
      </div>
      <nav className="space-y-2">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="block rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            {section.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
