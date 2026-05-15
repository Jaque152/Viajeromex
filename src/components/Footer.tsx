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
            {/* Payment Icons */}
          <div className="flex gap-2">
            <div className="px-3 py-1.5 bg-white rounded flex items-center justify-center">
              <svg className="h-4" viewBox="0 0 780 500" fill="none"><rect width="780" height="500" rx="40" fill="white"/><path fill="#1434CB" d="M293.2 348.7l33.3-190.4h53.3l-33.3 190.4h-53.3zM500.8 163c-10.5-3.9-27-8.1-47.6-8.1-52.4 0-89.3 26.4-89.6 64.2-.3 28 26.5 43.6 46.7 52.9 20.7 9.5 27.7 15.6 27.6 24.1-.1 13-16.6 19-31.9 19-21.3 0-32.6-3-50.1-10.3l-6.9-3.1-7.5 43.8c12.4 5.4 35.5 10.1 59.4 10.4 55.7 0 91.9-26.1 92.3-66.5.2-22.2-14-39.1-44.6-53-18.6-9-30-15-29.9-24.1 0-8.1 9.6-16.7 30.5-16.7 17.4-.3 30 3.5 39.8 7.5l4.8 2.3 7.2-42.4h.8zM581.8 158.3h-41c-12.7 0-22.2 3.5-27.8 16.2l-78.8 178.2h55.7l11.1-29.1h68.1l6.5 29.1H624l-42.2-194.4zm-65.6 125.2c4.4-11.2 21.3-54.4 21.3-54.4-.3.5 4.4-11.4 7.1-18.7l3.6 16.9s10.2 46.6 12.4 56.2h-44.4z"/><path fill="#1434CB" d="M239.5 158.3L187.4 289l-5.5-26.8c-9.6-30.7-39.5-64-73-80.6l47.5 166.9h56l83.2-190.2h-56.1z"/><path fill="#F7B600" d="M146.9 158.3H61.3l-.6 3.5c66.4 16 110.3 54.7 128.5 101.2l-18.5-88.8c-3.2-12.1-12.5-15.5-23.8-15.9z"/></svg>
            </div>
            <div className="px-3 py-1.5 bg-white rounded flex items-center justify-center">
              <svg className="h-4" viewBox="0 0 152 100" fill="none"><rect width="152" height="100" rx="8" fill="white"/><circle cx="55" cy="50" r="30" fill="#EB001B"/><circle cx="97" cy="50" r="30" fill="#F79E1B"/><path d="M76 27.5C82.6 32.8 87 40.8 87 50C87 59.2 82.6 67.2 76 72.5C69.4 67.2 65 59.2 65 50C65 40.8 69.4 32.8 76 27.5Z" fill="#FF5F00"/></svg>
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