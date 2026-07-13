"use client";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useRouter } from "next/navigation";
import SectionTitle from "../../../../components/SectionTitle";
import { useCart } from "../../../../components/CartContext";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  type Product = {
    id: string;
    title: string;
    description?: string;
    price: number;
    img?: string;
  };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const d = await getDoc(doc(db, "products", id));
        if (mounted) setProduct(d.exists() ? { id: d.id, ...(d.data() as Omit<Product, "id">) } : null);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!product) return <div className="p-8">Produit non trouvé</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SectionTitle title={product.title || "Produit"} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full h-80 bg-gray-100 rounded" />
        <div>
          <div className="text-lg font-medium">{product.title}</div>
          <div className="mt-2 text-gray-600">{product.description}</div>
          <div className="mt-4 font-semibold text-xl">{product.price?.toFixed ? product.price.toFixed(2) : product.price}</div>
          <div className="mt-6 flex gap-2">
            <button onClick={() => addItem({ id: product.id, title: product.title, price: product.price, img: product.img })} className="px-4 py-2 bg-green-600 text-white rounded">Ajouter au panier</button>
            <button onClick={() => router.push('/shop')} className="px-4 py-2 border rounded">Retour</button>
          </div>
        </div>
      </div>
    </div>
  );
}
