"use client";

import { T } from "@/components/T";
import Image from 'next/image';

export function FifaSection() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6 max-w-7xl relative">
        
        {/* Imagen de fondo (Con bordes suaves) */}
        <div className="w-full h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden relative animate-fade-in-up">
          <Image 
            src="https://images.unsplash.com/photo-1614632537190-23e4146777db?q=80&w=2000&auto=format&fit=crop" 
            alt="Hospitalidad Mundial" 
            fill
            className="object-cover"
          />
        </div>

        {/* Tarjeta VIP sobrelapada */}
        <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-2xl max-w-2xl mx-auto -mt-32 md:-mt-48 relative z-10 text-center animate-fade-in-up delay-150">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4 block">
            <T>Hospitalidad Deportiva</T>
          </span>
          <h2 className="text-3xl md:text-5xl mb-6">
            <T>La Copa 2026, Servida a su Mesa.</T>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            <T>Garantice su presencia en los recintos gastronómicos más exclusivos durante la justa deportiva. Nos encargamos de sus accesos, reservas privadas y un ambiente inmejorable para que su única preocupación sea celebrar.</T>
          </p>
          <button className="bg-foreground text-white px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors duration-300">
            <T>Asegurar Espacio</T>
          </button>
        </div>

      </div>
    </section>
  );
}