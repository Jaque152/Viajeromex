"use client";

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { T } from "@/components/T";
import { Mail, Phone, MapPin, Loader2, CheckCircle, Smile } from "lucide-react";

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
          type: 'CONTACT',
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

  const inputClass = "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-foreground font-bold focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all placeholder:text-muted-foreground placeholder:font-medium";

  return (
    <section id="contacto" className="py-24 md:py-32 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="animate-bounce-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-secondary/20">
              <Smile className="w-4 h-4" />
              <T>Hola</T>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-bricolage mb-8 text-foreground leading-tight">
              <T>Estamos aquí para</T> <span className="text-secondary"><T>ayudarte</T></span>.
            </h2>
            
            <div className="space-y-6 mt-8">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover-float">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-black text-foreground text-lg leading-none mb-1"><T>Nuestra Cocina (Sede)</T></p>
                  <p className="text-muted-foreground font-medium text-sm">Av. Río Consulado 1550, Azcapotzalco</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover-float delay-100">
                <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-black text-foreground text-lg leading-none mb-1"><T>Llámanos</T></p>
                  <p className="text-muted-foreground font-medium text-sm">+52 (55) 5555 5555</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover-float delay-200">
                <div className="w-14 h-14 bg-accent/20 text-accent-foreground rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-black text-foreground text-lg leading-none mb-1"><T>Escríbenos</T></p>
                  <p className="text-muted-foreground font-medium text-sm">atencion@viajeromex.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl shadow-slate-200 border-4 border-slate-50 animate-bounce-up delay-150">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-accent/30"><CheckCircle className="w-10 h-10" strokeWidth={3} /></div>
                <h3 className="text-3xl font-black font-bricolage text-foreground mb-4"><T>¡Mensaje Volando!</T></h3>
                <p className="text-muted-foreground font-medium text-lg"><T>Gracias por escribirnos. Nuestro equipo te responderá muy pronto.</T></p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className={inputClass} placeholder="Tu Nombre" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="Tu Correo" />
                <textarea rows={5} value={mensaje} onChange={(e) => setMensaje(e.target.value)} required className={`${inputClass} resize-none`} placeholder="¿En qué te ayudamos hoy?"></textarea>
                
                <button type="submit" disabled={isSubmitting} className="btn-3d w-full bg-secondary text-white h-16 rounded-2xl font-black text-lg hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 mt-4">
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" strokeWidth={3} /> : null}
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