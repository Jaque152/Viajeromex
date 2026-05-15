"use client";

import { T } from "@/components/T";
import { Utensils, Sparkles, Map, ChefHat } from "lucide-react";

export function AboutServices() {
  return (
    <section className="py-24 md:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Cabecera Centrada */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-bounce-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <T>Nuestro Secreto</T>
          </div>
          <h2 className="text-5xl md:text-6xl font-black font-bricolage leading-[1.1] text-foreground mb-6">
            <T>Forjamos recuerdos a través del</T> <span className="text-primary"><T>paladar</T></span>.
          </h2>
          <p className="text-muted-foreground text-lg font-medium">
            <T>Desde veladas íntimas hasta recorridos callejeros, orquestamos cada elemento para garantizar una experiencia que te dejará con un excelente sabor de boca.</T>
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 auto-rows-[250px]">
          
          {/* Tarjeta 1: Ancha (Col-span-2) */}
          <div className="md:col-span-2 md:row-span-1 bg-primary p-8 rounded-[3rem] text-white flex flex-col justify-between shadow-xl shadow-primary/20 hover-float animate-bounce-up delay-100">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <ChefHat className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-3xl font-black font-bricolage mb-2"><T>Curaduría Culinaria</T></h3>
              <p className="font-medium text-white/90 text-lg"><T>Diseño de menús, catas y degustaciones de alta gama de la mano de chefs locales galardonados.</T></p>
            </div>
          </div>

          {/* Tarjeta 2: Alta (Row-span-2) */}
          <div className="md:col-span-1 md:row-span-2 bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl hover-float animate-bounce-up delay-200">
            <div className="w-14 h-14 bg-secondary/20 text-secondary rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <div className="mt-8">
              <h3 className="text-4xl font-black font-bricolage mb-4 text-secondary"><T>Atmósferas Únicas</T></h3>
              <p className="font-medium text-slate-300 text-lg leading-relaxed"><T>Cenas en cenotes ocultos, veladas clandestinas y caminatas por mercados vibrantes. El entorno importa tanto como la comida.</T></p>
            </div>
          </div>

          {/* Tarjeta 3: Cuadrada */}
          <div className="md:col-span-1 md:row-span-1 bg-white border-2 border-slate-100 p-8 rounded-[3rem] flex flex-col justify-between hover-float animate-bounce-up delay-300">
            <div className="w-14 h-14 bg-accent/20 text-accent-foreground rounded-2xl flex items-center justify-center">
              <Utensils className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black font-bricolage mb-2 text-foreground"><T>Sabores Auténticos</T></h3>
              <p className="font-medium text-muted-foreground"><T>Te llevamos a las joyas escondidas que solo los locales conocen.</T></p>
            </div>
          </div>

          {/* Tarjeta 4: Cuadrada */}
          <div className="md:col-span-1 md:row-span-1 bg-secondary/10 border-2 border-secondary/20 p-8 rounded-[3rem] flex flex-col justify-between hover-float animate-bounce-up delay-300">
            <div className="w-14 h-14 bg-secondary text-white rounded-2xl flex items-center justify-center">
              <Map className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black font-bricolage mb-2 text-secondary"><T>Logística Impecable</T></h3>
              <p className="font-medium text-secondary/80"><T>Nos encargamos de todos los traslados. Tú solo disfruta el bocado.</T></p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}