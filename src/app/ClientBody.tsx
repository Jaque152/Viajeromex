"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { NextIntlClientProvider } from 'next-intl';

interface ClientBodyProps {
  children: ReactNode;
  locale: string; // Recibe el idioma actual
}

export function ClientBody({ children, locale }: ClientBodyProps) {
  return (
    <body className="antialiased" suppressHydrationWarning>
      {/* Proveedor de Internacionalización */}
      <NextIntlClientProvider locale={locale} timeZone="America/Mexico_City">
        <CartProvider>
          {children}
        </CartProvider>
      </NextIntlClientProvider>
    </body>
  );
}
