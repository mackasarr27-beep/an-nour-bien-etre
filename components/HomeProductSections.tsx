"use client";

import React, { useEffect, useMemo, useState } from "react";
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

const fallbackProducts: Product[] = [
  {
    id: "fallback-articulaires",
    title: "Complémentaire pour les douleurs articulaires",
    subtitle: "Complément naturel pour accompagner le confort articulaire au quotidien.",
    category: "Compléments alimentaires",
    price: 10000,
    img: "/Complementaire pour les douleurs articulaires.png",
  },
  {
    id: "fallback-rhume-sinusite",
    title: "Spray contre le rhume et la sinusite",
    subtitle: "Spray pratique pour accompagner le confort respiratoire au quotidien.",
    category: "Soins respiratoires",
    price: 10000,
    img: "/Spray contre la rhume et la sinusite.png",
  },
  {
    id: "fallback-detox",
    title: "Thé détox et amincissant",
    subtitle: "Une boisson légère pour intégrer un moment détox dans votre routine.",
    category: "Tisanes",
    price: 10000,
    img: "/Thé detox et amincissant.png",
  },
];

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
        const items = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data() as Omit<Product, "id"> & { id?: string };
          const { id: _ignoredId, ...rest } = data;
          return { ...rest, id: docSnapshot.id } as Product;
        });
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

  const mergedProducts = useMemo(() => {
    const uniqueProducts = new Map<string, Product>();

    [...products, ...fallbackProducts].forEach((product) => {
      const key = product.title?.trim().toLowerCase() || product.id;
      if (!uniqueProducts.has(key)) {
        uniqueProducts.set(key, product);
      }
    });

    return Array.from(uniqueProducts.values());
  }, [products]);

  const productsToDisplay = mergedProducts;

  if (loading) {
    return <div className="rounded-2xl border border-emerald-900/10 bg-white/95 px-4 py-6 text-slate-600">Chargement des produits...</div>;
  }

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Boutique</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Nos produits</h2>
        </div>
        <Link href="/shop" className="hidden rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 sm:inline-flex">
          Voir toute la boutique
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {productsToDisplay.map((product) => {
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
                <Link href={`/shop/product/${product.id}`} className="flex-1 rounded-full border border-emerald-900/15 bg-white px-3 py-2 text-center text-[11px] font-semibold text-slate-700 transition hover:bg-emerald-50 sm:text-sm">
                  Voir le produit
                </Link>
                <button
                  onClick={() => addItem({ id: product.id, title: product.title, price: Number(product.price ?? 0), img: productImage })}
                  className="flex-1 rounded-full bg-emerald-700 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-emerald-800 sm:text-sm"
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
}
