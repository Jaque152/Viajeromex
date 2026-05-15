import "../globals.css";
import { ClientBody } from "@/app/ClientBody";
import { ReactNode } from "react";
import type { Metadata } from "next";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Mextripia - Curaduría de Experiencias Personalizadas",
  description: "Curamos itinerarios a la medida y experiencias de alto nivel. Descubre los destinos más asombrosos con el respaldo y la exclusividad de Mextripia.",
};

export default async function RootLayout({
  children,
  params
}: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  return (
    <html lang={locale}>
      <ClientBody locale={locale}>
        {children}
      </ClientBody>
    </html>
  );
}