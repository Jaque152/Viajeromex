"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from 'next-intl';
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from '@/lib/supabase';
import { Loader2, Calendar as CalendarIcon, MapPin, Clock, Utensils, CheckCircle2 } from "lucide-react";
import { T } from "@/components/T";
import { useCart } from "@/context/CartContext";

export default function ExperienceDetail() {
  const params = useParams();
  const locale = useLocale();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para reserva
  const [selectedDate, setSelectedDate] = useState("");
  const [pax, setPax] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  useEffect(() => {
    async function fetchDetail() {
      const { data, error } = await supabase
        .from('activities_vm')
        .select(`
          *,
          categories:categories_vm(name, slug),
          packages:activity_packages_vm(*)
        `)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error("Error de Supabase (Detalle):", JSON.stringify(error));
      }

      if (data) {
        if (data.packages) {
          data.packages.sort((a: any, b: any) => a.min_pax - b.min_pax);
        }
        setExperience(data);
      }
      setLoading(false);
    }
    fetchDetail();
  }, [params.id]);

  // LÓGICA CORE INTACTA
  useEffect(() => {
    if (experience?.packages && experience.packages.length > 0) {
      const matchedPackage = experience.packages.find((pkg: any) => {
        const max = pkg.max_pax || 999;
        return pax >= pkg.min_pax && pax <= max;
      });

      if (matchedPackage) {
        setSelectedPackage(matchedPackage);
      } else {
        setSelectedPackage(experience.packages[experience.packages.length - 1]);
      }
    }
  }, [pax, experience]);

  const handleAddToCart = () => {
    if (!selectedDate || !selectedPackage) return;
    const cartItem = {
      packageId: selectedPackage.id,
      experience: experience,
      levelName: selectedPackage.package_name,
      date: selectedDate,
      people: pax,
      pricePerPerson: selectedPackage.price,
      totalPrice: selectedPackage.price * pax
    };
    addToCart(cartItem);
    router.push(`/${locale}/carrito`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-12 h-12 animate-spin text-primary" strokeWidth={3} /></div>;
  if (!experience) return <div className="min-h-screen flex items-center justify-center bg-background"><T>Experiencia no encontrada</T></div>;

  const mainImage = experience.images?.[0] || '/placeholder.jpg';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-32 pb-24 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="mb-8 animate-bounce-up">
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-black font-bricolage text-foreground leading-tight mb-4 tracking-tight">
              <T>{experience.title}</T>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* Columna Izquierda: Info de la Experiencia */}
            <div className="w-full lg:w-7/12 animate-bounce-up delay-100">
              
              <div className="relative aspect-[4/3] w-full rounded-[3rem] overflow-hidden mb-10 shadow-2xl shadow-primary/10 border-4 border-white">
                <Image src={mainImage} alt={experience.title} fill className="object-cover" priority />
              </div>

              <div className="prose prose-lg max-w-none text-muted-foreground font-medium mb-10">
                <p className="text-xl text-foreground font-bold mb-10 leading-relaxed"><T>{experience.description}</T></p>
                
                <h3 className="text-2xl font-black font-bricolage text-foreground mb-6 flex items-center gap-3">
                  <div className="p-2 bg-accent/20 rounded-xl"><Utensils className="w-6 h-6 text-accent" strokeWidth={2.5} /></div>
                  <T>El Menú (Incluye)</T>
                </h3>
                <ul className="space-y-4 mb-10 list-none pl-0">
                  {experience.included_general?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                      <span className="text-foreground"><T>{item}</T></span>
                    </li>
                  ))}
                </ul>

                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-8 flex flex-col gap-5">
                  <div className="flex items-center gap-4 text-foreground font-bold">
                    <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center"><Clock className="w-5 h-5 text-primary" strokeWidth={2.5}/></div>
                    <div>
                      <span className="block text-xs uppercase tracking-widest text-muted-foreground"><T>Duración</T></span>
                      <T>{experience.duration}</T>
                    </div>
                  </div>
                  {experience.important_info?.["Horario de inicio"] && (
                    <div className="flex items-center gap-4 text-foreground font-bold">
                      <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center"><Clock className="w-5 h-5 text-primary" strokeWidth={2.5}/></div>
                      <div>
                        <span className="block text-xs uppercase tracking-widest text-muted-foreground"><T>Iniciamos a las</T></span>
                        <T>{experience.important_info["Horario de inicio"][0]}</T>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-foreground font-bold">
                    <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" strokeWidth={2.5}/></div>
                    <div>
                      <span className="block text-xs uppercase tracking-widest text-muted-foreground"><T>Punto de Encuentro</T></span>
                      <T>{experience.location}</T>
                    </div>
                  </div>
                </div>

                {experience.important_info?.Notas && (
                  <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/20">
                    <p className="font-bold text-primary text-sm uppercase tracking-widest mb-2"><T>A tomar en cuenta</T></p>
                    {experience.important_info.Notas.map((nota: string, i: number) => (
                      <p key={i} className="mb-2 text-sm text-foreground/80 font-medium flex gap-2"><span className="text-primary">•</span> <T>{nota}</T></p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha: Módulo de Reserva Juguetón */}
            <div className="w-full lg:w-5/12 sticky top-32 animate-bounce-up delay-200">
              
              <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100">
                <h3 className="text-3xl font-black font-bricolage text-foreground mb-8 tracking-tight"><T>Reserva tu lugar</T></h3>
                
                {/* Tabla de Precios convertida en "Opciones de Volumen" */}
                <div className="mb-10">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 block"><T>Inversión por paladar</T></label>
                  <div className="space-y-3">
                    {experience.packages?.map((pkg: any) => (
                      <div 
                        key={pkg.id} 
                        onClick={() => setPax(pkg.min_pax)} 
                        className={`flex justify-between items-center p-4 rounded-2xl cursor-pointer transition-all border-2 ${selectedPackage?.id === pkg.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                      >
                        <div className="font-bold text-foreground"><T>{pkg.package_name}</T></div>
                        <div className={`font-black text-lg ${selectedPackage?.id === pkg.id ? 'text-primary' : 'text-foreground'}`}>
                          {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits:0 }).format(pkg.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controles de Reserva */}
                <div className="space-y-8">
                  
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block"><T>¿Cuándo nos vemos?</T></label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-5 h-16 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                      <CalendarIcon className="w-6 h-6 text-primary mr-3" />
                      <input 
                        type="date" 
                        className="w-full bg-transparent outline-none text-foreground font-bold text-lg"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  <div className="flex gap-6 items-end">
                    <div className="w-1/3">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block"><T>Comensales</T></label>
                      <input 
                        type="number" 
                        min={1} 
                        value={pax} 
                        onChange={(e) => setPax(parseInt(e.target.value) || 1)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl text-center text-2xl font-black h-16 outline-none focus:ring-2 focus:ring-primary transition-all text-foreground" 
                      />
                    </div>
                    
                    <button 
                      onClick={handleAddToCart}
                      disabled={!selectedDate}
                      className="btn-3d flex-1 bg-primary text-white h-16 rounded-2xl font-black text-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <T>Añadir</T>
                    </button>
                  </div>
                  
                  {selectedPackage && (
                     <div className="bg-slate-900 p-6 rounded-[2rem] flex justify-between items-center text-white mt-8 shadow-xl shadow-slate-900/20">
                        <span className="font-bold uppercase tracking-widest text-xs opacity-80"><T>Total estimado</T></span>
                        <span className="text-3xl font-black font-bricolage text-accent">
                          {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(selectedPackage.price * pax)}
                        </span>
                     </div>
                  )}

                </div>
              </div>
              
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}