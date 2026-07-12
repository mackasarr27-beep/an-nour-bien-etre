"use client";
import React, { useEffect, useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../lib/firebase";

export type AdminProduct = {
  id?: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  description: string;
  stock: number;
  images: string[];
  gallery: string[];
  video?: string;
  featured: boolean;
  promotion: boolean;
  active: boolean;
  createdAt?: any;
};

const initialForm: AdminProduct = {
  title: "",
  category: "Huiles",
  price: 0,
  oldPrice: 0,
  description: "",
  stock: 1,
  images: [],
  gallery: [],
  video: "",
  featured: false,
  promotion: false,
  active: true,
};

export default function AdminProductManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<AdminProduct>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tous");
  const [categories, setCategories] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const loadProducts = async () => {
    const q = query(collection(db, "products"), orderBy("title"));
    const snap = await getDocs(q);
    setProducts(snap.docs.map((item) => ({ id: item.id, ...(item.data() as any) })));
    setLoading(false);
  };

  const loadCategories = async () => {
    const q = query(collection(db, "categories"), orderBy("name"));
    const snap = await getDocs(q);
    setCategories(snap.docs.map((item) => item.data().name as string));
  };

  useEffect(() => {
    void loadProducts();
    void loadCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === "Tous" || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, filterCategory]);

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return [];
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      urls.push(await getDownloadURL(storageRef));
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const payload: AdminProduct = {
        ...form,
        price: Number(form.price || 0),
        oldPrice: Number(form.oldPrice || 0),
        stock: Number(form.stock || 0),
        images: form.images,
        gallery: form.gallery,
        createdAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "products", editingId), payload);
      } else {
        await addDoc(collection(db, "products"), payload);
      }
      setForm(initialForm);
      setEditingId(null);
      await loadProducts();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingId(product.id ?? null);
    setForm({ ...product, images: product.images || [], gallery: product.gallery || [] });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await deleteDoc(doc(db, "products", id));
    await loadProducts();
  };

  const setFiles = async (e: React.ChangeEvent<HTMLInputElement>, field: "images" | "gallery") => {
    const urls = await uploadFiles(e.target.files);
    setForm((current) => ({ ...current, [field]: [...(current[field] || []), ...urls] }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Gestion des produits</h2>
            <p className="text-sm text-gray-500">Ajoutez, modifiez et publiez vos produits en temps réel.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher"
              className="rounded-full border border-gray-200 px-3 py-2 text-sm"
            />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="rounded-full border border-gray-200 px-3 py-2 text-sm">
              <option value="Tous">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nom du produit" className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-3">
              {categories.length ? categories.map((category) => <option key={category} value={category}>{category}</option>) : ["Huiles", "Compléments alimentaires", "Tisanes", "Produits de massage", "Cosmétiques", "Accessoires"].map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Prix" className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
              <input type="number" value={form.oldPrice || 0} onChange={(e) => setForm({ ...form, oldPrice: Number(e.target.value) })} placeholder="Ancien prix" className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
            </div>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="min-h-[120px] w-full rounded-2xl border border-gray-200 px-4 py-3" />
            <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} placeholder="Stock" className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
            <input value={form.video || ""} onChange={(e) => setForm({ ...form, video: e.target.value })} placeholder="Lien vidéo (optionnel)" className="w-full rounded-2xl border border-gray-200 px-4 py-3" />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.promotion} onChange={(e) => setForm({ ...form, promotion: e.target.checked })} />
              Produit en promotion
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Produit vedette
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Activer le produit
            </label>
            <label className="text-sm text-gray-600">
              Images principales
              <input type="file" multiple accept="image/*" onChange={(e) => void setFiles(e, "images")} className="mt-2 block w-full text-sm" />
            </label>
            <label className="text-sm text-gray-600">
              Galerie
              <input type="file" multiple accept="image/*" onChange={(e) => void setFiles(e, "gallery")} className="mt-2 block w-full text-sm" />
            </label>
            <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              <div className="font-medium text-gray-700">URLs actuelles</div>
              <div className="mt-2 break-all">Images: {form.images.join(", ") || "Aucune"}</div>
              <div className="mt-1 break-all">Galerie: {form.gallery.join(", ") || "Aucune"}</div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-wrap gap-3">
            <button type="submit" disabled={uploading} className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">
              {uploading ? "Enregistrement..." : editingId ? "Enregistrer les modifications" : "Ajouter un produit"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold">
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Catalogue</h3>
            <p className="text-sm text-gray-500">{filteredProducts.length} produit(s)</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-3">Produit</th>
                <th className="py-3">Catégorie</th>
                <th className="py-3">Prix</th>
                <th className="py-3">Stock</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-4">Chargement...</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-3">{product.title}</td>
                  <td className="py-3">{product.category}</td>
                  <td className="py-3">{product.price} €</td>
                  <td className="py-3">{product.stock}</td>
                  <td className="py-3">{product.active ? "Actif" : "Désactivé"}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleEdit(product)} className="rounded-full border px-3 py-1">Modifier</button>
                      <button onClick={() => void handleDelete(product.id)} className="rounded-full border px-3 py-1 text-red-600">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
