"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from '@/lib/supabase';
import { Loader2, MapPin, ArrowRight } from "lucide-react";
import { Experience, SupabaseExperienceResponse } from "@/lib/types";
import { T } from "@/components/T";

type ExperienceWithPrice = Experience & { displayPrice: number };

function ExperienciasContent() {
  const locale = useLocale();
  const [experiences, setExperiences] = useState<ExperienceWithPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: actData, error } = await supabase
          .from('activities_vm')
          .select(`
            id, title, slug, description, location, images, category_id,
            categories:categories_vm(id, name, slug),
            activity_packages:activity_packages_vm(price)
          `);

        if (error) {
          console.error("Error detallado de Supabase:", JSON.stringify(error));
          return;
        }

        if (actData) {
          const mappedData: ExperienceWithPrice[] = (actData as unknown as SupabaseExperienceResponse[]).map((item) => ({
            ...item,
            categories: item.categories || undefined,
            description: item.description || "",
            images: item.images || [],
            displayPrice: item.activity_packages?.[0]?.price || 0
          }));
          setExperiences(mappedData);
        }
      } catch (error) {
        console.error("Error inesperado:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(price);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 animate-spin text-primary" strokeWidth={3} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        
        {/* Decoraciones de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Encabezado Vibrante */}
        <div className="container mx-auto px-6 max-w-7xl mb-16 text-center animate-bounce-up">
          <div className="inline-block bg-accent/20 text-accent-foreground px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest mb-4 border border-accent/30">
            <T>El Menú Principal</T>
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-bricolage text-foreground leading-tight mb-4">
            <T>Nuestras</T> <span className="text-primary"><T>Rutas de Sabor</T></span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            <T>Elige tu próximo destino culinario. Experiencias diseñadas para enamorar tu paladar.</T>
          </p>
        </div>

        {/* Grid de Tarjetas App-Style */}
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp, idx) => {
              const thumbImage = exp.images?.length > 0 ? exp.images[0] : '/placeholder.jpg';

              return (
                <Link key={exp.id} href={`/${locale}/experiencias/${exp.id}`} className="group block animate-bounce-up" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="bg-white rounded-[2.5rem] p-4 shadow-lg shadow-slate-200/50 border border-slate-100 hover-float h-full flex flex-col">
                    
                    {/* Imagen con bordes súper redondeados */}
                    <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-5">
                      <Image 
                        src={thumbImage} 
                        alt={exp.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                      {/* Etiqueta de Precio Flotante */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-sm font-black text-primary flex flex-col items-end leading-none">
                        <span className="text-[10px] text-muted-foreground uppercase"><T>Desde</T></span>
                        <span>{formatPrice(exp.displayPrice)}</span>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="px-2 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-widest mb-2">
                        <MapPin className="w-3.5 h-3.5 text-secondary" strokeWidth={2.5} />
                        <T>{exp.location}</T>
                      </div>
                      <h3 className="text-2xl font-black font-bricolage text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                        <T>{exp.title}</T>
                      </h3>
                      
                      {/* Botón fantasma al final */}
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                        <span className="text-sm font-bold text-foreground group-hover:text-secondary transition-colors">
                          <T>Ver detalles</T>
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors text-foreground">
                          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default function ExperienciasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
      <ExperienciasContent />
    </Suspense>
  );
}