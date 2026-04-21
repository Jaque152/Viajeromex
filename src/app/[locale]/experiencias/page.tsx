"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { MapPin, Search, ArrowRight, Loader2, Compass } from "lucide-react";
import { Experience, SupabaseExperienceResponse } from "@/lib/types";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";

type ExperienceWithPrice = Experience & { displayPrice: number };

function ExperienciasContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("categoria");
  const locale = useLocale();
  const [experiences, setExperiences] = useState<ExperienceWithPrice[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchTerm, setSearchTerm] = useState("");
  const phSearch = useT("Buscar experiencias...");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: catData } = await supabase.from('categories_explonix').select('*');
        if (catData) setCategories(catData);

        const { data: actData, error: actError } = await supabase
          .from('activities_explonix')
          .select(`
            id, title, slug, description, location, images, category_id,
            categories:categories_explonix (id, name, slug),
            activity_packages:activity_packages_explonix (price)
          `);

        if (actData) {
          const mappedData: ExperienceWithPrice[] = (actData as unknown as SupabaseExperienceResponse[]).map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description || "",
            location: item.location,
            images: item.images || [], 
            category_id: item.category_id,
            categories: item.categories || undefined,
            displayPrice: item.activity_packages?.[0]?.price || 0
          }));
          setExperiences(mappedData);
        }
      } catch (error) {
        console.error("Error fetchData:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const filteredExperiences = experiences.filter((exp) => {
    const matchesCategory = !selectedCategory || exp.categories?.slug === selectedCategory;
    const matchesSearch = !searchTerm ||
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    });
    return `${formatter.format(price)} MXN`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        
        {/* Cabecera Digital Ocean */}
        <section className="bg-slate-900 pt-24 pb-32 relative overflow-hidden rounded-b-[3rem] mx-2 lg:mx-4 mt-4">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-white"><T>Catálogo Explonix</T></span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
              <T>Descubre</T> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary"><T>aventuras únicas</T></span>
            </h1>
          </div>
        </section>

        {/* Barra de Filtros Flotante (Glassmorphism) */}
        <section className="sticky top-28 z-40 -mt-12 mb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="glass-panel p-4 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col lg:flex-row gap-6 items-center justify-between">
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 w-full lg:w-auto">
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-full h-12 px-6 font-bold transition-all ${!selectedCategory ? 'bg-slate-900 text-white hover:bg-primary' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-900'}`}
                >
                  <T>Todas</T>
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.slug ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`rounded-full h-12 px-6 font-bold transition-all ${selectedCategory === cat.slug ? 'bg-slate-900 text-white hover:bg-primary' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-900'}`}
                  >
                    <T>{cat.name}</T>
                  </Button>
                ))}
              </div>

              <div className="relative w-full lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder={phSearch}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 rounded-full bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary font-medium text-slate-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Grid de Experiencias */}
        <section className="pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            {filteredExperiences.length === 0 ? (
              <div className="text-center py-20">
                <Compass className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-slate-900 mb-2"><T>No encontramos experiencias</T></h3>
                <p className="text-slate-500 font-medium"><T>Intenta con otros filtros o términos de búsqueda.</T></p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {filteredExperiences.map((exp) => {
                  const thumbImage = exp.images?.length > 0 ? exp.images[0] : '/placeholder.jpg';

                  return (
                    <Link key={exp.id} href={`/${locale}/experiencias/${exp.id}`} className="group block h-full">
                      <div className="bg-white rounded-[2.5rem] h-full overflow-hidden border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.15)] transition-all duration-500 hover:-translate-y-2 flex flex-col">
                        
                        <div className="aspect-[4/3] relative overflow-hidden m-2 rounded-[2rem]">
                          <img src={thumbImage} alt={exp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide text-primary shadow-sm">
                            <T>{exp.categories?.name || "Sin Categoría"}</T>
                          </div>
                        </div>
                        
                        <div className="p-8 flex-1 flex flex-col">
                          <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-3 group-hover:text-primary transition-colors"><T>{exp.title}</T></h3>
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-6">
                            <MapPin className="w-4 h-4 text-cyan-500" /> <T>{exp.location}</T>
                          </div>
                          
                          <div className="flex items-end justify-between mt-auto pt-6 border-t border-slate-100">
                            <div>
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1"><T>IVA incluido</T></p>
                              <p className="text-2xl font-black text-slate-900">
                                {formatPrice(exp.displayPrice)}
                              </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </div>

                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function ExperienciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <ExperienciasContent />
    </Suspense>
  );
}