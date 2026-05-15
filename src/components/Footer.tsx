"use client";

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { T } from "@/components/T";
import { Instagram, Mail, Phone } from "lucide-react";

export function Footer() {
  const locale = useLocale();

  return (
    <footer className="bg-foreground text-background pt-20 pb-10 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Cabecera del Footer: Marca 100% visible */}
        <div className="text-center md:text-left mb-16 border-b border-background/10 pb-10">
          <Link href={`/${locale}/`} className="text-4xl md:text-5xl font-serif font-medium text-background tracking-widest hover:text-primary transition-colors">
            Mextripia<span className="text-secondary">.</span>
          </Link>
        </div>

        {/* Grid de enlaces estructurado (Similar a ClickDestino) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-16">
          
          {/* Columna 1: Navegación */}
          <div className="flex flex-col gap-5 text-[11px] uppercase tracking-[0.2em] font-bold">
            <span className="text-secondary mb-2"><T>Navegación</T></span>
            <Link href={`/${locale}/`} className="hover:text-background/70 transition-colors"><T>Inicio</T></Link>
            <Link href={`/${locale}/experiencias`} className="hover:text-background/70 transition-colors"><T>Expediciones</T></Link>
            <Link href={`/${locale}/cotizar`} className="hover:text-background/70 transition-colors"><T>Eventos Privados</T></Link>
          </div>

          {/* Columna 2: Contacto */}
          <div className="flex flex-col gap-5 text-[11px] uppercase tracking-[0.2em] font-bold">
            <span className="text-secondary mb-2"><T>Contacto</T></span>
            <a href="mailto:atencion@mextripia.com" className="hover:text-background/70 transition-colors flex items-center justify-center md:justify-start gap-3">
              <Mail className="w-4 h-4 text-secondary" /> atencion@mextripia.com
            </a>
            <a href="tel:+5255555555" className="hover:text-background/70 transition-colors flex items-center justify-center md:justify-start gap-3">
              <Phone className="w-4 h-4 text-secondary" /> +52 (55) 5555 5555
            </a>
          </div>

          {/* Columna 3: Legales */}
          <div className="flex flex-col gap-5 text-[11px] uppercase tracking-[0.2em] font-bold">
            <span className="text-secondary mb-2"><T>Legales</T></span>
            <a href="#" className="hover:text-background/70 transition-colors"><T>Aviso de Privacidad</T></a>
            <a href="#" className="hover:text-background/70 transition-colors"><T>Términos y Condiciones</T></a>
            <a href="#" className="hover:text-background/70 transition-colors"><T>Política de Cancelaciones</T></a>
          </div>
        </div>

        {/* Bottom Bar: Logos de Pago y Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-background/10">
          
          {/* Logos de pago */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-background/5 p-2 rounded border border-background/10">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" 
                alt="Mastercard" 
                className="h-5 w-auto object-contain opacity-90" 
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" 
                alt="Visa" 
                className="h-5 w-auto object-contain opacity-90" 
              />
            </div>
          </div>

          {/* Copyright */}
          <div className="text-[10px] font-light tracking-widest text-background/50 uppercase">
            <span>© {new Date().getFullYear()} Mextripia. <T>Todos los derechos reservados.</T></span>
          </div>
          
        </div>

      </div>
    </footer>
  );
}