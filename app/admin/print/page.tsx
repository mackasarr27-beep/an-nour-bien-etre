"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";

type Product = {
  id: string;
  title: string;
  category?: string;
  brand?: string;
  price?: number | string;
  oldPrice?: number | string;
  stock?: number;
  imageUrl?: string;
  img?: string;
  images?: string[];
  description?: string;
};

export default function AdminPrintPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        if (!db) {
          if (mounted) setProducts([]);
          return;
        }

        const snapshot = await getDocs(collection(db, "products"));
        const items = snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Product, "id">) }));

        if (mounted) setProducts(items);
      } catch (error) {
        console.error("Failed to load products for print", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadProducts();
    return () => { mounted = false; };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const printDate = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-800 print:bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-4 print:hidden sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Administration</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Liste des produits</h1>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            🖨️ Imprimer
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 print:border-slate-300">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xl font-bold text-slate-900">AN NOUR BIEN-ÊTRE</p>
              <p className="text-sm text-slate-600">Liste des produits</p>
            </div>
            <div className="text-right text-sm text-slate-600">
              <p>Date d’impression</p>
              <p className="font-semibold text-slate-800">{printDate}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 p-5 text-slate-600">Chargement des produits...</div>
        ) : (
          <div className="grid gap-4 print-card">
            {products.map((product) => {
              const primaryImage = product.imageUrl || product.img || product.images?.[0];

              return (
                <article key={product.id} className="print-card flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:flex-row print:items-center print:gap-5">
                  <div className="h-28 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 print:h-24 print:w-24">
                    {primaryImage ? (
                      <img src={primaryImage} alt={product.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">{product.title}</h2>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">{product.category || "Produit"}</p>
                        {product.brand ? <p className="text-xs font-medium text-slate-600">Marque : {product.brand}</p> : null}
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-semibold text-slate-800">Prix : {new Intl.NumberFormat("fr-FR").format(Number(product.price ?? 0))} FCFA</p>
                        {product.oldPrice ? (
                          <p className="text-xs text-slate-400 line-through">Ancien prix : {new Intl.NumberFormat("fr-FR").format(Number(product.oldPrice))} FCFA</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                      <div>
                        <span className="font-semibold text-slate-800">Stock :</span> {product.stock ?? 0}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">ID :</span> {product.id}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Disponibilité :</span> {(product.stock ?? 0) > 0 ? "Oui" : "Non"}
                      </div>
                    </div>

                    {product.description ? (
                      <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
