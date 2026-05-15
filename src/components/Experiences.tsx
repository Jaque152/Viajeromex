"use client";

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { T } from "@/components/T";
import Image from 'next/image';

export function Experiences() {
  const locale = useLocale();

  const tours = [
    { id: 1, title: "Travesía Prehispánica", location: "Oaxaca", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" },
    { id: 2, title: "El Arte del Agave", location: "Jalisco", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop" },
    { id: 3, title: "Brisas del Pacífico", location: "Riviera Nayarit", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop" },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 animate-fade-in-up">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4 block"><T>Expediciones</T></span>
            <h2 className="text-4xl md:text-5xl"><T>Rutas de Sabor</T></h2>
          </div>
          <Link href={`/${locale}/experiencias`} className="text-sm font-semibold border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors mt-6 md:mt-0">
            <T>Explorar Colección</T>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {tours.map((tour, idx) => (
            <Link href={`/${locale}/experiencias`} key={tour.id} className="group animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6">
                <Image src={tour.image} alt={tour.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
              </div>
              <h3 className="text-2xl mb-2 group-hover:text-primary transition-colors"><T>{tour.title}</T></h3>
              <p className="text-sm text-muted-foreground uppercase tracking-widest"><T>{tour.location}</T></p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}