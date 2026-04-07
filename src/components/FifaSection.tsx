"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { FifaExp } from "@/lib/types";
import { T } from "@/components/T";

export function FifaSection() {
  const [fifaExps, setFifaExps] = useState<FifaExp[]>([]);
  const locale = useLocale();
  useEffect(() => {
    async function loadFifaData() {
      const { data } = await supabase
        .from('fifa_experiences')
        .select('*')
        .order('order_index', { ascending: true });
      if (data) setFifaExps(data);
    }
    loadFifaData();
  }, []);

  return (
    <section className="py-24 bg-stone-50 overflow-hidden border-y border-stone-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full mb-4">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Vive la FIFA 2026</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-stone-900 mb-6">
              <T>¿Cómo participar en </T><span className="text-primary"><T>la gran fiesta?</T></span>
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-4">
              <T>Todas nuestras experiencias son personalizadas. Cuéntanos tu presupuesto y nosotros organizamos una aventura a tu medida.</T>
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-medium text-stone-500">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /><T> Comodidad </T></span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /><T> Diversión </T></span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /><T> Organización Profesional </T></span>
            </div>
          </div>
          
          <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-white h-14 px-10 text-lg shadow-lg shadow-orange-100">
            <Link href={`/${locale}/cotizar`}><T>Organizar mi aventura </T><ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </div>

        {/* Carrusel de imagenes (Permite regresar, avanzar y gestos táctiles) */}
        <div className="relative group">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing">
            {fifaExps.map((exp) => (
              <div key={exp.id} className="w-[300px] md:w-[450px] shrink-0 snap-start">
                <div className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter text-primary">
                      <T>{exp.subtitle}</T>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-serif font-bold text-stone-800 mb-3"><T>{exp.title}</T></h3>
                    <p className="text-stone-500 text-sm mb-6 leading-relaxed"><T>{exp.description}</T></p>
                    
                    <ul className="space-y-3 mt-auto">
                      {exp.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-stone-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <T>{item}</T>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hint visual para indicar que se puede navegar */}
          <div className="flex justify-center gap-2 mt-4 text-stone-300">
            {fifaExps.map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-current" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}