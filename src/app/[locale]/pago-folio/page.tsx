"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import { useCart } from "@/context/CartContext";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function PagoFolioPage() {
  const router = useRouter();
  const locale = useLocale();
  const { addToCart } = useCart();
  
  const [monto, setMonto] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [folio, setFolio] = useState("");
  const [fecha, setFecha] = useState("");

  const btnConfirmar = useT("Añadir a la bolsa");

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, ''); 
    setMonto(val);
  };

  const isFormValid = 
    parseFloat(monto) > 0 && 
    nombre.trim().length > 0 && 
    email.includes("@") && 
    folio.trim().length > 0 && 
    fecha !== "";

  const handleConfirmarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const montoNumerico = parseFloat(monto);

    const customExperienceItem = {
      packageId: 0,
      experience: {
        id: 0,
        title: "Experiencia de Autor",
        slug: "experiencia-autor-personalizada",
        description: `Pago asociado al folio: ${folio}`,
        location: "Destino Personalizado",
        images: ["https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070"],
        category_id: 0
      },
      levelName: "Diseño a Medida",
      date: fecha,
      people: 1, 
      pricePerPerson: montoNumerico,
      totalPrice: montoNumerico
    };

    addToCart(customExperienceItem);
    sessionStorage.setItem("Mextripia_temp_contact", JSON.stringify({ nombre, email, folio })); 
    router.push(`/${locale}/checkout`);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const inputClass = "peer w-full bg-transparent border-b border-border py-3 text-foreground focus:border-primary outline-none transition-colors placeholder-transparent";
  const labelClass = "absolute left-0 -top-3.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary uppercase tracking-widest font-bold";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            {/* Columna Izquierda: Imagen y Copy */}
            <div className="w-full lg:w-5/12 animate-fade-in-up">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop" 
                  alt="Alta Gastronomía" 
                  fill
                  className="object-cover"
                />
              </div>
              <h1 className="text-4xl font-serif text-foreground mb-4">
                <T>Confirmación de Folio</T>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed font-light mb-6">
                <T>Procesamiento seguro para su evento diseñado a medida. Ingrese los datos proporcionados por nuestro equipo de hospitalidad para añadir su experiencia a la bolsa y proceder al pago.</T>
              </p>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-secondary">
                <ShieldCheck className="w-4 h-4" /> <T>Conexión Cifrada y Segura</T>
              </div>
            </div>

            {/* Columna Derecha: Formulario Elegante */}
            <div className="w-full lg:w-7/12 bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] animate-fade-in-up delay-150">
              
              <form onSubmit={handleConfirmarReserva} className="space-y-10">
                
                {/* Monto Destacado */}
                <div className="relative bg-background p-6 rounded-2xl border border-border focus-within:border-primary transition-colors">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-2"><T>Monto Acordado (MXN + IVA)</T></label>
                  <div className="flex items-center">
                    <span className="text-3xl font-serif text-muted-foreground mr-2">$</span>
                    <input 
                      type="text" 
                      value={monto}
                      onChange={handleMontoChange}
                      placeholder="0.00"
                      required
                      className="w-full bg-transparent border-none text-4xl font-serif text-foreground outline-none placeholder:text-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative">
                    <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className={inputClass} placeholder="Nombre" />
                    <label htmlFor="nombre" className={labelClass}><T>Titular de la Reserva</T></label>
                  </div>
                  <div className="relative">
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="Correo" />
                    <label htmlFor="email" className={labelClass}><T>Correo Electrónico</T></label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative">
                    <input type="text" id="folio" value={folio} onChange={(e) => setFolio(e.target.value.toUpperCase())} required className={`${inputClass} uppercase`} placeholder="Folio" />
                    <label htmlFor="folio" className={labelClass}><T>Folio de Cotización</T></label>
                  </div>
                  <div className="relative">
                    <input type="date" id="fecha" value={fecha} min={minDateStr} onChange={(e) => setFecha(e.target.value)} required className={`${inputClass} text-muted-foreground`} placeholder="Fecha" />
                    <label htmlFor="fecha" className={labelClass}><T>Fecha del Evento</T></label>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={!isFormValid}
                    className="group flex items-center justify-center gap-4 bg-foreground text-white px-10 py-5 rounded-full hover:bg-primary transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase">{btnConfirmar}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
              </form>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}