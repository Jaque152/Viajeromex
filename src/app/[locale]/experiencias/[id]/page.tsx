"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Experience, ActivityPackage } from "@/lib/types"; 
import { T } from "@/components/T";
import {
  Check, Minus, Plus, Loader2, Info, AlertTriangle, X, MapPin, Clock, CalendarDays, Compass
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
  const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");
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
          .select('*')
          .eq('activity_id', params.id)
          .order('id', { ascending: true });

        if (activity) {
          setExperience(activity);
        }
        
        if (paks && paks.length > 0) {
          setPackages(paks);
          setSelectedPackageId(paks[0].id);
        }
      } catch (error) {
        console.error("Error loadFullDetail:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFullDetail();
  }, [params.id]);

  const selectedPackage = packages.find(p => p.id === selectedPackageId);
  
  const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    });
    return `${formatter.format(price)} MXN`;
  };

  const handleAddToCart = () => {
    if (!experience || !selectedDate || !selectedPackage) return;
    setIsAdding(true);

    addToCart({
      packageId: selectedPackage.id,
      experience: experience,
      date: selectedDate,
      people: people,
      levelName: selectedPackage.package_name,
      pricePerPerson: Number(selectedPackage.price),
    });

    setTimeout(() => {
      setIsAdding(false);
      router.push("/carrito");
    }, 500);
  };

  const minDateStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!experience) return null;

  const mainImage = experience.images?.length > 0 ? experience.images[0] : '/placeholder.jpg';

  const WidgetForm = () => (
    <Card className="border-border shadow-xl rounded-2xl overflow-hidden bg-card">
      <div className="bg-muted p-5 border-b border-border">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-widest text-center">
          <T>Reserva tu lugar</T>
        </h2>
      </div>
      
      <CardContent className="p-6 md:p-8">
        
        {/* Selector Dinámico de Opción */}
        <div className="mb-6 space-y-3">
          <label className="text-sm font-bold text-foreground block uppercase tracking-wider"><T>Elige una opción</T></label>
          <select 
            className="w-full h-12 px-4 bg-background border border-border text-foreground font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
            value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(Number(e.target.value))}
          >
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>{pkg.package_name}</option>
            ))}
          </select>
        </div>

        {selectedPackage && (
          <div className="mb-8 animate-in fade-in">
            <div className="flex flex-col mb-6 pb-4 border-b border-border">
              <span className="font-bold text-lg text-foreground mb-1"><T>{selectedPackage.package_name}</T></span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-medium text-primary tracking-tight">{formatPrice(selectedPackage.price)}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest"><T>IVA incluido</T></span>
              </div>
            </div>
            
            {selectedPackage.features?.incluye && (
              <div className="mb-4">
                <p className="text-xs font-bold uppercase text-foreground mb-3 tracking-widest"><T>Esta opción incluye:</T></p>
                <ul className="space-y-2">
                  {selectedPackage.features.incluye.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-snug">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5"/> <T>{inc}</T>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedPackage.features?.no_incluye && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs font-bold uppercase text-foreground mb-3 tracking-widest"><T>No Incluye:</T></p>
                <ul className="space-y-2">
                  {selectedPackage.features.no_incluye.map((noInc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground/80 leading-snug">
                      <X className="w-4 h-4 text-destructive shrink-0 mt-0.5"/> <T>{noInc}</T>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground block uppercase tracking-wider"><T>Fecha de salida:</T></label>
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              min={minDateStr} 
              className="rounded-xl h-12 bg-background font-medium focus-visible:ring-primary text-foreground border-border" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground block uppercase tracking-wider"><T>Viajeros:</T></label>
            <div className="flex items-center justify-between border border-border rounded-xl h-12 bg-background overflow-hidden">
              <Button variant="ghost" className="h-full px-6 rounded-none hover:bg-muted text-foreground" onClick={() => setPeople(Math.max(1, people - 1))}><Minus className="w-4 h-4"/></Button>
              <span className="flex-1 text-center font-bold text-lg text-foreground">{people}</span>
              <Button variant="ghost" className="h-full px-6 rounded-none hover:bg-muted text-foreground" onClick={() => setPeople(people + 1)}><Plus className="w-4 h-4"/></Button>
            </div>
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-xl shadow-md uppercase tracking-widest text-sm transition-all mt-4"
            onClick={handleAddToCart}
            disabled={!selectedDate || isAdding}
          >
            {isAdding ? <Loader2 className="animate-spin w-5 h-5 mr-2 inline" /> : null}
            {isAdding ? <T>Añadiendo...</T> : <T>Añadir al carrito</T>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Layout Mobile: Título aparece arriba de la imagen */}
          <div className="lg:hidden mb-6">
             <h1 className="text-3xl font-serif font-bold text-foreground leading-tight mb-4">
              <T>{experience.title}</T>
             </h1>
             <div className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest uppercase text-muted-foreground">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> <T>{experience.location}</T></div>
                {experience.duration && (
                  <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> <T>{experience.duration}</T></div>
                )}
             </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* COLUMNA IZQUIERDA: Imagen y Detalles */}
            <div className="lg:col-span-7 space-y-12 w-full">
              
              <div className="w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-border">
                <img src={mainImage} alt={experience.title} className="w-full h-full object-cover" />
              </div>

              {/* Layout Mobile: Widget debajo de la imagen */}
              <div className="lg:hidden w-full">
                 <WidgetForm />
              </div>

              {/* Qué harás (Siempre visible) */}
              {experience.what_you_will_do && experience.what_you_will_do.length > 0 && (
                <section>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
                    <Compass className="w-6 h-6 text-primary" /> <T>Qué harás</T>
                  </h2>
                  <ul className="space-y-4">
                    {experience.what_you_will_do.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <span className="text-muted-foreground leading-relaxed text-lg"><T>{item}</T></span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Descripción */}
              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6"><T>Descripción general</T></h2>
                <div className="text-muted-foreground leading-relaxed space-y-4 whitespace-pre-wrap text-lg">
                  <T>{experience.description}</T>
                </div>
              </section>

              {/* Itinerario (Solo si existe y tiene contenido) */}
              {experience.itinerary && experience.itinerary.length > 0 && (
                <section className="bg-card border border-border p-8 rounded-2xl shadow-sm">
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-8 flex items-center gap-3">
                    <CalendarDays className="w-6 h-6 text-primary" /> <T>Itinerario de la experiencia</T>
                  </h2>
                  <div className="relative border-l-2 border-primary/20 ml-3 space-y-8">
                    {experience.itinerary.map((step, i) => (
                      <div key={i} className="relative pl-8">
                        <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1.5 ring-4 ring-card"></div>
                        <p className="text-foreground font-medium leading-relaxed"><T>{step}</T></p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Qué Llevar */}
              {experience.requirements && experience.requirements.length > 0 && (
                <section>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
                    <Info className="w-6 h-6 text-primary"/> <T>¿Qué llevar?</T>
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {experience.requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-3 bg-secondary/20 p-4 rounded-xl border border-border">
                        <Check className="w-4 h-4 text-primary shrink-0"/>
                        <span className="text-sm text-foreground font-medium"><T>{req}</T></span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Información Importante Clasificada */}
              {experience.important_info && Object.keys(experience.important_info).length > 0 && (
                 <section className="bg-secondary/10 p-6 md:p-8 rounded-2xl border border-border">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-8 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-primary"/> <T>Información Importante</T>
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-8">
                      {Object.entries(experience.important_info).map(([category, items], idx) => (
                        <div key={idx}>
                          <h3 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm"><T>{category}</T></h3>
                          <ul className="space-y-3 text-muted-foreground text-sm">
                            {(items as string[]).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 leading-relaxed">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                                <span><T>{item}</T></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                 </section>
              )}

            </div>

            {/* COLUMNA DERECHA: Título (Web) + Widget Sticky */}
            <div className="hidden lg:flex lg:col-span-5 flex-col space-y-6 sticky top-28">
              
              <div>
                <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4 leading-tight">
                  <T>{experience.title}</T>
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> <T>{experience.location}</T></div>
                  {experience.duration && (
                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> <T>{experience.duration}</T></div>
                  )}
                </div>
              </div>

              <WidgetForm />
              
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}