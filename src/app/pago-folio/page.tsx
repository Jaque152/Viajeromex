"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ArrowRight, DollarSign, FileText } from "lucide-react";

export default function PagoFolioPage() {
  const router = useRouter();
  const [folio, setFolio] = useState("");
  const [monto, setMonto] = useState("");

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, ''); 
    setMonto(val);
  };

  const handlePagar = (e: React.FormEvent) => {
    e.preventDefault();
    const montoNumerico = parseFloat(monto);
    if (!folio || isNaN(montoNumerico) || montoNumerico <= 0) return;

    // Redirección al checkout
    router.push(`/checkout?folio=${encodeURIComponent(folio)}&monto=${montoNumerico}`);
  };

  const isFormValid = folio.length > 2 && parseFloat(monto) > 0;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 flex items-center justify-center py-32 px-4">
        
        <div className="max-w-4xl w-full grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white border border-stone-100">
          
          {/* Lado Izquierdo: Diseño de Marca */}
          <div className="bg-stone-100 p-12 text-stone-900 flex flex-col justify-between min-h-[400px] relative overflow-hidden border-r border-stone-200">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-orange-200 rounded-full blur-[100px] opacity-60"></div>
            
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-4 text-stone-800">
                Pago de <br/>
                <span className="text-orange-600 italic">Cotización</span>
              </h1>
              <div className="w-12 h-1 bg-orange-600 mb-6"></div>
              <p className="text-stone-600 font-medium leading-relaxed">
                Ingresa el folio proporcionado por tu asesor y el monto acordado para proceder con el pago de manera segura.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-white w-fit px-4 py-2 rounded-full shadow-sm border border-stone-200 mt-8 relative z-10">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-bold tracking-widest text-stone-600 uppercase">Transacción Cifrada 256-Bit</span>
            </div>
          </div>

          {/* Lado Derecho: Formulario */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
            <form onSubmit={handlePagar} className="space-y-8">
              
              <div className="space-y-3">
                <label className="text-xs font-black tracking-widest text-stone-500 uppercase flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" /> Folio de Seguimiento
                </label>
                <Input 
                  type="text" 
                  placeholder="Ej. PSN-1234" 
                  value={folio}
                  onChange={(e) => setFolio(e.target.value.toUpperCase())}
                  required
                  className="bg-stone-50 border-0 border-b-2 border-stone-200 focus-visible:ring-0 focus-visible:border-orange-600 rounded-t-xl px-4 text-stone-800 text-xl font-mono uppercase h-14 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black tracking-widest text-stone-500 uppercase flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-orange-600" /> Monto Total Acordado (MXN)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-stone-400 font-bold text-2xl">$</span>
                  <Input 
                    type="text" 
                    placeholder="0.00" 
                    value={monto}
                    onChange={handleMontoChange}
                    required
                    className="bg-stone-50 border-0 border-b-2 border-stone-200 focus-visible:ring-0 focus-visible:border-orange-600 rounded-t-xl pl-10 text-stone-900 text-3xl font-black h-16 transition-all"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={!isFormValid}
                className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-bold tracking-widest uppercase rounded-full transition-all shadow-lg shadow-orange-600/20 mt-4"
              >
                Proceder al Pago <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}