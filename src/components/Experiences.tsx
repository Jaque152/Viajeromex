"use client";

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { T } from "@/components/T";
import Image from 'next/image';
import { ArrowRight, MapPin, Star } from "lucide-react";

export function Experiences() {
  const locale = useLocale();

  const tours = [
    { id: 1, title: "Sabor Local en Mercado", location: "San Rafael, CDMX", image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2070", price: "$1,670 MXN" },
    { id: 9, title: "Tacos y Tequila Gourmet", location: "San Miguel de Allende", image: "https://images.unsplash.com/photo-1565299543923-37dd37887442?q=80&w=2070", price: "$1,680 MXN" },
    { id: 10, title: "Sabores Tradicionales", location: "Oaxaca", image: "https://images.unsplash.com/photo-1599974519780-60b7643b67be?q=80&w=2070", price: "$4,600 MXN" },
  ];

  const featuredTour = tours[0];
  const stackedTours = tours.slice(1);

  return (
    <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden rounded-[3rem] mx-4 md:mx-8 my-10">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 animate-bounce-up">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4 block"><T>Prueba México</T></span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-bricolage text-foreground"><T>Las Rutas Favoritas</T></h2>
          </div>
          <Link href={`/${locale}/experiencias`} className="btn-3d bg-secondary text-white px-8 py-4 rounded-full font-black flex items-center gap-3 mt-6 md:mt-0 hover:bg-rose-600">
            <T>Ver Menú Completo</T>
            <ArrowRight className="w-5 h-5" strokeWidth={3} />
          </Link>
        </div>

        {/* Grid Asimétrico: 1 Destacado + 2 Apilados */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Tarjeta Destacada (Col-span-7) */}
          <Link href={`/${locale}/experiencias/${featuredTour.id}`} className="lg:col-span-7 group block animate-bounce-up hover-float">
            <div className="bg-white rounded-[3rem] p-4 shadow-lg shadow-slate-200 border-2 border-slate-100 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-8 left-8 z-20 bg-accent text-accent-foreground px-4 py-2 rounded-full font-black text-xs uppercase flex items-center gap-2 shadow-lg">
                <Star className="w-4 h-4" fill="currentColor" /> <T>Top Choice</T>
              </div>

              <div className="relative w-full h-[300px] md:h-[450px] rounded-[2.5rem] overflow-hidden mb-6">
                <Image src={featuredTour.image} alt={featuredTour.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              
              <div className="px-4 pb-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-widest">
                      <MapPin className="w-4 h-4 text-primary" strokeWidth={2.5} />
                      <T>{featuredTour.location}</T>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl font-black text-lg">
                      {featuredTour.price}
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black font-bricolage text-foreground leading-tight group-hover:text-primary transition-colors">
                    <T>{featuredTour.title}</T>
                  </h3>
                </div>
              </div>
            </div>
          </Link>

          {/* Tarjetas Apiladas (Col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {stackedTours.map((tour, idx) => (
              <Link href={`/${locale}/experiencias/${tour.id}`} key={tour.id} className="group block h-full animate-bounce-up hover-float" style={{ animationDelay: `${(idx + 1) * 150}ms` }}>
                
                {/* Layout Horizontal para las tarjetas pequeñas */}
                <div className="bg-white rounded-[2.5rem] p-3 shadow-lg shadow-slate-200 border-2 border-slate-100 h-full flex flex-col sm:flex-row gap-4 items-center">
                  
                  <div className="relative w-full sm:w-40 h-48 sm:h-full rounded-[2rem] overflow-hidden shrink-0">
                    <Image src={tour.image} alt={tour.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  </div>
                  
                  <div className="p-4 flex flex-col justify-center flex-1 w-full">
                    <div className="flex items-center gap-2 text-muted-foreground font-bold text-[10px] uppercase tracking-widest mb-2">
                      <MapPin className="w-3.5 h-3.5 text-secondary" strokeWidth={3} />
                      <T>{tour.location}</T>
                    </div>
                    <h3 className="text-xl font-black font-bricolage text-foreground mb-4 leading-tight group-hover:text-secondary transition-colors">
                      <T>{tour.title}</T>
                    </h3>
                    <div className="font-black text-lg text-primary mt-auto">
                      {tour.price}
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}