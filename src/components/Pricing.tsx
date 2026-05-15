"use client";

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { T } from "@/components/T";
import { ArrowRight, CreditCard, Loader2, CheckCircle } from "lucide-react";

export function Pricing() {
  const locale = useLocale();
  
  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [asistentes, setAsistentes] = useState("");
  const [detalles, setDetalles] = useState("");
  
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
          type: 'QUOTE', // Tipo de correo esperado por tu API
          customerName: nombre,
          email: email,
          phone: telefono,
          destination: lugar,
          startDate: fecha,
          travelers: asistentes,
          budget: "A convenir", // Se puede ajustar si decides pedir presupuesto
          message: detalles,
          locale: locale
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        setNombre(""); setEmail(""); setTelefono("");
        setLugar(""); setFecha(""); setAsistentes(""); setDetalles("");
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert("Ocurrió un error al enviar su solicitud. Inténtelo de nuevo.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="cotizar" className="py-24 md:py-32 bg-white rounded-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.02)] mx-4 md:mx-10 my-10 scroll-mt-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Copy y Filosofía */}
          <div className="w-full lg:w-5/12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl mb-8 leading-tight font-serif text-foreground">
              <T>Diseñemos su próximo gran capítulo.</T>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 font-light">
              <T>Desde celebraciones íntimas hasta galas de gran formato, estructuramos propuestas culinarias y logísticas que materializan su visión con precisión absoluta.</T>
            </p>
            
            <div className="space-y-6 mb-12">
              <p className="text-sm text-muted-foreground leading-relaxed italic font-light">
                <T>Comparta las especificaciones iniciales de su evento. Nuestro equipo le presentará una propuesta detallada. Si ya cuenta con una cotización previa y un número de folio, puede proceder al pago directo.</T>
              </p>
              
              <Link 
                href={`/${locale}/pago-folio`}
                className="inline-flex items-center gap-3 text-primary hover:text-secondary transition-colors group"
              >
                <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:border-secondary transition-colors">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-primary/20 pb-1">
                  <T>Pagar Folio Existente</T>
                </span>
              </Link>
            </div>

            <div className="p-6 bg-background rounded-2xl border border-border">
              <p className="text-sm font-medium italic text-foreground"><T>"La verdadera hospitalidad consiste en orquestar el entorno para que el invitado solo tenga que disfrutar."</T></p>
            </div>
          </div>

          {/* Formulario Elegante */}
          <div className="w-full lg:w-7/12 animate-fade-in-up delay-150">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-border rounded-3xl bg-background/50">
                <CheckCircle className="w-16 h-16 text-primary mb-6" strokeWidth={1} />
                <h3 className="text-2xl font-serif text-foreground mb-4"><T>Solicitud Recibida</T></h3>
                <p className="text-muted-foreground font-light"><T>Nuestro equipo de curaduría analizará sus detalles y se pondrá en contacto muy pronto con una propuesta a medida.</T></p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative">
                  <input type="text" id="name" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="peer w-full bg-transparent border-b border-border py-4 text-foreground focus:border-primary outline-none transition-colors placeholder-transparent" placeholder="Nombre" />
                  <label htmlFor="name" className="absolute left-0 -top-3.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary uppercase tracking-widest"><T>Nombre Completo</T></label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="peer w-full bg-transparent border-b border-border py-4 text-foreground focus:border-primary outline-none transition-colors placeholder-transparent" placeholder="Email" />
                    <label htmlFor="email" className="absolute left-0 -top-3.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary uppercase tracking-widest"><T>Correo Electrónico</T></label>
                  </div>
                  <div className="relative">
                    <input type="tel" id="phone" value={telefono} onChange={(e) => setTelefono(e.target.value)} required className="peer w-full bg-transparent border-b border-border py-4 text-foreground focus:border-primary outline-none transition-colors placeholder-transparent" placeholder="Teléfono" />
                    <label htmlFor="phone" className="absolute left-0 -top-3.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary uppercase tracking-widest"><T>Teléfono</T></label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="relative">
                    <input type="text" id="lugar" value={lugar} onChange={(e) => setLugar(e.target.value)} required className="peer w-full bg-transparent border-b border-border py-4 text-foreground focus:border-primary outline-none transition-colors placeholder-transparent" placeholder="Destino" />
                    <label htmlFor="lugar" className="absolute left-0 -top-3.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary uppercase tracking-widest"><T>Destino/Lugar</T></label>
                  </div>
                  <div className="relative">
                    <input type="date" id="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} required className="peer w-full bg-transparent border-b border-border py-4 text-muted-foreground focus:text-foreground focus:border-primary outline-none transition-colors placeholder-transparent" placeholder="Fecha" />
                    <label htmlFor="fecha" className="absolute left-0 -top-3.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary uppercase tracking-widest"><T>Fecha del Evento</T></label>
                  </div>
                  <div className="relative">
                    <input type="number" id="asistentes" value={asistentes} onChange={(e) => setAsistentes(e.target.value)} required min="1" className="peer w-full bg-transparent border-b border-border py-4 text-foreground focus:border-primary outline-none transition-colors placeholder-transparent" placeholder="Asistentes" />
                    <label htmlFor="asistentes" className="absolute left-0 -top-3.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary uppercase tracking-widest"><T>Invitados</T></label>
                  </div>
                </div>

                <div className="relative pt-4">
                  <textarea id="details" rows={3} value={detalles} onChange={(e) => setDetalles(e.target.value)} className="peer w-full bg-transparent border-b border-border py-4 text-foreground focus:border-primary outline-none transition-colors placeholder-transparent resize-none" placeholder="Detalles"></textarea>
                  <label htmlFor="details" className="absolute left-0 -top-1 text-xs text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-focus:-top-1 peer-focus:text-xs peer-focus:text-primary uppercase tracking-widest"><T>Especificaciones Adicionales</T></label>
                </div>

                <button type="submit" disabled={isSubmitting} className="group flex items-center justify-center gap-4 bg-foreground text-white px-10 py-5 rounded-full hover:bg-primary transition-all duration-300 w-full sm:w-auto shadow-xl shadow-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="text-xs font-bold tracking-[0.2em] uppercase">
                    {isSubmitting ? <T>Enviando...</T> : <T>Solicitar Presupuesto</T>}
                  </span>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}