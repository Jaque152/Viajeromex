"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Experience, ActivityPackage } from "@/lib/types"; 
import { T } from "@/components/T";
import {
  Check, Minus, Plus, Loader2, Info, AlertTriangle, X, MapPin, Clock, CalendarDays, Compass, Zap
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
          .from('activities_explonix')
          .select('*, categories:categories_explonix(name, slug)')
          .eq('id', params.id)
          .single();

        const { data: paks } = await supabase
          .from('activity_packages_explonix')
          .select('*')
          .eq('activity_id', params.id)
          .order('id', { ascending: true });

        if (activity) setExperience(activity);
        
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
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );

  if (!experience) return null;

  const mainImage = experience.images?.length > 0 ? experience.images[0] : '/placeholder.jpg';

  const WidgetForm = () => (
    <div className="bg-white border border-slate-100 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center gap-3">
        <Zap className="w-5 h-5 text-cyan-500" />
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
          <T>Reserva tu lugar</T>
        </h2>
      </div>
      
      <div className="p-8">
        {/* Selector Dinámico */}
        <div className="mb-8 space-y-3">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"><T>Elige una opción</T></label>
          <select 
            className="w-full h-14 px-5 bg-slate-50 border-none text-slate-900 font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer appearance-none"
            value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(Number(e.target.value))}
          >
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>{pkg.package_name}</option>
            ))}
          </select>
        </div>

        {selectedPackage && (
          <div className="mb-10 animate-fade-in">
            <div className="flex flex-col mb-6 pb-6 border-b border-slate-100">
              <span className="font-black text-xl text-slate-900 mb-2"><T>{selectedPackage.package_name}</T></span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-primary tracking-tighter">{formatPrice(selectedPackage.price)}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest"><T>IVA incl.</T></span>
              </div>
            </div>
            
            {selectedPackage.features?.incluye && (
              <div className="mb-6">
                <p className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest"><T>Esta opción incluye:</T></p>
                <ul className="space-y-3">
                  {selectedPackage.features.incluye.map((inc, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700 leading-snug">
                      <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-cyan-600"/> 
                      </div>
                      <T>{inc}</T>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedPackage.features?.no_incluye && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest"><T>No Incluye:</T></p>
                <ul className="space-y-3">
                  {selectedPackage.features.no_incluye.map((noInc, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-500 leading-snug opacity-80">
                      <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-red-400"/>
                      </div>
                      <T>{noInc}</T>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"><T>Fecha:</T></label>
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                min={minDateStr} 
                className="rounded-xl h-14 bg-slate-50 font-bold text-slate-700 border-none focus-visible:ring-primary px-4" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"><T>Viajeros:</T></label>
              <div className="flex items-center justify-between rounded-xl h-14 bg-slate-50 overflow-hidden">
                <button className="h-full w-12 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors" onClick={() => setPeople(Math.max(1, people - 1))}><Minus className="w-4 h-4"/></button>
                <span className="flex-1 text-center font-black text-lg text-slate-900">{people}</span>
                <button className="h-full w-12 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors" onClick={() => setPeople(people + 1)}><Plus className="w-4 h-4"/></button>
              </div>
            </div>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90 text-white font-black h-16 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.3)] uppercase tracking-widest text-sm transition-all mt-6"
            onClick={handleAddToCart}
            disabled={!selectedDate || isAdding}
          >
            {isAdding ? <Loader2 className="animate-spin w-5 h-5 mr-3 inline" /> : null}
            {isAdding ? <T>Añadiendo...</T> : <T>Añadir al carrito</T>}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Layout Mobile: Título aparece arriba */}
          <div className="lg:hidden mb-8">
             <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
              <T>{experience.title}</T>
             </h1>
             <div className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest uppercase text-slate-400">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><MapPin className="w-4 h-4 text-cyan-500" /> <T>{experience.location}</T></div>
                {experience.duration && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><Clock className="w-4 h-4 text-cyan-500" /> <T>{experience.duration}</T></div>
                )}
             </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* COLUMNA IZQUIERDA: Imagen y Detalles */}
            <div className="lg:col-span-7 space-y-16 w-full">
              
              <div className="w-full aspect-[4/3] md:aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                <img src={mainImage} alt={experience.title} className="w-full h-full object-cover" />
              </div>

              {/* Layout Mobile: Widget debajo de la imagen */}
              <div className="lg:hidden w-full">
                 <WidgetForm />
              </div>

              {/* Qué harás */}
              {experience.what_you_will_do && experience.what_you_will_do.length > 0 && (
                <section>
                  <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl"><Compass className="w-6 h-6 text-primary" /></div>
                    <T>Qué harás</T>
                  </h2>
                  <ul className="space-y-5">
                    {experience.what_you_will_do.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                        <span className="text-slate-600 font-medium leading-relaxed text-lg"><T>{item}</T></span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Descripción */}
              <section>
                <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight"><T>Descripción general</T></h2>
                <div className="text-slate-600 font-medium leading-relaxed space-y-6 whitespace-pre-wrap text-lg">
                  <T>{experience.description}</T>
                </div>
              </section>

              {/* Itinerario */}
              {experience.itinerary && experience.itinerary.length > 0 && (
                <section className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100">
                  <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-xl"><CalendarDays className="w-6 h-6 text-cyan-600" /></div>
                    <T>Itinerario de la experiencia</T>
                  </h2>
                  <div className="relative border-l-2 border-dashed border-primary/30 ml-4 space-y-10">
                    {experience.itinerary.map((step, i) => (
                      <div key={i} className="relative pl-10">
                        <div className="absolute w-5 h-5 bg-primary rounded-full -left-[11px] top-1 ring-8 ring-slate-50 shadow-sm"></div>
                        <p className="text-slate-700 font-bold text-lg leading-relaxed"><T>{step}</T></p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Qué Llevar */}
              {experience.requirements && experience.requirements.length > 0 && (
                <section>
                  <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl"><Info className="w-6 h-6 text-primary"/></div>
                    <T>¿Qué llevar?</T>
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {experience.requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-cyan-600"/>
                        </div>
                        <span className="text-sm text-slate-700 font-bold"><T>{req}</T></span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Información Importante */}
              {experience.important_info && Object.keys(experience.important_info).length > 0 && (
                 <section className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl">
                    <h2 className="text-3xl font-black text-white mb-10 tracking-tight flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-xl"><AlertTriangle className="w-6 h-6 text-cyan-400"/></div>
                      <T>Información Importante</T>
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-10">
                      {Object.entries(experience.important_info).map(([category, items], idx) => (
                        <div key={idx}>
                          <h3 className="font-black text-white mb-5 uppercase tracking-widest text-sm opacity-80"><T>{category}</T></h3>
                          <ul className="space-y-4 text-slate-300 font-medium text-sm">
                            {(items as string[]).map((item, i) => (
                              <li key={i} className="flex items-start gap-3 leading-relaxed">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
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
            <div className="hidden lg:flex lg:col-span-5 flex-col space-y-8 sticky top-32">
              
              <div>
                <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-[1.1]">
                  <T>{experience.title}</T>
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest uppercase text-slate-400">
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl"><MapPin className="w-4 h-4 text-cyan-500" /> <T>{experience.location}</T></div>
                  {experience.duration && (
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl"><Clock className="w-4 h-4 text-cyan-500" /> <T>{experience.duration}</T></div>
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