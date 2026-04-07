"use client";
import { T } from "@/components/T";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Compass } from "lucide-react";
import Link from "next/link";
import { useLocale } from 'next-intl';

export function Hero() {
  const locale = useLocale();
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Compass className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                <T>Experiencias Auténticas</T>
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-tight">
              <T> Descubre el </T> <span className="relative text-primary">México</span><br />
              <T>que siempre soñaste</T>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              <T>Diseñamos experiencias personalizadas donde tú eres el protagonista.
              Desde santuarios naturales hasta tradiciones ancestrales.</T>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="mt-4">
              <Link href={`/${locale}/experiencias`}>
              <T>Ver experiencias</T>
              </Link>
            </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden relative group shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://lugares.inah.gob.mx/sites/default/files/zonas/185_A_slider_chichen_itza_3.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Chichén Itzá</span>
                  </div>
                </div>
                {/* Logo dinámico en el grid */}
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl aspect-[1.2] flex items-center justify-center p-10 group border border-white/20">
                  <img 
                    src="/logo 2.png" 
                    alt="Logo" 
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
              </div>

              <div className="space-y-4 pt-12">
                <div className="aspect-square rounded-3xl overflow-hidden relative shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://oem.com.mx/elsoldemexico/img/13723873/1729769072/BASE_LANDSCAPE/1200/image.webp')] bg-cover bg-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white text-sm font-medium">Oaxaca de Juárez</div>
                </div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden relative shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://www.delphinusworld.com/hubfs/playas%20y%20cenotes%20riviera%20maya.webp')] bg-cover bg-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white text-sm font-medium">Riviera Maya</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}