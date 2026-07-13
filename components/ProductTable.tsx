"use client";
import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import ConfirmDialog from "./ConfirmDialog";

export default function ProductTable() {
  type ProductRow = {
    id: string;
    title?: string;
    category?: string;
    price?: number;
  };

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), orderBy("title"));
      const snap = await getDocs(q);
      setProducts(
        snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<ProductRow, "id">) })) as ProductRow[]
      );
      setLoading(false);
    };
    void fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!selectedId) return;
    await deleteDoc(doc(db, "products", selectedId));
    setProducts((current) => current.filter((product) => product.id !== selectedId));
    setConfirmOpen(false);
  };

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Produits</h3>
          <p className="text-sm text-gray-500">Gérez votre catalogue de produits.</p>
        </div>
        <button className="rounded-full bg-green-600 px-4 py-2 text-white">Ajouter un produit</button>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-800 text-gray-500">
              <tr>
                <th className="py-3">Produit</th>
                <th className="py-3">Catégorie</th>
                <th className="py-3">Prix</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{product.title}</td>
                  <td className="py-3">{product.category || "-"}</td>
                  <td className="py-3">{product.price?.toFixed?.(2) ?? product.price}</td>
                  <td className="py-3 flex gap-2">
                    <button className="rounded-full border px-3 py-1">Modifier</button>
                    <button
                      className="rounded-full border px-3 py-1 text-red-600"
                      onClick={() => {
                        setSelectedId(product.id);
                        setConfirmOpen(true);
                      }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmer la suppression"
        message="Voulez-vous supprimer ce produit ?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
