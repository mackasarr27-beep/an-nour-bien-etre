"use client";
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { collection, getCountFromServer } from "firebase/firestore";
import AdminSidebar from "../../../components/AdminSidebar";
import AdminHeader from "../../../components/AdminHeader";
import DashboardCard from "../../../components/DashboardCard";
import AdminProductManager from "../../../components/AdminProductManager";
import CategoryManager from "../../../components/CategoryManager";
import AppointmentAdminBoard from "../../../components/AppointmentAdminBoard";
import MessageAdminBoard from "../../../components/MessageAdminBoard";
import CustomerTable from "../../../components/CustomerTable";
import { db } from "../../../lib/firebase";

type DashboardStat = { title: string; value: number; description: string };

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStat[]>([
    { title: "Produits", value: 0, description: "Produits disponibles" },
    { title: "Commandes", value: 0, description: "Commandes enregistrées" },
    { title: "Rendez-vous", value: 0, description: "Réservations actives" },
    { title: "Messages", value: 0, description: "Demandes reçues" },
  ]);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      router.replace("/admin");
    }
  }, [loading, profile?.role, router, user]);

  useEffect(() => {
    if (!user || profile?.role !== "admin") return;

    const firestoreDb = db;
    if (!firestoreDb) return;

    const loadStats = async () => {
      try {
        const [productsSnap, appointmentsSnap, messagesSnap, ordersSnap, clientsSnap] = await Promise.all([
          getCountFromServer(collection(firestoreDb, "products")),
          getCountFromServer(collection(firestoreDb, "appointments")),
          getCountFromServer(collection(firestoreDb, "messages")),
          getCountFromServer(collection(firestoreDb, "orders")),
          getCountFromServer(collection(firestoreDb, "clients")),
        ]);

        setStats([
          { title: "Produits", value: productsSnap.data().count, description: "Produits disponibles" },
          { title: "Commandes", value: ordersSnap.data().count, description: "Commandes enregistrées" },
          { title: "Rendez-vous", value: appointmentsSnap.data().count, description: "Réservations actives" },
          { title: "Messages", value: messagesSnap.data().count, description: "Demandes reçues" },
          { title: "Clients", value: clientsSnap.data().count, description: "Clients enregistrés" },
        ]);
      } catch (error) {
        console.error("Unable to load dashboard stats", error);
      }
    };

    void loadStats();
  }, [profile?.role, user]);

  if (loading) {
    return <div className="p-8 text-sm text-gray-500">Chargement du tableau de bord...</div>;
  }

  if (!user || profile?.role !== "admin") {
    return <div className="p-8 text-sm text-gray-500">Accès réservé à l’administrateur.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-8">
          <AdminHeader />
          <section className="mt-6 space-y-6">
            <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Administration</p>
                  <h2 className="mt-2 text-2xl font-semibold">Bienvenue dans votre espace de gestion</h2>
                  <p className="mt-2 text-sm text-gray-500">Gérez la boutique, les rendez-vous, les messages et les clients depuis un seul tableau de bord.</p>
                </div>
                <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                  Connecté en tant qu’administrateur
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {stats.map((item) => (
                <DashboardCard key={item.title} title={item.title} value={item.value} description={item.description} />
              ))}
            </div>

            <AdminProductManager />
            <CategoryManager />
            <AppointmentAdminBoard />
            <MessageAdminBoard />
            <CustomerTable />
          </section>
        </main>
      </div>
    </div>
  );
}
