"use client";

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { T } from "@/components/T";
import { ArrowRight, Loader2, CheckCircle, Sparkles, Ticket, Utensils } from "lucide-react";

export function Pricing() {
  const locale = useLocale();
  
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
          type: 'QUOTE', 
          customerName: nombre,
          email: email,
          phone: telefono,
          destination: lugar,
          startDate: fecha,
          travelers: asistentes,
          budget: "A convenir", 
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

  // Clases compartidas para el nuevo diseño "Bento" de los inputs
  const bentoInput = "w-full h-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-6 py-5 text-foreground font-bold focus:border-secondary focus:bg-white focus:shadow-xl focus:shadow-secondary/10 outline-none transition-all placeholder:text-muted-foreground/60 placeholder:font-medium text-lg";

  return (
    <section id="cotizar" className="py-24 md:py-32 bg-background scroll-mt-24 relative overflow-hidden">
      
      {/* Decoraciones de fondo */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        {/* Cabecera Centrada */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-bounce-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 font-bold text-xs uppercase tracking-widest border border-primary/20">
            <Utensils className="w-4 h-4" />
            <T>Cata a Medida</T>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl mb-6 leading-[1.1] font-black font-bricolage text-foreground tracking-tight">
            <T>Diseñemos tu propio</T> <span className="text-primary"><T>festín</T></span>.
          </h2>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            <T>¿Cumpleaños de ensueño o viaje corporativo? Cuéntanos tus antojos. Nuestro equipo estructurará una ruta culinaria y logística exacta para tu paladar.</T>
          </p>
        </div>

        {/* Tarjeta VIP (Pagar Folio) cruzando el diseño */}
        <div className="bg-secondary text-white rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-secondary/30 hover-float animate-bounce-up delay-100 mb-12 border-4 border-white/20 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-white/10 rotate-12 pointer-events-none">
            <Ticket className="w-48 h-48" strokeWidth={1} />
          </div>
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <h3 className="font-black font-bricolage text-3xl mb-2 flex items-center justify-center md:justify-start gap-3">
              <Sparkles className="w-6 h-6 text-accent" />
              <T>¿Ya tienes un Folio?</T>
            </h3>
            <p className="font-medium text-white/90 text-lg"><T>Sáltate la fila y ve directo a la degustación.</T></p>
          </div>
          <Link 
            href={`/${locale}/pago-folio`}
            className="btn-3d relative z-10 w-full md:w-auto flex items-center justify-center gap-3 bg-white text-secondary px-8 py-4 rounded-full font-black text-lg hover:bg-slate-50 transition-colors"
          >
            <T>Pagar Folio</T>
            <ArrowRight className="w-5 h-5" strokeWidth={3} />
          </Link>
        </div>

        {/* Formulario Bento Box */}
        <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 animate-bounce-up delay-200">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="w-24 h-24 bg-accent text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-accent/30 rotate-3">
                <CheckCircle className="w-12 h-12" strokeWidth={3} />
              </div>
              <h3 className="text-4xl font-black font-bricolage text-foreground mb-4"><T>¡Receta Recibida!</T></h3>
              <p className="text-muted-foreground font-medium text-xl max-w-md"><T>Nuestros chefs de experiencias están cocinando tu propuesta. Nos pondremos en contacto súper pronto.</T></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Fila 1 */}
              <div className="md:col-span-12">
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className={bentoInput} placeholder="Tu Nombre Completo" />
              </div>

              {/* Fila 2 */}
              <div className="md:col-span-6">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={bentoInput} placeholder="Correo Electrónico" />
              </div>
              <div className="md:col-span-6">
                <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required className={bentoInput} placeholder="Teléfono Móvil" />
              </div>

              {/* Fila 3 (Mix asimétrico) */}
              <div className="md:col-span-5">
                <input type="text" value={lugar} onChange={(e) => setLugar(e.target.value)} required className={bentoInput} placeholder="¿A qué destino viajamos?" />
              </div>
              <div className="md:col-span-4">
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required className={`${bentoInput} text-muted-foreground focus:text-foreground`} placeholder="Fecha" />
              </div>
              <div className="md:col-span-3">
                <input type="number" value={asistentes} onChange={(e) => setAsistentes(e.target.value)} required min="1" className={bentoInput} placeholder="¿Cuántos son?" />
              </div>

              {/* Fila 4 */}
              <div className="md:col-span-12 h-32">
                <textarea value={detalles} onChange={(e) => setDetalles(e.target.value)} className={`${bentoInput} resize-none`} placeholder="Cuéntanos más... alergias, tipo de comida que buscas, ocasión especial."></textarea>
              </div>

              {/* Botón Submit */}
              <div className="md:col-span-12 mt-4">
                <button type="submit" disabled={isSubmitting} className="btn-3d w-full bg-primary text-white h-20 rounded-[2rem] font-black text-2xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
                  {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" strokeWidth={3} /> : <Utensils className="w-7 h-7" strokeWidth={3} />}
                  {isSubmitting ? <T>Cocinando propuesta...</T> : <T>Pedir Presupuesto</T>}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}