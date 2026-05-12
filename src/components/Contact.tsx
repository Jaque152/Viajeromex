"use client";

import { T } from "@/components/T";
import { Mail, Phone, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section className="bg-foreground text-background py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Info */}
          <div className="flex flex-col justify-center animate-fade-up">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-secondary mb-4 block">
              <T>Hablemos</T>
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-10">
              <T>Estamos a su entera disposición.</T>
            </h2>
            
            <div className="space-y-8 text-sm font-light text-background/70">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-1" />
                <p><T>Dirección Av. Río Consulado/Quintero 1550 Oficina 102 Col Vallejo, Azcapotzalco Cp 02040</T></p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <p>+52 (55) 5555 5555</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <p>contacto@epicureo.com</p>
              </div>
            </div>
          </div>

          {/* Formulario Rápido */}
          <div className="bg-background/5 p-8 md:p-12 animate-fade-up delay-100">
            <form className="space-y-8">
              <div>
                <input type="text" placeholder="Su nombre" className="w-full bg-transparent border-b border-background/20 py-3 text-sm text-background placeholder:text-background/40 focus:border-secondary outline-none transition-colors" />
              </div>
              <div>
                <input type="email" placeholder="Su correo electrónico" className="w-full bg-transparent border-b border-background/20 py-3 text-sm text-background placeholder:text-background/40 focus:border-secondary outline-none transition-colors" />
              </div>
              <div>
                <textarea rows={4} placeholder="¿En qué podemos ayudarle?" className="w-full bg-transparent border-b border-background/20 py-3 text-sm text-background placeholder:text-background/40 focus:border-secondary outline-none transition-colors resize-none"></textarea>
              </div>
              <button type="submit" className="bg-secondary text-foreground px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-background transition-colors duration-300 w-full">
                <T>Enviar Mensaje</T>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}