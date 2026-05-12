"use client";

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { T } from "@/components/T";
import { ArrowRight } from "lucide-react";
import Image from 'next/image';

export function Hero() {
  const locale = useLocale();

  return (
    <section className="relative w-full min-h-screen flex items-center bg-background pt-24 pb-12 lg:pt-0 overflow-hidden">
      <div className="container mx-auto px-6 h-full">
        <div className="flex flex-col-reverse lg:flex-row items-center h-full gap-12 lg:gap-0">
          
          {/* Texto Izquierdo (Tipografía Monumental) */}
          <div className="w-full lg:w-1/2 lg:pr-12 relative z-10 flex flex-col justify-center">
            <div className="animate-fade-up">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-secondary mb-6 block">
                <T>Curaduría Culinaria</T>
              </span>
              <h1 className="text-6xl md:text-7xl lg:text-[7rem] font-serif text-foreground leading-[0.9] mb-8">
                <T>Sabores</T><br/>
                <span className="italic text-primary"><T>ocultos.</T></span><br/>
                <T>Rutas vivas.</T>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-md font-light leading-relaxed mb-12">
                <T>Diseñamos inmersiones gastronómicas exclusivas. Desde la cosecha en la tierra hasta las mesas más reservadas de México. Una travesía sensorial para paladares exigentes.</T>
              </p>
              
              <div className="flex items-center gap-8">
                <Link 
                  href={`/${locale}/experiencias`} 
                  className="group flex items-center gap-4 border-b border-foreground pb-2 hover:border-primary transition-colors"
                >
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground group-hover:text-primary transition-colors">
                    <T>Ver Expediciones</T>
                  </span>
                  <ArrowRight className="w-4 h-4 text-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                </Link>
              </div>
            </div>
          </div>

          {/* Imagen Derecha (Retrato Asimétrico con Parallax effect) */}
          <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative animate-fade-up delay-200">
            {/* Contenedor que no toca los bordes en desktop, dando estilo de revista */}
            <div className="absolute top-0 lg:top-[10%] right-0 lg:-right-[5%] w-full lg:w-[110%] h-full lg:h-[80%] overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop" 
                alt="Alta Gastronomía" 
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center animate-ken-burns opacity-90"
                priority
              />
            </div>
            {/* Elemento decorativo */}
            <div className="hidden lg:block absolute bottom-[15%] -left-12 w-24 h-[1px] bg-secondary z-20"></div>
          </div>

        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-fade-up delay-300">
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground [writing-mode:vertical-lr] rotate-180">Descubrir</span>
        <div className="w-[1px] h-12 bg-secondary/30 relative overflow-hidden">
          <div className="w-full h-full bg-secondary absolute top-0 left-0 animate-[slideDown_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </section>
  );
}