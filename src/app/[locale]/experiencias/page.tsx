"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from '@/lib/supabase';
import { Loader2 } from "lucide-react";
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
        // Obtenemos los datos corrigiendo los guiones bajos en las relaciones
        const { data: actData, error } = await supabase
          .from('activities_mextripia')
          .select(`
            id, title, slug, description, location, images, category_id,
            categories:categories_mextripia(id, name, slug),
            activity_packages:activity_packages_mextripia(price)
          `);

        if (error) {
          console.error("Error de Supabase:", error);
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
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 }).format(price);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        
        {/* Encabezado Editorial */}
        <div className="container mx-auto px-6 max-w-7xl mb-20 text-center animate-fade-in-up">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-secondary mb-4 block"><T>Colección Exclusiva</T></span>
          <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight"><T>Expediciones Culinarias</T></h1>
        </div>

        {/* Grid Estilo Galería Minimalista */}
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {experiences.map((exp, idx) => {
              const thumbImage = exp.images?.length > 0 ? exp.images[0] : '/placeholder.jpg';

              return (
                <Link key={exp.id} href={`/${locale}/experiencias/${exp.id}`} className="group block animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  {/* Imagen sin bordes redondeados forzados, limpia */}
                  <div className="relative aspect-square overflow-hidden mb-6 bg-muted/30">
                    <Image 
                      src={thumbImage} 
                      alt={exp.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                    />
                  </div>
                  
                  {/* Detalles minimalistas */}
                  <h3 className="text-xl font-serif text-foreground mb-2 group-hover:text-primary transition-colors leading-snug"><T>{exp.title}</T></h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px]"><T>{exp.location}</T></span>
                    <span className="font-medium text-foreground">{formatPrice(exp.displayPrice)} <span className="text-[10px] text-muted-foreground font-normal uppercase">IVA Inc</span></span>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ExperienciasContent />
    </Suspense>
  );
}