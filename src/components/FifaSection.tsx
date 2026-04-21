"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { FifaExp } from "@/lib/types";
import { T } from "@/components/T";

export function FifaSection() {
  const [fifaExps, setFifaExps] = useState<FifaExp[]>([]);
  const [activeExpId, setActiveExpId] = useState<number | null>(null);
  const locale = useLocale();

  useEffect(() => {
    async function loadFifaData() {
      const { data } = await supabase
        .from('fifa_experiences_explonix')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (data) {
        setFifaExps(data);
        if (data.length > 0) {
          setActiveExpId(data[0].id); 
        }
      }
    }
    loadFifaData();
  }, []);

  // Encuentra la experiencia activa completa para mostrarla en el panel derecho
  const activeExp = fifaExps.find(exp => exp.id === activeExpId);

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 overflow-hidden text-white relative">
      {/* Malla digital de fondo */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Cabecera*/}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[1]">
              <T>El evento de la década,</T><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary">
                <T>cero fricción</T>
              </span>
            </h2>
            <p className="text-cyan-100 text-lg leading-relaxed font-medium">
              <T>Asegura tu lugar sin el estrés de la planificación. Dinos cómo lo imaginas y nuestro equipo blindará tus accesos, traslados y alojamiento estratégico.</T>
            </p>
          </div>
          <Button asChild className="rounded-full bg-white text-indigo-950 hover:bg-cyan-400 hover:text-indigo-950 h-14 px-8 text-base font-bold transition-colors shadow-xl">
            <Link href={`/${locale}/cotizar`}>
              <T>Quiero estar ahí</T> <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>

        {/* Layout: Interactive Showcase */}
        {fifaExps.length > 0 && activeExp && (
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Columna Izquierda: Menú de Opciones */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {fifaExps.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveExpId(exp.id)}
                  className={`text-left p-6 rounded-3xl transition-all duration-300 border-2 ${
                    activeExpId === exp.id 
                      ? 'bg-white/10 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.15)]' 
                      : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${activeExpId === exp.id ? 'text-cyan-400' : 'text-indigo-300'}`}>
                        <T>{exp.subtitle}</T>
                      </div>
                      <h3 className={`text-2xl font-black tracking-tight ${activeExpId === exp.id ? 'text-white' : 'text-white/70'}`}>
                        <T>{exp.title}</T>
                      </h3>
                    </div>
                    {/* Indicador de activo */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 ${activeExpId === exp.id ? 'bg-cyan-400 text-indigo-950 rotate-0' : 'bg-white/10 text-white/50 -rotate-45'}`}>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Columna Derecha: Visor de Detalles (Detail) */}
            <div className="lg:col-span-7 relative">
              <div className="sticky top-32 glass-panel border-white/10 bg-white/5 rounded-[2.5rem] p-4 overflow-hidden shadow-2xl">
                
                {/* Imagen Principal */}
                <div className="aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/10] rounded-[2rem] overflow-hidden relative mb-8">
                  {/* Key prop fuerza a React a re-renderizar la animación cuando cambia de imagen */}
                  <img key={activeExp.image_url} src={activeExp.image_url} alt={activeExp.title} className="w-full h-full object-cover animate-fade-in" />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 to-transparent"></div>
                </div>

                {/* Contenido Dinámico */}
                <div key={activeExp.id} className="px-4 md:px-8 pb-8 animate-fade-up">
                  <p className="text-lg text-cyan-50 mb-8 leading-relaxed font-medium">
                    <T>{activeExp.description}</T>
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                    {activeExp.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-indigo-100 font-medium leading-tight">
                          <T>{item}</T>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}