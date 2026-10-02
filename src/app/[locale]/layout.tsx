import "../globals.css";
import { ClientBody } from "@/app/ClientBody";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Viajeromex | Rutas Culinarias y Experiencias de Sabor",
  description: "Explora México a través de su gastronomía. Desde joyas de comida callejera hasta cenas exclusivas, en Viajeromex diseñamos viajes y catas a medida que despertarán todos tus sentidos.",
};

export default async function RootLayout({
  children,
  params
}: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang={locale}>
      <ClientBody locale={locale}>
        {children}
      </ClientBody>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
    </html>
  );
}