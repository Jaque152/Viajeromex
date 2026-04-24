"use client";
import { T } from "@/components/T";
import { Button } from "@/components/ui/button";
import { Globe2, MapPin, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLocale } from 'next-intl';

export function Hero() {
  const locale = useLocale();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Contenido Centralizado */}
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground rounded-full shadow-lg hover:scale-105 transition-transform cursor-default">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-bold text-background tracking-wide uppercase">
              <T>OPERACIONES DE VIAJE</T>
            </span>
          </div>

          {/* Tamaños de texto */}
          <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tighter">
            <T>Deesbloquea el</T>{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                México
              </span>
              {/* Subrayado decorativo tecnológico */}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
              </svg>
            </span>
            <br />
            <T>inexplorado</T>
          </h1>

          <p className="text-lg md:text-xl font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            <T>Tecnología, precisión y logística de primer nivel para conectarte con los rincones más fascinantes del país. Tú decides el destino, nosotros orquestamos el resto.</T>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 w-full sm:w-auto">
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,87,51,0.5)] transition-all hover:scale-105 group">
              <Link href={`/${locale}/experiencias`}>
                <T>Iniciar Exploración</T>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-border/50 bg-white/50 backdrop-blur-sm font-bold text-lg hover:bg-foreground hover:text-background hover:border-foreground transition-all">
              <Link href={`/${locale}/#contacto`}>
                <Globe2 className="w-5 h-5 mr-2" />
                <T>Conectar</T>
              </Link>
            </Button>
          </div>
        </div>

        {/* Galería Panorámica Flotante */}
        <div className="mt-20 relative w-full max-w-6xl mx-auto hidden md:flex justify-center items-center gap-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          
          {/* Tarjeta Izquierda */}
          <div className="relative w-1/3 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl -rotate-6 translate-y-8 hover:rotate-0 hover:translate-y-0 transition-all duration-500 hover:z-20 group">
             <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/30746580/pexels-photo-30746580.jpeg')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
             <div className="absolute bottom-4 left-4 glass-panel px-3 py-1.5 rounded-lg text-white text-xs font-bold border-white/20">
                Puebla
             </div>
          </div>

          {/* Tarjeta Central */}
          <div className="relative w-2/5 aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-10 hover:scale-105 transition-all duration-500 group">
             <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/12665188/pexels-photo-12665188.jpeg')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
             <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-panel px-4 py-3 rounded-2xl flex items-center justify-between text-white border-white/20">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary rounded-full"><MapPin className="w-4 h-4" /></div>
                     <span className="text-sm md:text-base font-bold tracking-wide">CDMX</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Tarjeta Derecha */}
          <div className="relative w-1/3 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl rotate-6 translate-y-8 hover:rotate-0 hover:translate-y-0 transition-all duration-500 hover:z-20 group">
             <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/22912077/pexels-photo-22912077.jpeg')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
             <div className="absolute bottom-4 left-4 glass-panel px-3 py-1.5 rounded-lg text-white text-xs font-bold border-white/20">
                Los Cabos
             </div>
          </div>

        </div>

      </div>
    </section>
  );
}