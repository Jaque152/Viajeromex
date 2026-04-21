'use client';

import { T } from "@/components/T";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function Contact() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error: dbError } = await supabase.from("contact_messages_explonix").insert([{ full_name: formData.name, email: formData.email, phone: formData.phone, message: formData.message }]);
      if (dbError) throw dbError;
      const response = await fetch("/api/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "CONTACT", ...formData, customerName: formData.name }) });
      if (!response.ok) throw new Error("No se pudo enviar");
      alert("¡Mensaje enviado con éxito!");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      alert("Hubo un error al enviar tu mensaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="relative bg-background pt-20">
      
      {/* Franja Superior Oscura (Cabecera Tipográfica) */}
      <div className="bg-slate-900 pt-20 pb-48 px-4 rounded-[2.5rem] mx-4 lg:mx-8 relative overflow-hidden">
        {/* Elemento gráfico de fondo */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] border-[1px] border-white/5 rounded-full" />
        <div className="absolute top-10 -right-10 w-[400px] h-[400px] border-[1px] border-white/5 rounded-full" />
        
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">
              <T>Conecta</T><br/>
              <span className="text-cyan-400"><T>con nosotros.</T></span>
            </h2>
            <p className="text-slate-400 font-medium text-lg max-w-md"><T>Nuestras líneas están abiertas. Envíanos las especificaciones de tu proyecto de viaje y nuestros agentes trazarán el plan de vuelo en menos de 24 horas.</T></p>
          </div>
          
          <div className="flex flex-col gap-4">
            <a href="mailto:contacto@explonix.com" className="flex items-center gap-3 text-white hover:text-cyan-400 font-bold transition-colors">
              <Mail className="w-5 h-5" /> contacto@explonix.com
            </a>
            <a href="tel:+525555555555" className="flex items-center gap-3 text-white hover:text-cyan-400 font-bold transition-colors">
              <Phone className="w-5 h-5" /> +52 55 5555 5555
            </a>
          </div>
        </div>
      </div>

      {/* Formulario Flotante (Se superpone a la franja oscura y al fondo claro) */}
      <div className="container mx-auto px-4 max-w-4xl relative -mt-32 z-20 pb-24">
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-2"><T>Nombre</T></label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Tu nombre" required className="h-16 border-0 border-b-2 border-slate-100 focus-visible:ring-0 focus-visible:border-primary rounded-none px-2 font-bold text-lg bg-transparent" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-2"><T>Teléfono</T></label>
                <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+52" required className="h-16 border-0 border-b-2 border-slate-100 focus-visible:ring-0 focus-visible:border-primary rounded-none px-2 font-bold text-lg bg-transparent" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-2"><T>Correo Electrónico</T></label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="ejemplo@correo.com" required className="h-16 border-0 border-b-2 border-slate-100 focus-visible:ring-0 focus-visible:border-primary rounded-none px-2 font-bold text-lg bg-transparent" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between ml-2">
                <label className="text-xs font-black uppercase text-slate-400"><T>Mensaje</T></label>
                <span className="text-xs font-bold text-slate-300">{formData.message.length}/180</span>
              </div>
              <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Mensaje" rows={3} maxLength={180} className="border-0 border-b-2 border-slate-100 focus-visible:ring-0 focus-visible:border-primary rounded-none px-2 font-bold text-lg bg-transparent resize-none" />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={!formData.name || isSubmitting} className="h-16 px-10 rounded-full bg-primary hover:bg-slate-900 text-white font-black text-lg transition-all group">
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <T>Enviar</T>}
                {!isSubmitting && <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}