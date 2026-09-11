"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import ProductCard from "./ProductCard";
import { useCart } from "./CartContext";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price?: number | string;
  oldPrice?: number | string;
  img?: string;
  imageUrl?: string;
  images?: string[];
  stock?: number;
  category?: string;
};

export default function ProductGrid() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        if (!db) {
          if (mounted) setItems([]);
          return;
        }

        const snap = await getDocs(collection(db, "products"));
        const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) }));
        if (mounted) setItems(data as Product[]);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void fetchProducts();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="rounded-2xl border border-emerald-900/10 bg-white/95 px-4 py-6 text-slate-600">Chargement des produits...</div>;
  if (!items.length) return <div className="rounded-2xl border border-emerald-900/10 bg-white/95 px-4 py-6 text-slate-600">Aucun produit trouvé.</div>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => {
        const productImage = p.imageUrl || p.img || p.images?.[0];

        return (
          <div key={p.id} className="flex flex-col">
            <ProductCard
              title={p.title}
              category={p.category}
              subtitle={p.subtitle || undefined}
              price={p.price}
              oldPrice={p.oldPrice}
              img={productImage}
              stock={typeof p.stock === "number" ? p.stock : undefined}
            />
            <div className="mt-3 flex gap-2">
              <Link href={`/shop/product/${p.id}`} className="flex-1 rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-emerald-50">
                Voir les détails
              </Link>
              <button onClick={() => addItem({ id: p.id, title: p.title, price: Number(p.price ?? 0), img: productImage || "" })} className="flex-1 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
                Ajouter au panier
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
