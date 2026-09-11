"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar";
import ProductCard from "../../components/ProductCard";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Product = { id: string; title: string; price?: number | string; img?: string; imageUrl?: string; images?: string[]; category?: string; subtitle?: string };

export default function SearchPage() {
  const [query, setQuery] = useState(() => (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("q") ?? "" : ""));
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    const loadProducts = async () => {
      if (!db) return;
      const snapshot = await getDocs(collection(db, "products"));
      if (mounted) setProducts(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Product, "id">) })));
    };
    void loadProducts();
    return () => { mounted = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => {
      const haystack = `${product.title ?? ""} ${product.category ?? ""} ${product.subtitle ?? ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [products, query]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <Link href="/" className="inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">← Retour</Link>
      <div className="mt-8 max-w-3xl rounded-[28px] border border-emerald-900/10 bg-white/95 p-5 shadow-[0_24px_70px_rgba(15,118,110,0.14)] sm:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Boutique</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Rechercher un produit</h1>
        <div className="mt-6"><SearchBar value={query} onChange={setQuery} /></div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="rounded-2xl border border-emerald-900/10 bg-white/95 p-4 shadow-sm">
            <ProductCard
              title={product.title}
              category={product.category}
              subtitle={product.subtitle}
              price={product.price}
              img={product.imageUrl || product.img || product.images?.[0]}
            />
            <Link href={`/shop/product/${product.id}`} className="mt-3 inline-flex rounded-full border border-emerald-900/15 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50">Voir les détails</Link>
          </div>
        ))}
      </div>

      {products.length > 0 && filteredProducts.length === 0 && (
        <p className="mt-8 rounded-2xl border border-emerald-900/10 bg-white/95 p-5 text-sm text-slate-600">
          Aucun produit ne correspond à votre recherche.
        </p>
      )}
    </main>
  );
}
