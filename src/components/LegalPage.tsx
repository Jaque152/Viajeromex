"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { T } from "@/components/T";

export default function LegalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-40 pb-24">
        <div className="container mx-auto px-6 max-w-3xl animate-fade-up">
          <div className="text-center mb-16 border-b border-border pb-10">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-secondary mb-4 block">
              <T>Actualizado: Octubre 2026</T>
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground">
              <T>Aviso de Privacidad</T>
            </h1>
          </div>

          <div className="prose prose-sm md:prose-base prose-stone max-w-none text-muted-foreground font-light leading-loose">
            <p>
              <T>En Viajeromex, valoramos y respetamos su privacidad. Este documento describe cómo recopilamos, utilizamos y protegemos su información personal al interactuar con nuestros servicios y plataformas.</T>
            </p>
            
            <h3 className="text-xl font-serif text-foreground mt-10 mb-4"><T>1. Recopilación de Datos</T></h3>
            <p>
              <T>Podemos recopilar información personal como su nombre, dirección de correo electrónico, número de teléfono y detalles de facturación cuando solicita una cotización o realiza una reserva a través de nuestro sitio web.</T>
            </p>

            <h3 className="text-xl font-serif text-foreground mt-10 mb-4"><T>2. Uso de la Información</T></h3>
            <p>
              <T>La información proporcionada se utiliza exclusivamente para la gestión de sus reservas, la coordinación de logística en experiencias gastronómicas y, si usted lo autoriza, para el envío de boletines exclusivos y promociones.</T>
            </p>

            <h3 className="text-xl font-serif text-foreground mt-10 mb-4"><T>3. Protección de Datos</T></h3>
            <p>
              <T>Implementamos medidas de seguridad de alto nivel, incluyendo encriptación de datos, para proteger su información contra accesos no autorizados, alteraciones o divulgación.</T>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}