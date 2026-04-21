"use client";
import { useLocale } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Check, PlaneTakeoff } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

export function Pricing() {
  const locale = useLocale();
  return (
    <section id="precios" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Layout Asimétrico 60/40 */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Lado Izquierdo: Tipografía Masiva */}
          <div className="w-full lg:w-7/12 space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                <T>Viajes a Tu Medida</T>
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              <T>Tu viaje.</T><br/>
              <T>Tus reglas.</T><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
                <T>Un solo plan.</T>
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
              <T>Cada viajero es único. Por eso eliminamos los paquetes rígidos. Creamos experiencias 100% personalizadas que se adaptan a tus gustos, tiempos y presupuesto.</T>
            </p>
          </div>

          {/* Lado Derecho: The "Boarding Pass" Ticket */}
          <div className="w-full lg:w-5/12">
            <div className="bg-slate-900 rounded-[2rem] flex flex-col relative shadow-2xl shadow-primary/20 overflow-hidden transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
              
              {/* Ticket Top */}
              <div className="p-8 md:p-10 bg-gradient-to-br from-slate-900 to-slate-800 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <PlaneTakeoff className="w-32 h-32 text-cyan-400" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2"><T>Pase Explonix</T></h3>
                <p className="text-cyan-400 font-bold uppercase tracking-wider text-sm"><T>Servicio Personalizado</T></p>
              </div>

              {/* Perforation Line */}
              <div className="flex items-center px-4 -my-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-background -ml-8" />
                <div className="flex-1 border-t-2 border-dashed border-white/20" />
                <div className="w-8 h-8 rounded-full bg-background -mr-8" />
              </div>

              {/* Ticket Bottom */}
              <div className="p-8 md:p-10 bg-slate-900">
                <ul className="space-y-5 mb-10">
                  {[
                    "Diseño de ruta inteligente",
                    "Precio ajustado a tu presupuesto",
                    "Asignación de asesores especializados",
                    "Transparencia total - Impuestos incluidos"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-sm font-bold text-slate-300">
                      <Check className="w-5 h-5 text-cyan-400 shrink-0" />
                      <T>{item}</T>
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full rounded-xl h-16 text-lg font-black bg-cyan-400 text-slate-900 hover:bg-white transition-colors shadow-lg shadow-cyan-400/20">
                  <Link href={`/${locale}/cotizar`}>
                    <T>Comenzar a Cotizar</T>
                  </Link>
                </Button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}