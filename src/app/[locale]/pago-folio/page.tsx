"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import { useCart } from "@/context/CartContext";
import { ArrowRight, ShieldCheck, Ticket, Sparkles, Utensils } from "lucide-react";
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

  const btnConfirmar = useT("Ir a Pagar");

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
        title: "Ruta de Autor (Diseño Personalizado)",
        slug: "ruta-autor-personalizada",
        description: `Pago asociado al folio: ${folio}`,
        location: "Destino a Medida",
        images: ["https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070"],
        category_id: 0
      },
      levelName: "Folio VIP",
      date: fecha,
      people: 1, 
      pricePerPerson: montoNumerico,
      totalPrice: montoNumerico
    };

    addToCart(customExperienceItem);
    sessionStorage.setItem("explonix_temp_contact", JSON.stringify({ nombre, email, folio })); 
    router.push(`/${locale}/checkout`);
  };

  const bentoInput = "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-foreground font-bold focus:border-primary focus:bg-white focus:shadow-xl focus:shadow-primary/10 outline-none transition-all placeholder:text-muted-foreground/50 text-lg";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            {/* Columna Info */}
            <div className="w-full lg:w-5/12 animate-bounce-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent-foreground rounded-full mb-6 font-black text-xs uppercase tracking-widest border border-accent/30">
                <Ticket className="w-4 h-4" />
                <T>Acceso Directo</T>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black font-bricolage text-foreground leading-tight mb-6">
                <T>Paga tu ruta</T> <span className="text-secondary"><T>personalizada</T></span>.
              </h1>
              
              <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-10">
                <T>Ingresa los detalles de tu folio para procesar el pago de tu evento diseñado a medida. Tu mesa ya está reservada.</T>
              </p>

              <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden border-4 border-slate-800">
                <div className="absolute top-4 right-4 text-white/5 rotate-12">
                   <Sparkles className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-accent text-slate-900 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-7 h-7" strokeWidth={2.5} />
                      </div>
                      <p className="font-black text-lg uppercase tracking-tight leading-none"><T>Pago 100% Seguro</T></p>
                   </div>
                   <p className="text-slate-400 font-medium text-sm leading-relaxed"><T>Usamos encriptación de extremo a extremo para garantizar que tu inversión gastronómica esté protegida.</T></p>
                </div>
              </div>
            </div>

            {/* Formulario Estilo Pase VIP */}
            <div className="w-full lg:w-7/12 animate-bounce-up delay-150">
              <form onSubmit={handleConfirmarReserva} className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] border-2 border-slate-50 relative">
                
                {/* Monto Gigante */}
                <div className="mb-10 p-8 bg-primary/5 rounded-[2.5rem] border-4 border-primary/10 text-center group transition-all focus-within:bg-white focus-within:border-primary">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3 block"><T>Monto del Folio (MXN)</T></label>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-black text-primary/40 mr-2 font-bricolage">$</span>
                    <input 
                      type="text" 
                      value={monto}
                      onChange={handleMontoChange}
                      placeholder="0.00"
                      required
                      className="bg-transparent border-none text-6xl font-black font-bricolage text-primary outline-none w-full text-center placeholder:text-primary/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className={bentoInput} placeholder="Titular de la Reserva" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={bentoInput} placeholder="Correo Electrónico" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                  <div className="relative">
                    <input type="text" value={folio} onChange={(e) => setFolio(e.target.value.toUpperCase())} required className={`${bentoInput} uppercase pr-14`} placeholder="Folio" />
                    <Ticket className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-200" />
                  </div>
                  <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required className={`${bentoInput} text-muted-foreground focus:text-foreground`} />
                </div>

                <button 
                  type="submit" 
                  disabled={!isFormValid}
                  className="btn-3d w-full bg-secondary text-white h-20 rounded-[2rem] font-black text-2xl hover:bg-rose-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                >
                  <T>Continuar al Pago</T>
                  <ArrowRight className="w-8 h-8" strokeWidth={3} />
                </button>
                
              </form>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}