"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartProduct = {
  id: string;
  title: string;
  price: number;
  qty: number;
  img?: string;
};

type CartContextValue = {
  items: CartProduct[];
  addItem: (p: Omit<CartProduct, "qty">, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartProduct[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("an-nour-cart") : null;
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("an-nour-cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (p: Omit<CartProduct, "qty">, qty = 1) => {
    setItems((cur) => {
      const found = cur.find((c) => c.id === p.id);
      if (found) return cur.map((c) => (c.id === p.id ? { ...c, qty: c.qty + qty } : c));
      return [...cur, { ...p, qty }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    setItems((cur) => cur.map((c) => (c.id === id ? { ...c, qty } : c)).filter((c) => c.qty > 0));
  };

  const removeItem = (id: string) => setItems((cur) => cur.filter((c) => c.id !== id));

  const clear = () => setItems([]);

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clear, total }}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
