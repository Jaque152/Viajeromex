"use client";

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { T } from "@/components/T";
import { Mail, Phone, MapPin, Loader2, CheckCircle } from "lucide-react";

export function Contact() {
  const locale = useLocale();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CONTACT', // Tipo de correo de contacto general
          customerName: nombre,
          email: email,
          message: mensaje,
          locale: locale
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setNombre(""); setEmail(""); setMensaje("");
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert("No se pudo enviar el mensaje. Inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error enviando mensaje de contacto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 md:py-32 bg-background scroll-mt-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Columna Info de Contacto (Diseño Claro y Limpio) */}
          <div className="flex flex-col justify-center animate-fade-in-up">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary mb-6 block">
              <T>Hablemos</T>
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-10 text-foreground leading-tight">
              <T>Estamos a su entera disposición.</T>
            </h2>
            
            <div className="space-y-8 text-sm font-light text-muted-foreground mt-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-foreground" />
                </div>
                <div className="pt-2">
                  <p className="font-medium text-foreground mb-1"><T>Sede Central</T></p>
                  <p><T> Av. Rio Consulado Cto Interior 516 Oficina 102</T><br/>Col Tlatilco, Azcapotzalco Cp 02860 </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-foreground" />
                </div>
                <div className="pt-1">
                  <p className="font-medium text-foreground mb-1"><T>Teléfono</T></p>
                  <p>+52 (55) 1940 6598</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-foreground" />
                </div>
                <div className="pt-1">
                  <p className="font-medium text-foreground mb-1"><T>Correo Electrónico</T></p>
                  <p>atencion@mextripia.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario (Estética fina sin bordes cerrados) */}
          <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] animate-fade-in-up delay-150">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <CheckCircle className="w-16 h-16 text-primary mb-6" strokeWidth={1} />
                <h3 className="text-2xl font-serif text-foreground mb-4"><T>Mensaje Enviado</T></h3>
                <p className="text-muted-foreground font-light"><T>Gracias por contactarnos. Un especialista se comunicará con usted a la brevedad.</T></p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="relative">
                  <input type="text" id="c_name" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="peer w-full bg-transparent border-b border-border py-4 text-foreground focus:border-primary outline-none transition-colors placeholder-transparent" placeholder="Su nombre" />
                  <label htmlFor="c_name" className="absolute left-0 -top-3.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary uppercase tracking-widest"><T>Nombre</T></label>
                </div>
                
                <div className="relative">
                  <input type="email" id="c_email" value={email} onChange={(e) => setEmail(e.target.value)} required className="peer w-full bg-transparent border-b border-border py-4 text-foreground focus:border-primary outline-none transition-colors placeholder-transparent" placeholder="Su correo" />
                  <label htmlFor="c_email" className="absolute left-0 -top-3.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary uppercase tracking-widest"><T>Correo Electrónico</T></label>
                </div>
                
                <div className="relative pt-2">
                  <textarea id="c_msg" rows={4} value={mensaje} onChange={(e) => setMensaje(e.target.value)} required className="peer w-full bg-transparent border-b border-border py-4 text-foreground focus:border-primary outline-none transition-colors placeholder-transparent resize-none" placeholder="Mensaje"></textarea>
                  <label htmlFor="c_msg" className="absolute left-0 -top-1 text-xs text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-focus:-top-1 peer-focus:text-xs peer-focus:text-primary uppercase tracking-widest"><T>¿En qué podemos ayudarle?</T></label>
                </div>
                
                <button type="submit" disabled={isSubmitting} className="w-full bg-foreground text-white py-5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors duration-300 flex justify-center items-center gap-3 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isSubmitting ? <T>Enviando...</T> : <T>Enviar Mensaje</T>}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}