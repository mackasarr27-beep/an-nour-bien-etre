import React from "react";

type Props = {
  name: string;
  quote: string;
  role?: string;
};

export default function TestimonialCard({ name, quote, role }: Props) {
  return (
    <blockquote className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm transition-transform hover:scale-[1.01]">
      <p className="text-gray-800 dark:text-gray-100">“{quote}”</p>
      <footer className="mt-4 text-sm text-gray-600 dark:text-gray-300">— {name}{role ? `, ${role}` : ""}</footer>
    </blockquote>
  );
}
