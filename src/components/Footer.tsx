"use client";

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { T } from "@/components/T";
import { Instagram, Mail, Phone, Compass } from "lucide-react";

export function Footer() {
  const locale = useLocale();

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 rounded-t-[3rem] mt-10 mx-2 lg:mx-4">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link href={`/${locale}/`} className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                Viajero<span className="text-secondary">mex</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
              <T>Tu pasaporte a las mejores aventuras, sabores y culturas de México. Viaja seguro, fácil y a tu propio ritmo.</T>
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <span className="text-white font-bold text-lg mb-2"><T>Descubrir</T></span>
            <Link href={`/${locale}/experiencias`} className="text-slate-400 font-medium hover:text-secondary transition-colors text-sm"><T>Todas las Aventuras</T></Link>
            <Link href={`/${locale}/#cotizar`} className="text-slate-400 font-medium hover:text-secondary transition-colors text-sm"><T>Viajes a la Medida</T></Link>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-white font-bold text-lg mb-2"><T>Atención al Viajero</T></span>
            <a href="mailto:atencion@viajeromex.com" className="text-slate-400 font-medium hover:text-secondary transition-colors text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> atencion@viajeromex.com
            </a>
            <a href="tel:55 1940 6598" className="text-slate-400 font-medium hover:text-secondary transition-colors text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> +52 (55) 1940 6598
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-white font-bold text-lg mb-2"><T>Legal</T></span>
            <a href="#" className="text-slate-400 font-medium hover:text-secondary transition-colors text-sm"><T>Aviso de Privacidad</T></a>
            <a href="#" className="text-slate-400 font-medium hover:text-secondary transition-colors text-sm"><T>Términos y Condiciones</T></a>
            <a href="#" className="text-slate-400 font-medium hover:text-secondary transition-colors text-sm"><T>Políticas de Cancelación</T></a>
          </div>
        </div>

        {/* Bottom Bar: Logos de Pago y Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase"><T>Pagos 100% Seguros</T></span>
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 w-auto object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-5 w-auto object-contain" />
            </div>
          </div>
          <div className="text-sm font-medium text-slate-500">
            <span>© {new Date().getFullYear()} Viajeromex. <T>Todos los derechos reservados.</T></span>
          </div>
        </div>

      </div>
    </footer>
  );
}