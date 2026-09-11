"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../../components/CartContext";

type Product = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  additionalInfo?: string;
  price?: number;
  oldPrice?: number;
  stock?: number;
  img?: string;
  imageUrl?: string;
  images?: string[];
  gallery?: string[];
  category?: string;
  videoUrl?: string;
};

function formatPrice(value: number | string | undefined) {
  if (value === undefined || value === null || value === "") {
    return "Prix sur demande";
  }

  const numericValue = typeof value === "number" ? value : Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return `${new Intl.NumberFormat("fr-FR").format(numericValue)} FCFA`;
}

function getPrimaryImage(product: Product) {
  return product.imageUrl || product.img || product.images?.[0] || "";
}

function getGalleryImages(product: Product) {
  return (product.gallery || []).filter((url) => Boolean(url));
}

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!db) {
          if (mounted) setProduct(null);
          return;
        }

        const d = await getDoc(doc(db, "products", id));
        if (mounted) {
          if (d.exists()) {
            const data = d.data() as Omit<Product, "id" | "price" | "oldPrice"> & { price?: number | string; oldPrice?: number | string };
            const resolvedProduct: Product = {
              id: d.id,
              title: String(data.title || "Produit"),
              subtitle: data.subtitle || "",
              description: data.description || "",
              additionalInfo: data.additionalInfo || "",
              price: Number(data.price ?? 0),
              oldPrice: data.oldPrice !== undefined && data.oldPrice !== null && data.oldPrice !== "" ? Number(data.oldPrice) : undefined,
              stock: typeof data.stock === "number" ? data.stock : undefined,
              img: data.img || "",
              imageUrl: data.imageUrl || "",
              images: Array.isArray(data.images) ? data.images.filter(Boolean) : [],
              gallery: Array.isArray(data.gallery) ? data.gallery.filter(Boolean) : [],
              category: data.category || "Produit",
              videoUrl: data.videoUrl || "",
            };
            setProduct(resolvedProduct);
            setSelectedImage(getPrimaryImage(resolvedProduct));
          } else {
            setProduct(null);
            setSelectedImage("");
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="px-4 py-12 text-center text-slate-600">Chargement...</div>;
  if (!product) return <div className="px-4 py-12 text-center text-slate-600">
    <div className="mx-auto max-w-xl rounded-3xl border border-emerald-900/10 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Produit introuvable</h1>
      <p className="mt-3 text-slate-600">Le produit demandé n’existe pas ou n’est plus disponible.</p>
      <button onClick={() => router.push("/shop")} className="mt-5 inline-flex items-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
        Retour à la boutique
      </button>
    </div>
  </div>;

  const primaryImage = getPrimaryImage(product);
  const galleryImages = getGalleryImages(product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <button onClick={() => router.push("/shop")} className="inline-flex items-center rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50">
        ← Retour à la boutique
      </button>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white shadow-[0_20px_60px_rgba(15,118,110,0.08)]">
            {selectedImage ? (
              <Image src={selectedImage} alt={product.title} width={1200} height={900} className="h-[420px] w-full object-cover" />
            ) : (
              <div className="flex h-[420px] items-center justify-center bg-slate-100 text-slate-500">Image indisponible</div>
            )}
          </div>

          {galleryImages.length > 0 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[primaryImage, ...galleryImages].filter(Boolean).slice(0, 4).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded-2xl border ${selectedImage === image ? "border-emerald-700" : "border-emerald-900/10"}`}
                >
                  <Image src={image} alt={`${product.title} ${index + 1}`} width={400} height={300} className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">{product.category || "Produit"}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{product.title}</h1>
            {product.subtitle ? <p className="mt-2 text-base text-slate-600">{product.subtitle}</p> : null}
          </div>

          <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/60 p-4">
            <div className="flex items-end gap-3">
              <div className="text-2xl font-bold text-emerald-900">{formatPrice(product.price)}</div>
              {product.oldPrice !== undefined && product.oldPrice !== null && product.oldPrice > 0 ? (
                <div className="text-base text-slate-400 line-through">{formatPrice(product.oldPrice)}</div>
              ) : null}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${typeof product.stock === "number" && product.stock > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"}`}>
                {typeof product.stock === "number" ? (product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock") : "Disponibilité à vérifier"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => addItem({ id: product.id, title: product.title, price: Number(product.price ?? 0), img: primaryImage || "" })}
              className="w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Ajouter au panier
            </button>
            <button
              onClick={() => router.push("/checkout")}
              className="w-full rounded-full border border-emerald-900/15 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50"
            >
              Commander
            </button>
          </div>

          <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{product.description || "Aucune description disponible."}</p>
          </div>

          {product.additionalInfo ? (
            <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
              <h2 className="text-lg font-semibold text-slate-900">Informations complémentaires</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{product.additionalInfo}</p>
            </div>
          ) : null}

          {product.videoUrl ? (
            <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
              <h2 className="text-lg font-semibold text-slate-900">Vidéo</h2>
              <a href={product.videoUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center rounded-full border border-emerald-900/15 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                Ouvrir la vidéo
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
