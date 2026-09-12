"use client";

import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "../../lib/firebase";
import ProductCard from "../../components/ProductCard";

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  brand?: string;
  price?: number | string;
  oldPrice?: number | string;
  stock?: number;
  img?: string;
  imageUrl?: string;
  images?: string[];
};

export default function BrandsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("Toutes");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        if (!db) {
          if (mounted) setProducts([]);
          return;
        }

        const snapshot = await getDocs(collection(db, "products"));
        const items = snapshot.docs.map((docSnapshot) => {
          const fetched = docSnapshot.data() as Omit<Product, "id"> & { id?: string };
          const { id: _ignoredId, ...rest } = fetched;
          return { ...rest, id: docSnapshot.id } as Product;
        });

        if (mounted) {
          setProducts(items);
        }
      } catch (error) {
        console.error("Failed to load products for brands page", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void fetchProducts();
    return () => { mounted = false; };
  }, []);

  const brands = useMemo(() => {
    const uniqueBrands = new Set<string>();
    products.forEach((product) => {
      const brand = (product.brand || product.category || "Autres").trim();
      if (brand) uniqueBrands.add(brand);
    });
    return ["Toutes", ...Array.from(uniqueBrands)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedBrand === "Toutes") {
      return products;
    }

    return products.filter((product) => (product.brand || product.category || "Autres") === selectedBrand);
  }, [products, selectedBrand]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Boutique</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Marques</h1>
        </div>
        <Link href="/shop" className="inline-flex items-center rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50">
          Voir toute la boutique
        </Link>
      </div>

      <div className="rounded-[28px] border border-emerald-900/10 bg-white/95 p-4 shadow-[0_24px_70px_rgba(15,118,110,0.14)] sm:p-6">
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => setSelectedBrand(brand)}
              className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                selectedBrand === brand
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-emerald-900/15 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-2xl border border-emerald-900/10 bg-white/95 px-4 py-6 text-slate-600">
          Chargement des marques...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-emerald-900/10 bg-white/95 px-4 py-6 text-slate-600">
          Aucune marque disponible pour ce filtre.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex flex-col">
              <ProductCard
                title={product.title}
                category={product.category}
                brand={product.brand || product.category}
                subtitle={product.subtitle}
                price={product.price}
                oldPrice={product.oldPrice}
                img={product.imageUrl || product.img || product.images?.[0]}
                stock={typeof product.stock === "number" ? product.stock : undefined}
              />
              <Link href={`/shop/product/${product.id}`} className="mt-3 inline-flex rounded-full border border-emerald-900/15 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-emerald-50">
                Voir le produit
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
