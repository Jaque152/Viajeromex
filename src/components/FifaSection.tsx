"use client";

import { T } from "@/components/T";
import Image from 'next/image';

export function FifaSection() {
  return (
    <section className="bg-background py-24 md:py-32 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          
          <div className="relative w-full max-w-2xl aspect-[16/9] mb-16 overflow-hidden animate-fade-up">
            <Image 
              src="https://images.unsplash.com/photo-1614632537190-23e4146777db?q=80&w=2000&auto=format&fit=crop" 
              alt="Hospitalidad Mundial 2026" 
              fill
              className="object-cover"
            />
          </div>

          <div className="animate-fade-up delay-100">
            <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-8">
              <T>¡No solo veas el Mundial 2026, vívelo!</T>
            </h2>
            
            <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed mb-6">
              <T>Asegura tu lugar en los mejores bares y restaurantes con espacios exclusivos y reservados para ti, tus amigos o familiares. Disfruta de la emoción de cada partido con la mejor gastronomía y bebida a tu alcance.</T>
            </p>
            
            <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed mb-12">
              <T>Simplemente elige tu lugar favorito y el partido: nosotros nos encargamos de la reserva y todos los detalles. Tu única misión será enfocarte en el partido y apoyar a la selección.</T>
            </p>

            <button className="border border-foreground text-foreground px-12 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors duration-300">
              <T>Reservar</T>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}