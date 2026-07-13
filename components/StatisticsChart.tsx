"use client";
import React from "react";

export default function StatisticsChart() {
  return (
    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Statistiques</h3>
        <p className="text-sm text-gray-500">Vue d&apos;ensemble des performances.</p>
      </div>
      <div className="h-64 rounded-3xl bg-gradient-to-r from-green-500/20 to-teal-500/20" />
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-500">Ventes semaine</div>
          <div className="mt-2 text-xl font-semibold">124</div>
        </div>
        <div className="rounded-3xl bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-500">Nouveaux clients</div>
          <div className="mt-2 text-xl font-semibold">32</div>
        </div>
      </div>
    </div>
  );
}
