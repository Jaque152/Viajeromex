// src/app/[locale]/experiencias/page.tsx
"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { MapPin, Search, ArrowRight, Loader2 } from "lucide-react";
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
        const { data: catData } = await supabase.from('categories').select('*');
        if (catData) setCategories(catData);

        const { data: actData } = await supabase
          .from('activities')
          .select(`
            id, title, slug, description, location, images, category_id,
            categories (id, name, slug),
            activity_packages (price)
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
    return new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <section className="bg-stone-50 py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 border-primary/30 text-primary">
              <T>Catálogo de Experiencias</T>
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6 text-stone-900">
              <T>Descubre</T> <span className="text-orange-600"><T>aventuras únicas</T></span>
            </h1>
          </div>
        </section>

        <section className="border-b border-border bg-background sticky top-20 z-40">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full"
                ><T>Todas</T></Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.slug ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className="rounded-full"
                  ><T>{cat.name}</T></Button>
                ))}
              </div>
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={phSearch}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((exp) => {
                const thumbImage = exp.images?.length > 0 ? exp.images[0] : '/placeholder.jpg';

                return (
                  <Link key={exp.id} href={`/${locale}/experiencias/${exp.id}`} className="group">
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all border-none shadow-sm rounded-2xl">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img src={thumbImage} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <Badge className="absolute top-4 left-4 bg-background/90 text-foreground border-none">
                          <T>{exp.categories?.name || "Sin Categoría"}</T>
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-lg font-serif font-semibold mb-2"><T>{exp.title}</T></h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                          <MapPin className="w-4 h-4" /> <T>{exp.location}</T>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold"><T>Desde</T></p>
                            <p className="text-lg font-bold text-orange-600">
                              {formatPrice(exp.displayPrice)}
                            </p>
                            <span className="text-xs font-normal text-stone-500"><T>IVA incluido</T></span>
                          </div>
                          <span className="flex items-center gap-1 text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
                            <T>Ver detalles</T> <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    }>
      <ExperienciasContent />
    </Suspense>
  );
}