"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import ProductCard from "./ProductCard";
import { useCart } from "./CartContext";

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  price?: number | string;
  oldPrice?: number | string;
  promotion?: boolean;
  stock?: number;
  img?: string;
  imageUrl?: string;
  images?: string[];
};

const getProductImage = (product: Product) => product.imageUrl || product.img || product.images?.[0] || "";

export default function HomeProductSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (!db) {
          if (mounted) setProducts([]);
          return;
        }

        const snapshot = await getDocs(collection(db, "products"));
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Product, "id">) }));
        if (mounted) setProducts(items);
      } catch (error) {
        console.error("Failed to load products for homepage", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => { mounted = false; };
  }, []);

  const popular = products.filter((product) => product.category && ["Huiles", "Compléments alimentaires", "Tisanes", "Produits de massage", "Cosmétiques", "Accessoires"].includes(product.category)).slice(0, 4);
  const promotions = products.filter((product) => product.promotion || (typeof product.oldPrice === "number" && product.oldPrice > 0) || (typeof product.oldPrice === "string" && Number(product.oldPrice) > 0)).slice(0, 4);
  const latest = products.slice(0, 4);

  const renderSection = (title: string, subtitle: string, items: Product[]) => {
    if (!items.length) return null;

    return (
      <div className="mb-10">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{subtitle}</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h2>
          </div>
          <Link href="/shop" className="hidden rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 sm:inline-flex">
            Voir toute la boutique
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => {
            const productImage = getProductImage(product);
            return (
              <div key={product.id} className="flex flex-col">
                <ProductCard
                  title={product.title}
                  category={product.category}
                  subtitle={product.subtitle || undefined}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  promotion={Boolean(product.promotion)}
                  img={productImage}
                  stock={typeof product.stock === "number" ? product.stock : undefined}
                />
                <div className="mt-3 flex gap-2">
                  <Link href={`/shop/product/${product.id}`} className="flex-1 rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-emerald-50">
                    Voir les détails
                  </Link>
                  <button
                    onClick={() => addItem({ id: product.id, title: product.title, price: Number(product.price ?? 0), img: productImage })}
                    className="flex-1 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="rounded-2xl border border-emerald-900/10 bg-white/95 px-4 py-6 text-slate-600">Chargement des produits...</div>;
  }

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Boutique</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Nos produits</h2>
      </div>

      {renderSection("Produits populaires", "PGA", popular)}
      {renderSection("Promotions", "Économisez", promotions)}
      {renderSection("Nouveautés", "Découvrir", latest)}
    </div>
  );
}
