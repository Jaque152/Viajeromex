import type { Metadata } from "next";
import "@/globals.css";
import { ClientBody } from "@/app/ClientBody";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Zenith Mexico - Experiencias Únicas en México",
  description: "Diseñamos experiencias personalizadas para que tú solo te preocupes por disfrutar el camino. Descubre los rincones más auténticos de México.",
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