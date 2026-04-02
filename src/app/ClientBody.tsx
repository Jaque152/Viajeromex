"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";

export function ClientBody({ children }: { children: ReactNode }) {
  return (
    <body className="antialiased" suppressHydrationWarning>
      <CartProvider>
        {children}
      </CartProvider>
    </body>
  );
}
