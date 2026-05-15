"use client";

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { T } from "@/components/T";
import { Sparkles, ArrowRight, ChefHat } from "lucide-react";
import Image from 'next/image';

export function Hero() {
  const locale = useLocale();

  return (
    <section className="relative w-full min-h-screen pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-background">
      {/* Elementos decorativos (colores cítricos/apetitosos) */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          
          {/* Columna Texto (Izquierda) */}
          <div className="relative z-10 animate-bounce-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent-foreground rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-accent/30">
              <Sparkles className="w-4 h-4 text-accent" />
              <T>Siente el Sabor Local</T>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-bricolage font-black text-foreground leading-[1.05] mb-6">
              <T>Cómete a</T> <br/>
              <span className="text-primary"><T>México</T></span> <br/>
              <T>a mordidas.</T>
            </h1>
            
            <p className="text-lg text-muted-foreground font-medium mb-10 max-w-lg leading-relaxed">
              <T>Desde los secretos del mercado tradicional hasta cenas exclusivas con chefs locales. Diseñamos rutas gastronómicas que despiertan todos tus sentidos.</T>
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href={`/${locale}/experiencias`} 
                className="btn-3d bg-primary text-white px-8 py-4 rounded-full font-black text-lg flex items-center gap-3 border-2 border-transparent"
              >
                <T>Ver Menú de Tours</T>
                <ArrowRight className="w-5 h-5" strokeWidth={3} />
              </Link>
              <Link 
                href={`/${locale}/#cotizar`} 
                className="px-8 py-4 rounded-full font-bold text-foreground bg-muted hover:bg-slate-200 transition-colors"
              >
                <T>Cata a Medida</T>
              </Link>
            </div>
          </div>

          {/* Columna Collage Visual Foodie (Derecha) */}
          <div className="relative h-[500px] md:h-[600px] w-full hidden sm:block animate-bounce-up delay-100">
            {/* Foto Principal (Comida de Mercado/Callejera) */}
            <div className="absolute right-0 top-10 w-[70%] h-[75%] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/20 hover-float z-10 border-4 border-white">
              <Image 
                src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2070" 
                alt="Mercado de Comida Mexicana" 
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Foto Secundaria (Gourmet / Tacos) */}
            <div className="absolute left-10 bottom-0 w-[55%] h-[50%] rounded-[2.5rem] overflow-hidden shadow-xl hover-float z-20 border-4 border-white bg-white">
              <Image 
                src="https://images.unsplash.com/photo-1565299543923-37dd37887442?q=80&w=2070" 
                alt="Tacos Gourmet" 
                fill
                className="object-cover"
              />
            </div>

            {/* Tarjeta Flotante (Sticker Gastronómico) */}
            <div className="absolute top-24 left-4 bg-white px-5 py-3 rounded-2xl shadow-lg z-30 flex items-center gap-3 border border-slate-100 hover-float">
              <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center">
                <ChefHat className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase"><T>Más de</T></p>
                <p className="text-lg font-black font-bricolage text-foreground">15+ <T>Rutas de Sabor</T></p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}