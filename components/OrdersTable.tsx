"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

type OrderItem = {
  id?: string;
  productId?: string;
  title?: string;
  name?: string;
  productName?: string;
  brand?: string;
  marque?: string;
  qty?: number;
  quantity?: number;
  price?: number | string;
  unitPrice?: number | string;
  total?: number | string;
  subtotal?: number | string;
  img?: string;
  image?: string;
  imageUrl?: string;
  images?: string[];
  product?: Record<string, any>;
  [key: string]: any;
};

type Order = {
  id: string;
  orderNumber?: string;
  client?: Record<string, any>;
  customer?: Record<string, any>;
  items?: OrderItem[];
  products?: OrderItem[];
  total?: number | string;
  status?: string;
  paymentMethod?: string;
  modePaiement?: string;
  createdAt?: any;
  deliveryFee?: number | string;
  fraisLivraison?: number | string;
  address?: string;
  adresse?: string;
  phone?: string;
  email?: string;
  comment?: string;
  message?: string;
  [key: string]: any;
};

const formatPrice = (value: number | string | undefined) => {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed)) return "-";
  return `${new Intl.NumberFormat("fr-FR").format(parsed)} FCFA`;
};

const formatDateTime = (value: any) => {
  if (!value) return "-";

  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
  }

  if (value instanceof Date) {
    return value.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
    }
    return value;
  }

  return "-";
};

const getCustomer = (order: Order) => {
  const customer = order.client || order.customer || {};
  const name = customer.name || customer.fullName || customer.nom || customer.firstName || customer.prenom || "-";
  const phone = customer.phone || order.phone || customer.telephone || customer.mobile || "-";
  const email = customer.email || order.email || "-";
  const address = customer.address || customer.adresse || order.address || order.adresse || "-";

  return { name, phone, email, address };
};

const getOrderItems = (order: Order) => {
  const source = Array.isArray(order.items) ? order.items : Array.isArray(order.products) ? order.products : [];
  return source.filter(Boolean);
};

const getItemImage = (item: OrderItem) => {
  const nestedProduct = item.product || {};

  return (
    nestedProduct.imageUrl ||
    nestedProduct.images?.[0] ||
    nestedProduct.img ||
    nestedProduct.image ||
    item.imageUrl ||
    item.images?.[0] ||
    item.img ||
    item.image ||
    ""
  );
};

const getItemName = (item: OrderItem) => {
  return (
    item.title ||
    item.name ||
    item.productName ||
    item.product?.title ||
    item.product?.name ||
    item.product?.productName ||
    "Produit"
  );
};

const getItemBrand = (item: OrderItem) => {
  return item.brand || item.marque || item.product?.brand || item.product?.marque || item.product?.category || "-";
};

const getItemQty = (item: OrderItem) => Number(item.qty ?? item.quantity ?? 0);

const getItemPrice = (item: OrderItem) => Number(item.price ?? item.unitPrice ?? item.product?.price ?? item.product?.unitPrice ?? 0);

const getItemTotal = (item: OrderItem) => {
  const computed = Number(item.total ?? item.subtotal ?? item.product?.total ?? item.product?.subtotal ?? getItemQty(item) * getItemPrice(item));
  return Number.isFinite(computed) ? computed : 0;
};

const getOrderTotal = (order: Order) => {
  const itemsTotal = getOrderItems(order).reduce((sum, item) => sum + getItemTotal(item), 0);
  const fees = Number(order.deliveryFee ?? order.fraisLivraison ?? order.shippingFee ?? order.frais ?? 0);
  const baseTotal = Number(order.total ?? order.amount ?? 0);

  if (baseTotal > 0) return baseTotal;
  return itemsTotal + fees;
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!db) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        const fetchedOrders = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Record<string, any>),
        })) as Order[];

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Unable to load orders", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();
  }, []);

  return (
    <div className="rounded-[28px] border border-emerald-900/10 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,118,110,0.08)] sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Commandes</h3>
          <p className="text-sm text-slate-600">Liste complète des commandes enregistrées et détails clients.</p>
        </div>
        <div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
          {orders.length} commande{orders.length > 1 ? "s" : ""}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/60 p-4 text-sm text-slate-600">Chargement des commandes...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-emerald-900/15 bg-slate-50 p-4 text-sm text-slate-600">Aucune commande enregistrée pour le moment.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const customer = getCustomer(order);
            const detailsOpen = expandedOrderId === order.id;
            const orderItems = getOrderItems(order);
            const orderTotal = getOrderTotal(order);

            return (
              <div key={order.id} className="rounded-2xl border border-emerald-900/10 bg-slate-50/60 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Commande</span>
                      <span className="rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700">
                        {order.orderNumber || order.id}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">{formatDateTime(order.createdAt)}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700">
                      {customer.name}
                    </div>
                    <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700">
                      {formatPrice(orderTotal)}
                    </div>
                    <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                      {order.status || "En attente"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Téléphone</div>
                    <div className="mt-1 text-sm font-medium text-slate-800">{customer.phone}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Email</div>
                    <div className="mt-1 text-sm font-medium text-slate-800">{customer.email}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Paiement</div>
                    <div className="mt-1 text-sm font-medium text-slate-800">{order.paymentMethod || order.modePaiement || "-"}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Livraison</div>
                    <div className="mt-1 text-sm font-medium text-slate-800">{order.deliveryFee ? formatPrice(order.deliveryFee) : "-"}</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setExpandedOrderId((current) => (current === order.id ? null : order.id))}
                    className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    {detailsOpen ? "Masquer les détails" : "Voir les détails"}
                  </button>
                </div>

                {detailsOpen && (
                  <div className="mt-4 rounded-2xl border border-emerald-900/10 bg-white p-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="space-y-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Adresse de livraison</div>
                          <div className="mt-1 text-sm text-slate-800">{customer.address}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Commentaire client</div>
                          <div className="mt-1 text-sm text-slate-800">{order.comment || order.message || "-"}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Statut de paiement</div>
                          <div className="mt-1 text-sm text-slate-800">{order.paymentStatus || order.status || "-"}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Montant total</div>
                          <div className="mt-1 text-sm font-semibold text-slate-900">{formatPrice(orderTotal)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">Produits commandés</div>

                      <div className="space-y-3">
                        {orderItems.map((item, index) => {
                          const image = getItemImage(item);
                          const itemName = getItemName(item);
                          const itemBrand = getItemBrand(item);
                          const qty = getItemQty(item);
                          const unitPrice = getItemPrice(item);
                          const itemTotal = getItemTotal(item);

                          return (
                            <div key={`${order.id}-item-${index}`} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
                              <div className="h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-white">
                                {image ? (
                                  <img src={image} alt={itemName} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">Aucune image</div>
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="text-base font-semibold text-slate-900">{itemName}</div>
                                <div className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{itemBrand}</div>
                                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
                                  <span>Quantité : {qty}</span>
                                  <span>Prix unitaire : {formatPrice(unitPrice)}</span>
                                  <span>Sous-total : {formatPrice(itemTotal)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
