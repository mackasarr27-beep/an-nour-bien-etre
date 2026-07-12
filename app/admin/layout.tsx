"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      router.replace("/admin");
    }
  }, [loading, profile?.role, router, user]);

  if (loading) return <div className="p-8 text-sm text-gray-500">Vérification de l’accès...</div>;
  if (!user || profile?.role !== "admin") return null;

  return <>{children}</>;
}
