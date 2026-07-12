"use client";
import React, { useMemo, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../../components/AdminSidebar";
import AdminHeader from "../../../components/AdminHeader";
import DashboardCard from "../../../components/DashboardCard";
import SearchBar from "../../../components/SearchBar";
import StatisticsChart from "../../../components/StatisticsChart";
import ProductTable from "../../../components/ProductTable";
import OrdersTable from "../../../components/OrdersTable";
import AppointmentTable from "../../../components/AppointmentTable";
import CustomerTable from "../../../components/CustomerTable";
import { signOutSecure } from "../../../lib/firebase-auth";

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return <div className="p-8">Redirection...</div>;
  }
  if (profile?.role !== "admin") {
    return <div className="p-8">Accès refusé. Vous n'avez pas les droits d'administrateur.</div>;
  }

  const stats = useMemo(
    () => [
      { title: "Produits", value: 48, description: "Total des produits" },
      { title: "Commandes", value: 128, description: "Commandes en cours" },
      { title: "Rendez-vous", value: 24, description: "Réservations à venir" },
      { title: "Clients", value: 92, description: "Clients actifs" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-8">
          <AdminHeader />
          <section className="mt-6 space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
              <div className="space-y-4">
                <div className="rounded-3xl bg-white dark:bg-gray-950 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Bienvenu, administrateur</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Surveillez l'activité et gérez votre plateforme.</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-full border border-gray-200 dark:border-gray-800 px-4 py-2">Filtres</button>
                      <button className="rounded-full bg-green-600 px-4 py-2 text-white">Nouvelle catégorie</button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                  {stats.map((item) => (
                    <DashboardCard key={item.title} title={item.title} value={item.value} description={item.description} />
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-white dark:bg-gray-950 p-6 shadow-sm">
                <SearchBar value={search} onChange={setSearch} />
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                  {['all','produits','commandes','rendez-vous','clients'].map((option) => (
                    <button key={option} onClick={() => setFilter(option)} className={`rounded-full px-3 py-2 ${filter === option ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                      {option === 'all' ? 'Tous' : option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              <StatisticsChart />
              <div className="rounded-3xl bg-white dark:bg-gray-950 p-6 shadow-sm">
                <div className="grid gap-6 xl:grid-cols-2">
                  <ProductTable />
                  <OrdersTable />
                </div>
              </div>
              <div className="grid gap-6 xl:grid-cols-2">
                <AppointmentTable />
                <CustomerTable />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
