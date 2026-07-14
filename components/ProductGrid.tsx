"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import ProductCard from "./ProductCard";
import { useCart } from "./CartContext";
import Link from "next/link";

type Product = { id: string; title: string; price: number; img?: string; category?: string };

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

  if (loading) return <div>Chargement des produits...</div>;
  if (!items.length) return <div>Aucun produit trouvé.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p) => (
        <div key={p.id} className="flex flex-col">
          <ProductCard title={p.title} price={p.price ? `${p.price}` : undefined} img={p.img} />
          <div className="mt-3 flex gap-2">
            <Link href={`/shop/product/${p.id}`} className="px-3 py-2 border rounded">Détails</Link>
            <button onClick={() => addItem({ id: p.id, title: p.title, price: p.price, img: p.img })} className="px-3 py-2 bg-green-600 text-white rounded">Ajouter au panier</button>
          </div>
        </div>
      ))}
    </div>
  );
}
