"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { CartItem, Cart } from "@/lib/types";

interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, "totalPrice">) => void;
  removeFromCart: (packageId: number, date: string) => void;
  updateQuantity: (packageId: number, date: string, people: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar del localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("Mextripia-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error al parsear el carrito:", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("Mextripia-cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const calculateTotals = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const addToCart = (newItem: Omit<CartItem, "totalPrice">) => {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex(
        (i) => i.packageId === newItem.packageId && i.date === newItem.date
      );

      let newItems: CartItem[];
      const totalPrice = newItem.pricePerPerson * newItem.people;

      if (existingIndex >= 0) {
        newItems = [...prev.items];
        newItems[existingIndex] = { ...newItem, totalPrice };
      } else {
        newItems = [...prev.items, { ...newItem, totalPrice }];
      }

      return { items: newItems, total: calculateTotals(newItems) };
    });
  };

  const removeFromCart = (packageId: number, date: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter(
        (item) => !(item.packageId === packageId && item.date === date)
      );
      return { items: newItems, total: calculateTotals(newItems) };
    });
  };

  const updateQuantity = (packageId: number, date: string, people: number) => {
    setCart((prev) => {
      const newItems = prev.items.map((item) => {
        if (item.packageId === packageId && item.date === date) {
          return { ...item, people, totalPrice: item.pricePerPerson * people };
        }
        return item;
      });
      return { items: newItems, total: calculateTotals(newItems) };
    });
  };

  const clearCart = () => setCart({ items: [], total: 0 });

  const getItemCount = () => cart.items.reduce((sum, item) => sum + item.people, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
}