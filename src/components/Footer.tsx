"use client";
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from "react";
import Link from "next/link";
import { T } from "@/components/T";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleLang = (lang: string) => {
    startTransition(() => router.replace(pathname.replace(`/${locale}`, `/${lang}`) || `/${lang}`));
  };

  return (
    <footer className="bg-background pt-24 pb-12 overflow-hidden border-t border-slate-100">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Nivel 1: Navegación y Selector de Idioma */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 mb-20">
          <nav>
            <ul className="flex flex-wrap justify-center gap-8 font-black text-slate-400 uppercase tracking-widest text-xs">
              <li><Link href={`/${locale}/`} className="hover:text-primary transition-colors"><T>Inicio</T></Link></li>
              <li><Link href={`/${locale}/#experiencias`} className="hover:text-primary transition-colors"><T>Experiencias</T></Link></li>
              <li><Link href={`/${locale}/#contacto`} className="hover:text-primary transition-colors"><T>Contacto</T></Link></li>
            </ul>
          </nav>

          <div className="flex bg-slate-100 rounded-full p-1.5 shadow-inner">
            <button 
              onClick={() => handleLang('es')} 
              className={`px-6 py-2 rounded-full text-xs font-black transition-all ${locale === 'es' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              🇲🇽 ES
            </button>
            <button 
              onClick={() => handleLang('en')} 
              className={`px-6 py-2 rounded-full text-xs font-black transition-all ${locale === 'en' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              🇺🇸 EN
            </button>
          </div>
        </div>

        {/* Nivel 2: Branding */}
        <div className="relative mb-20 select-none flex justify-center w-full overflow-hidden">
          <h2 className="text-4xl sm:text-[4rem] md:text-[6rem] lg:text-[7rem] xl:text-[9rem] leading-none font-black text-slate-900 tracking-tighter text-center">
            EXPLONIX
          </h2>
          
          {/* Línea decorativa neón que atraviesa el branding */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -z-10" />
        </div>

        {/* Nivel 3: Contacto y Pagos*/}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 items-start py-12 border-y border-slate-100 mb-12">
          
          {/* Datos de Contacto */}
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6"><T>Contacto</T></p>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-primary" />
              </div>
              <a href="mailto:contacto@explonix.com" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">contacto@explonixx.com</a>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Phone className="w-4 h-4 text-slate-400 group-hover:text-primary" />
              </div>
              <a href="tel:+525555555555" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">+52 55 5555 5555</a>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-600">Ciudad de México, MX</p>
            </div>
          </div>

          {/* Espacio central decorativo o para mensaje de marca */}
          <div className="hidden lg:block text-center px-10">
            <p className="text-sm font-medium text-slate-400 italic">
              <T>"Redefiniendo la forma en la que el mundo explora el corazón de México."</T>
            </p>
          </div>

          {/* Métodos de Pago */}
          <div className="md:text-right flex flex-col md:items-end">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6"><T>Aceptamos</T></p>
            <div className="flex items-center gap-4">
              {/* VISA */}
              <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 h-12 flex items-center shadow-sm hover:shadow-md transition-shadow">
                <svg viewBox="0 0 750 471" className="h-5 w-auto">
                  <path fill="#1A1F71" d="M278.198 334.228l33.361-195.763h53.358l-33.385 195.763h-53.334zm246.111-191.54c-10.572-3.966-27.135-8.222-47.822-8.222-52.725 0-89.865 26.551-90.18 64.604-.316 28.138 26.503 43.845 46.752 53.202 20.77 9.593 27.752 15.714 27.656 24.314-.096 13.132-16.586 19.118-31.937 19.118-21.37 0-32.691-2.97-50.225-10.277l-6.876-3.107-7.487 43.823c12.463 5.466 35.508 10.199 59.438 10.445 56.09 0 92.5-26.246 92.91-66.882.2-22.28-14.016-39.215-44.801-53.188-18.65-9.056-30.072-15.099-29.951-24.269 0-8.137 9.668-16.838 30.559-16.838 17.447-.271 30.11 3.534 39.936 7.5l4.781 2.259 7.247-42.482zm137.303-4.223h-41.23c-12.773 0-22.332 3.487-27.941 16.234l-79.245 179.402h56.031s9.16-24.121 11.233-29.418c6.123 0 60.555.084 68.336.084 1.596 6.854 6.492 29.334 6.492 29.334h49.512l-43.188-195.636zm-65.418 126.408c4.413-11.279 21.26-54.724 21.26-54.724-.316.522 4.379-11.334 7.074-18.684l3.607 16.878s10.217 46.729 12.352 56.53h-44.293zM209.59 138.465l-52.24 133.496-5.565-27.129c-9.726-31.274-40.025-65.157-73.898-82.12l47.767 171.204 56.455-.064 84.004-195.39h-56.523z"/><path fill="#F9A533" d="M146.92 138.465H62.54l-.683 4.073c66.938 16.204 111.232 55.337 129.618 102.415l-18.71-89.96c-3.23-12.396-12.598-16.096-25.845-16.528z"/></svg>
              </div>
              {/* Mastercard */}
              <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 h-12 flex items-center shadow-sm hover:shadow-md transition-shadow">
                <svg viewBox="0 0 131.39 86.9" className="h-6 w-auto">
                  <circle fill="#EB001B" cx="43.45" cy="43.45" r="43.45"/><circle fill="#F79E1B" cx="87.94" cy="43.45" r="43.45"/><path fill="#FF5F00" d="M65.7 16.68a43.3 43.3 0 0 0-16.08 33.77c0 13.54 6.22 25.64 15.95 33.58a43.3 43.3 0 0 0 16.08-33.77c0-13.54-6.22-25.64-15.95-33.58z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Nivel 4: Copy y Legales */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-400">
            © {new Date().getFullYear()} Explonix. <T>Todos los derechos reservados.</T>
          </p>
          <div className="flex gap-8 text-xs font-black text-slate-400 uppercase tracking-widest">
            <Link href={`/${locale}/aviso-de-privacidad`} className="hover:text-primary transition-colors"><T>Privacidad</T></Link>
            <Link href={`/${locale}/terminos-y-condiciones`} className="hover:text-primary transition-colors"><T>Términos</T></Link>
          </div>
        </div>

      </div>
    </footer>
  );
}