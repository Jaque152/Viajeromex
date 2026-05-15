"use client";

import { T } from "@/components/T";
import Image from 'next/image';
import { Trophy } from "lucide-react";

export function FifaSection() {
  return (
    <section className="py-24 md:py-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative">
        
        {/* Contenedor Visual (Ticket Gigante) */}
        <div className="bg-slate-900 rounded-[3rem] w-full flex flex-col md:flex-row overflow-hidden shadow-2xl animate-bounce-up border-4 border-slate-800">
          
          {/* Mitad Imagen */}
          <div className="w-full md:w-1/2 h-[400px] md:h-auto relative">
            <Image 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070" 
              alt="Mundial Gastronomía" 
              fill
              className="object-cover opacity-80"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900 hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent block md:hidden" />
          </div>

          {/* Mitad Texto y CTA */}
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-slate-900 rounded-full mb-6 font-black text-xs uppercase tracking-widest w-fit shadow-lg shadow-accent/20">
              <Trophy className="w-4 h-4" strokeWidth={3} />
              <T>Mundial 2026</T>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-bricolage text-white leading-tight mb-6 tracking-tight">
              <T>Hospitalidad</T> <span className="text-primary"><T>Gourmet</T></span> <T>en el Mundial.</T>
            </h2>
            
            <p className="text-slate-300 text-lg font-medium leading-relaxed mb-10">
              <T>Asegura tu lugar en los recintos más exclusivos durante los partidos. Nos encargamos de reservas privadas, pantallas gigantes y la mejor comida para que tú solo grites el gol.</T>
            </p>
            
            <button className="btn-3d bg-primary text-white px-8 py-4 rounded-full font-black text-lg w-fit hover:bg-orange-600 transition-colors shadow-xl shadow-primary/20">
              <T>Asegurar Espacio</T>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}