"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Lock, CheckCircle } from "lucide-react";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";

export default function PagoFolioPage() {
  const router = useRouter();
  const locale = useLocale();
  const [folio, setFolio] = useState("");
  const [monto, setMonto] = useState("");

  const phFolio = useT("Ej. C-12345 o Paquete Caribe");
  const textBtn = useT("Añadir al carrito");

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, ''); 
    setMonto(val);
  };

  const handlePagar = (e: React.FormEvent) => {
    e.preventDefault();
    const montoNumerico = parseFloat(monto);
    if (!folio || isNaN(montoNumerico) || montoNumerico <= 0) return;
    router.push(`/${locale}/checkout?folio=${encodeURIComponent(folio)}&monto=${montoNumerico}`);
  };

  const isFormValid = folio.length > 2 && parseFloat(monto) > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-24 px-4 lg:pt-36">
        <div className="container mx-auto max-w-6xl">
          
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            
            <div className="w-full relative rounded-2xl overflow-hidden shadow-2xl h-[350px] md:h-[450px] lg:h-[650px] lg:sticky lg:top-32 mb-8 lg:mb-0">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop')] bg-cover bg-top"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 z-10">
                <p className="text-primary font-bold mb-3 text-xs md:text-sm uppercase tracking-widest"><T>Servicios Especiales</T></p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-4">
                  <T>Experiencia</T> <br/>
                  <T>Personalizada</T>
                </h1>
                <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-sm hidden md:block">
                  <T>Este apartado es exclusivo para clientes que ya cuentan con un itinerario y presupuesto enviado por su concierge.</T>
                </p>
              </div>
            </div>

            <div className="w-full flex flex-col justify-center lg:pt-4">
              
              <div className="mb-10">
                <h2 className="text-2xl lg:text-3xl font-serif font-bold text-foreground mb-8">
                  <T>Pasos para realizar tu pago:</T>
                </h2>
                
                <ul className="space-y-6 text-muted-foreground">
                  <li className="flex gap-4 items-start">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <p className="leading-relaxed text-base">
                      <strong className="text-foreground font-bold"><T>Monto:</T></strong> <T>Ingresa en el cuadro de precio la cantidad total acordada (IVA incluido).</T>
                    </p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <p className="leading-relaxed text-base">
                      <strong className="text-foreground font-bold"><T>Referencia:</T></strong> <T>Escribe tu número de folio o nombre del paquete en el campo de texto.</T>
                    </p>
                  </li>
                  <li className="flex gap-4 items-start">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <p className="leading-relaxed text-base">
                      <strong className="text-foreground font-bold"><T>Seguridad:</T></strong> <T>Haz clic en "Añadir al carrito" para proceder al pago encriptado.</T>
                    </p>
                  </li>
                </ul>
              </div>

              <form onSubmit={handlePagar} className="space-y-6 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-lg">
                <div className="space-y-3">
                  <label className="text-xs md:text-sm font-bold text-foreground uppercase tracking-widest">1. <T>Cantidad Total (MXN)</T></label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-muted-foreground font-bold text-xl">$</span>
                    <Input 
                      type="text" 
                      placeholder="0.00" 
                      value={monto}
                      onChange={handleMontoChange}
                      required
                      className="bg-background border-border focus-visible:ring-primary pl-10 text-foreground text-xl md:text-2xl font-bold h-14 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs md:text-sm font-bold text-foreground uppercase tracking-widest">2. <T>Número de Folio / Paquete</T></label>
                  <Input 
                    type="text" 
                    placeholder={phFolio} 
                    value={folio}
                    onChange={(e) => setFolio(e.target.value.toUpperCase())}
                    required
                    className="bg-background border-border focus-visible:ring-primary px-4 text-foreground font-mono uppercase h-14 rounded-xl"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={!isFormValid}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-lg mt-6 text-base md:text-lg"
                >
                  <Lock className="w-5 h-5 mr-2" /> {textBtn} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
              
              <p className="text-sm text-muted-foreground mt-8 text-center px-4">
                <T>Si tienes alguna pregunta sobre este tour o necesitas asistencia para hacer tu pago, contacta a tu concierge.</T>
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}