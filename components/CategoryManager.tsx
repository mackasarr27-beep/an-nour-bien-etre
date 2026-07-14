"use client";
import React, { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

type CategoryManagerProps = {
  onChange?: () => void;
};

export default function CategoryManager({ onChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const loadCategories = async () => {
    if (!db) {
      setCategories([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "categories"), orderBy("name"));
    const snap = await getDocs(q);
    setCategories(snap.docs.map((item) => item.data().name as string));
    setLoading(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      await loadCategories();
    };
    void fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !db) return;
    const value = name.trim();
    await addDoc(collection(db, "categories"), { name: value, createdAt: Date.now() });
    setName("");
    await loadCategories();
    onChange?.();
  };

  const handleDelete = async (categoryName: string) => {
    if (!db) return;
    const snap = await getDocs(query(collection(db, "categories"), orderBy("name")));
    const match = snap.docs.find((item) => item.data().name === categoryName);
    if (!match) return;
    await deleteDoc(doc(db, "categories", match.id));
    await loadCategories();
    onChange?.();
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestion des catégories</h3>
          <p className="text-sm text-gray-500">Organisez votre boutique par familles de produits.</p>
        </div>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nouvelle catégorie"
            className="rounded-full border border-gray-200 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
            Ajouter
          </button>
        </form>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-gray-500">Chargement...</div>
      ) : (
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
              <span>{category}</span>
              <button onClick={() => handleDelete(category)} className="text-xs text-red-500">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
