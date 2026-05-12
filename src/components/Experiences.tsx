"use client";

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { T } from "@/components/T";
import Image from 'next/image';

export function Experiences() {
  const locale = useLocale();

  const tours = [
    { id: 1, title: "Alta Cocina Contemporánea", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop", span: "col-span-1 md:col-span-2 row-span-2" },
    { id: 2, title: "Ruta del Vino y Maridaje", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop", span: "col-span-1" },
    { id: 3, title: "Herencia Prehispánica", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop", span: "col-span-1" },
    { id: 4, title: "Street Food Premium", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2081&auto=format&fit=crop", span: "col-span-1 md:col-span-2" },
  ];

  return (
    <section className="bg-foreground py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-secondary mb-4 block">
            <T>Nuestra Selección</T>
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-background mb-8">
            <T>Turismo Gastronómico</T>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto mb-16">
          {tours.map((tour) => (
            <Link 
              href={`/${locale}/experiencias`} 
              key={tour.id} 
              className={`relative group overflow-hidden bg-background/5 min-h-[300px] md:min-h-[400px] ${tour.span}`}
            >
              <Image 
                src={tour.image} 
                alt={tour.title} 
                fill 
                className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-80" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl font-serif text-background group-hover:text-secondary transition-colors">
                  <T>{tour.title}</T>
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href={`/${locale}/experiencias`} 
            className="inline-block border border-background/30 text-background px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-background hover:text-foreground transition-colors duration-300"
          >
            <T>Todos los Tours</T>
          </Link>
        </div>
      </div>
    </section>
  );
}