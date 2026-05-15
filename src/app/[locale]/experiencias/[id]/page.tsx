"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from 'next-intl';
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from '@/lib/supabase';
import { Loader2, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
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
      const { data } = await supabase
        .from('activities_mextripia')
        .select(`
          *,
          categories:categories_mextripia(name, slug),
          packages:activity_packages_mextripia(*)
        `)
        .eq('id', params.id)
        .single();

      if (data) {
        // Ordenamos los paquetes por min_pax para asegurar la lógica correcta
        if (data.packages) {
          data.packages.sort((a: any, b: any) => a.min_pax - b.min_pax);
        }
        setExperience(data);
      }
      setLoading(false);
    }
    fetchDetail();
  }, [params.id]);

  // LÓGICA CORE: Asignación dinámica de precio según el número de personas
  useEffect(() => {
    if (experience?.packages && experience.packages.length > 0) {
      // Encontrar el paquete que coincida con el número de PAX actual
      const matchedPackage = experience.packages.find((pkg: any) => {
        const max = pkg.max_pax || 999; // Si no hay máximo en la BD, asumimos infinito
        return pax >= pkg.min_pax && pax <= max;
      });

      if (matchedPackage) {
        setSelectedPackage(matchedPackage);
      } else {
        // Si por alguna razón excede todos los límites, asignamos el último paquete (mayor descuento)
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!experience) return <div className="min-h-screen flex items-center justify-center bg-background"><T>Experiencia no encontrada</T></div>;

  const mainImage = experience.images?.[0] || '/placeholder.jpg';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Título Principal */}
          <div className="mb-10 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight mb-4">
              <T>{experience.title}</T>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Columna Izquierda: Imagen y Detalles Textuales */}
            <div className="w-full lg:w-7/12 animate-fade-in-up delay-150">
              
              <div className="relative aspect-[4/3] w-full mb-10 bg-muted/20">
                <Image src={mainImage} alt={experience.title} fill className="object-cover" priority />
              </div>

              <div className="prose prose-stone max-w-none text-muted-foreground font-light leading-relaxed mb-10">
                <p className="text-lg text-foreground font-medium mb-8"><T>{experience.description}</T></p>
                
                <h3 className="text-2xl font-serif text-foreground mb-4"><T>Incluye:</T></h3>
                <ul className="space-y-2 mb-8 list-disc pl-5">
                  {experience.included_general?.map((item: string, i: number) => (
                    <li key={i}><T>{item}</T></li>
                  ))}
                </ul>

                <div className="bg-white p-6 border border-border mt-8 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-secondary" />
                    <strong><T>Duración:</T></strong> <T>{experience.duration}</T>
                  </div>
                  {experience.important_info?.["Horario de inicio"] && (
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-5 h-5 text-secondary" />
                      <strong><T>Horario de inicio:</T></strong> <T>{experience.important_info["Horario de inicio"][0]}</T>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-secondary" />
                    <strong><T>Punto de encuentro:</T></strong> <T>{experience.location}</T>
                  </div>
                </div>

                {/* Notas */}
                {experience.important_info?.Notas && (
                  <div className="mt-8 text-xs italic text-muted-foreground">
                    {experience.important_info.Notas.map((nota: string, i: number) => (
                      <p key={i} className="mb-1 text-primary">* <T>{nota}</T></p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha: Tabla de Precios y Reserva */}
            <div className="w-full lg:w-5/12 sticky top-32 animate-fade-in-up delay-300">
              
              <div className="bg-white p-8 border border-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                <h3 className="text-2xl font-serif text-foreground mb-6"><T>Tabla de precios</T></h3>
                
                {/* Tabla Dinámica */}
                <div className="mb-8">
                  <div className="grid grid-cols-2 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border pb-3 mb-3">
                    <div><T>Personas</T></div>
                    <div className="text-right"><T>Precio pp (IVA Inc)</T></div>
                  </div>
                  
                  <div className="space-y-2">
                    {experience.packages?.map((pkg: any) => (
                      <div 
                        key={pkg.id} 
                        onClick={() => setPax(pkg.min_pax)} // Al hacer click, auto-ajusta el número de personas al mínimo del nivel
                        className={`grid grid-cols-2 text-sm p-3 cursor-pointer transition-colors border-l-2 ${selectedPackage?.id === pkg.id ? 'bg-foreground text-background font-medium border-primary' : 'hover:bg-muted/30 text-foreground border-transparent'}`}
                        title="Haz clic para seleccionar este volumen de asistentes"
                      >
                        <div><T>{pkg.package_name}</T></div>
                        <div className="text-right">
                          {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(pkg.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controles de Reserva */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2"><T>Fecha de reservación</T></h4>
                    <div className="flex items-center border-b border-border py-2 focus-within:border-primary transition-colors">
                      <CalendarIcon className="w-4 h-4 text-primary mr-3" />
                      <input 
                        type="date" 
                        className="w-full bg-transparent outline-none text-sm text-foreground font-medium"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  <div className="flex gap-6 items-end">
                    <div className="w-1/3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2"><T>Asistentes</T></h4>
                      <input 
                        type="number" 
                        min={1} 
                        value={pax} 
                        onChange={(e) => setPax(parseInt(e.target.value) || 1)}
                        className="w-full border-b border-border bg-transparent py-2 text-center text-lg font-medium outline-none focus:border-primary transition-colors" 
                      />
                    </div>
                    
                    <button 
                      onClick={handleAddToCart}
                      disabled={!selectedDate}
                      className="flex-1 bg-transparent border border-foreground text-foreground h-[45px] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <T>Añadir a la bolsa</T>
                    </button>
                  </div>
                  
                  {selectedPackage && (
                     <div className="pt-4 mt-4 border-t border-border flex justify-between items-center text-sm font-medium">
                        <span className="text-muted-foreground"><T>Total estimado:</T></span>
                        <span className="text-lg text-primary">{new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(selectedPackage.price * pax)}</span>
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