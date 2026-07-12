import React from "react";
import ServiceCard from "./ServiceCard";

export default function ServicesGrid() {
  const items = [
    { title: "Soin visage", description: "Routines naturelles et personnalisation" },
    { title: "Massages", description: "Relaxation et bien-être profond" },
    { title: "Aromathérapie", description: "Huiles essentielles biologiques" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((s) => (
        <ServiceCard key={s.title} title={s.title} description={s.description} />
      ))}
    </div>
  );
}
