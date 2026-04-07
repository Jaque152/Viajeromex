// src/app/[locale]/experiencias/[id]/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Experience, ActivityPackage } from "@/lib/types"; 
import { T } from "@/components/T";
import {
  MapPin, Check, Minus, Plus, ShoppingCart, Loader2, Clock, AlertTriangle, Info, ListChecks
} from "lucide-react";

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [packages, setPackages] = useState<ActivityPackage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState("");
  const [people, setPeople] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<ActivityPackage | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadFullDetail() {
      if (!params.id) return;
      setLoading(true);
      try {
        const { data: activity } = await supabase
          .from('activities')
          .select('*, categories(name, slug)')
          .eq('id', params.id)
          .single();

        const { data: paks } = await supabase
          .from('activity_packages')
          .select('*, service_levels(name)')
          .eq('activity_id', params.id)
          .order('level_id', { ascending: true });

        if (activity) {
          setExperience({
            id: activity.id,
            title: activity.title,
            slug: activity.slug,
            description: activity.description,
            location: activity.location,
            duration: activity.duration, 
            images: activity.images || [], 
            itinerary: activity.itinerary,
            requirements: activity.requirements,
            restrictions: activity.restrictions,
            included_general: activity.included_general,
            category_id: activity.category_id,
            categories: activity.categories
          });
        }
        
        if (paks) {
          const typedPaks = paks as unknown as ActivityPackage[];
          setPackages(typedPaks);
          setSelectedPackage(typedPaks[0]);
        }
      } catch (error) {
        console.error("Error loadFullDetail:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFullDetail();
  }, [params.id]);

  const totalPrice = useMemo(() => {
    if (!selectedPackage) return 0;
    return Number(selectedPackage.price) * people;
  }, [selectedPackage, people]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!experience || !selectedDate || !selectedPackage) return;
    setIsAdding(true);

    addToCart({
      packageId: selectedPackage.id,
      experience: experience,
      date: selectedDate,
      people: people,
      levelName: selectedPackage.service_levels?.name || "Básico",
      pricePerPerson: Number(selectedPackage.price),
    });

    setTimeout(() => {
      setIsAdding(false);
      router.push("/carrito");
    }, 500);
  };

  const minDateStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!experience) return null;

  const mainImage = experience.images?.length > 0 ? experience.images[0] : '/placeholder.jpg';
  const packageInclusions = selectedPackage?.features?.incluye || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            <div className="lg:col-span-2 space-y-10">
              <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-xl bg-stone-100">
                <img src={mainImage} alt={experience.title} className="w-full h-full object-cover" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                    <T>{experience.categories?.name || "Aventura"}</T>
                  </Badge>
                  <span className="flex items-center gap-1 text-sm text-stone-500 font-medium">
                    <MapPin className="w-4 h-4 text-orange-500" /> <T>{experience.location}</T>
                  </span>
                  {experience.duration && (
                    <span className="flex items-center gap-1 text-sm text-stone-500 font-medium ml-2">
                      <Clock className="w-4 h-4 text-orange-500" /> <T>{experience.duration}</T>
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-serif font-bold mb-4 text-stone-900"><T>{experience.title}</T></h1>
                <p className="text-lg text-stone-600 leading-relaxed"><T>{experience.description}</T></p>
              </div>

              {experience.itinerary && experience.itinerary.length > 0 && (
                <div className="pt-8 border-t border-stone-100">
                  <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                    <ListChecks className="text-orange-600" /> <T>Itinerario</T>
                  </h2>
                  <ol className="relative border-l border-stone-200 ml-3 space-y-6">
                    {experience.itinerary.map((step, index) => (
                      <li key={index} className="ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white">
                          <span className="text-xs font-bold text-orange-800">{index + 1}</span>
                        </span>
                        <h3 className="font-medium text-stone-800 pt-0.5"><T>{step}</T></h3>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-stone-100">
                {experience.requirements && experience.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2 text-stone-800">
                      <Info className="w-5 h-5 text-blue-500" /> <T>Qué llevar / Requisitos</T>
                    </h3>
                    <ul className="space-y-2">
                      {experience.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-stone-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                          <T>{req}</T>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {experience.restrictions && experience.restrictions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2 text-stone-800">
                      <AlertTriangle className="w-5 h-5 text-red-500" /> <T>Restricciones</T>
                    </h3>
                    <ul className="space-y-2">
                      {experience.restrictions.map((res, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-stone-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                          <T>{res}</T>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {experience.included_general && experience.included_general.length > 0 && (
                <div className="pt-8 border-t border-stone-100">
                  <h2 className="text-2xl font-serif font-bold mb-6"><T>Lo que incluye en general</T></h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {experience.included_general.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-stone-50 border border-stone-100">
                        <Check className="w-5 h-5 text-stone-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-stone-700"><T>{item}</T></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-stone-100">
                <h2 className="text-2xl font-serif font-bold mb-6">
                  <T>Adicionales del nivel</T> <span className="text-orange-600"><T>{selectedPackage?.service_levels?.name || "Básico"}</T></span>
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {packageInclusions.length > 0 ? (
                    packageInclusions.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-orange-50/50 border border-orange-100 transition-all">
                        <Check className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-stone-800 font-medium"><T>{item}</T></span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-stone-500 italic bg-stone-50 p-4 rounded-xl border border-stone-100">
                      <T>Este nivel base te da acceso al tour general. Selecciona un nivel superior para ver más beneficios.</T>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <Card className="border-none shadow-2xl bg-stone-50/50 rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-baseline gap-1 mb-6 flex-wrap">
                      <span className="text-4xl font-black text-orange-700">
                        {formatPrice(totalPrice)}
                      </span>
                      <span className="text-xs text-stone-400 font-bold uppercase tracking-widest ml-1"><T>IVA incluido</T></span>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-500 tracking-widest"><T>Fecha</T></label>
                        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={minDateStr} className="rounded-xl h-12 bg-white font-medium" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-stone-500 tracking-widest"><T>Personas</T></label>
                        <div className="flex items-center justify-between bg-white p-1 rounded-xl border h-12 shadow-sm">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-stone-100" onClick={() => setPeople(Math.max(1, people - 1))}><Minus className="w-4 h-4"/></Button>
                          <span className="font-bold text-lg">{people}</span>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-stone-100" onClick={() => setPeople(people + 1)}><Plus className="w-4 h-4"/></Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-stone-500 tracking-widest flex items-center justify-between">
                          <T>Nivel de Paquete</T>
                          <span className="text-orange-500 font-normal capitalize"><T>Selecciona uno</T></span>
                        </label>
                        {packages.map((pkg) => (
                          <div 
                            key={pkg.id}
                            onClick={() => setSelectedPackage(pkg)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group ${
                              selectedPackage?.id === pkg.id 
                                ? "border-orange-500 bg-white shadow-md ring-2 ring-orange-500/20" 
                                : "border-stone-200 bg-white/60 hover:border-orange-300"
                            }`}
                          >
                            <span className="font-bold text-sm text-stone-800"><T>{pkg.service_levels?.name || "Básico"}</T></span>
                            <span className="text-right">
                              <span className="text-xs font-black text-orange-600 block">{formatPrice(Number(pkg.price))}</span>
                              <span className="font-normal text-stone-400 text-[9px] uppercase tracking-wider block"><T>x persona</T></span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-full h-14 mt-8 shadow-xl shadow-orange-600/20 gap-2 font-bold text-lg transition-all active:scale-[0.98]"
                      onClick={handleAddToCart}
                      disabled={!selectedDate || isAdding}
                    >
                      {isAdding ? <Loader2 className="animate-spin w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />} 
                      {isAdding ? <T>Procesando...</T> : <T>Agregar al carrito</T>}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}