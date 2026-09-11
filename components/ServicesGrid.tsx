import React from "react";
import ServiceCard from "./ServiceCard";

export default function ServicesGrid() {
  const items = [
    { title: "Soin visage", description: "Routines naturelles et personnalisation", href: "/services" },
    { title: "Massages", description: "Relaxation et bien-être profond", href: "/services" },
    { title: "Aromathérapie", description: "Huiles essentielles biologiques", href: "/services" },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
      {items.map((service) => (
        <div key={service.title} className="min-w-[260px] flex-1 md:min-w-0">
          <ServiceCard
            title={service.title}
            description={service.description}
            href={service.href}
            ctaLabel="Découvrir"
          />
        </div>
      ))}
    </div>
  );
}
