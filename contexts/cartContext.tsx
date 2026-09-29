"use client";
import { Product } from "@/lib/data/types";
import { createContext, useContext, useState, ReactNode } from "react";

type CartItem = { product: Product; quantity: number };

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  quickAddProduct: Product | null;
  openQuickAdd: (product: Product) => void;
  closeQuickAdd: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);

  const addToCart = (product: Product, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        quickAddProduct,
        openQuickAdd: setQuickAddProduct,
        closeQuickAdd: () => setQuickAddProduct(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}