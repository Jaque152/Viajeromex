"use client";

import { T } from "@/components/T";
import { Utensils, Sparkles, Map, Users } from "lucide-react";

export function AboutServices() {
  const services = [
    { icon: Utensils, title: "Curaduría Culinaria", desc: "Diseño de menús y degustaciones de alta gama." },
    { icon: Sparkles, title: "Atmósferas Inmersivas", desc: "Ambientación y producción sensorial de espacios." },
    { icon: Users, title: "Activaciones de Marca", desc: "Conectamos tu esencia con audiencias clave." },
    { icon: Map, title: "Logística Premium", desc: "Coordinación milimétrica y hospitalidad VIP." },
  ];

  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* ¿Qué hacemos? (Parafraseado) */}
          <div className="w-full lg:w-5/12 animate-fade-in-up">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6 block">
              <T>Nuestra Esencia</T>
            </span>
            <h2 className="text-4xl md:text-5xl mb-8 leading-tight">
              <T>Forjamos recuerdos a través de los sentidos.</T>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              <T>Transformamos visiones en realidades palpables. Nuestro propósito es fusionar la alta gastronomía con el diseño de eventos, logrando que cada anfitrión o marca conecte profundamente con sus invitados.</T>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <T>Desde veladas íntimas hasta montajes majestuosos, orquestamos cada elemento técnico y creativo para garantizar una ejecución sublime que trascienda la promoción y se convierta en una emoción.</T>
            </p>
          </div>

          {/* ¿Qué ofrecemos? (Parafraseado) */}
          <div className="w-full lg:w-7/12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {services.map((srv, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-transform duration-500 animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  <srv.icon className="w-8 h-8 text-primary mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl mb-3"><T>{srv.title}</T></h3>
                  <p className="text-sm text-muted-foreground leading-relaxed"><T>{srv.desc}</T></p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}