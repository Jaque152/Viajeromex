'use client';

import { T } from "@/components/T";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Guardar en Supabase
      const { error: dbError } = await supabase
        .from("contact_messages")
        .insert([
          {
            full_name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          },
        ]);

      if (dbError) throw dbError;

      // 2. Enviar correo vía API
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "CONTACT",
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "No se pudo enviar el correo");
      }

      alert("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Hubo un error al enviar tu mensaje. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 lg:py-32 bg-[#F9FAFB]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-4">
            <T>NUEVAS AVENTURAS</T>
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif font-black text-[#1C2024] leading-tight">
            <T>Personalizamos cada detalle de tu viaje</T>
            <br />
            <T>para que sea único.</T>
          </h3>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-7 w-full max-w-2xl mx-auto lg:mx-0">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#4A5568]">
                      <T>Nombre</T> <span className="text-[#E53E3E]">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nombre"
                      required
                      className="h-14 bg-white border-[#E2E8F0] focus-visible:ring-primary rounded-md px-4 text-foreground placeholder:text-[#A0AEC0] shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#4A5568]">
                      <T>Teléfono</T> <span className="text-[#E53E3E]">*</span>
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Teléfono"
                      required
                      className="h-14 bg-white border-[#E2E8F0] focus-visible:ring-primary rounded-md px-4 text-foreground placeholder:text-[#A0AEC0] shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#4A5568]">
                      <T>Correo Electrónico</T>{" "}
                      <span className="text-[#E53E3E]">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Correo Electrónico"
                      required
                      className="h-14 bg-white border-[#E2E8F0] focus-visible:ring-primary rounded-md px-4 text-foreground placeholder:text-[#A0AEC0] shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <label className="text-sm font-bold text-[#4A5568]">
                        <T>Mensaje</T>
                      </label>
                      <span className="text-xs text-[#A0AEC0] font-medium">
                        {formData.message.length} / 180
                      </span>
                    </div>
                    <Textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Mensaje"
                      rows={5}
                      maxLength={180}
                      className="bg-white border-[#E2E8F0] focus-visible:ring-primary rounded-md px-4 py-4 text-foreground placeholder:text-[#A0AEC0] resize-none shadow-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      !formData.name ||
                      !formData.email ||
                      !formData.phone ||
                      isSubmitting
                    }
                    className="w-full h-14 bg-[#5CB8D8] hover:bg-[#4ba8c8] text-white font-bold rounded-md shadow-none transition-colors text-base"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    ) : null}
                    {isSubmitting ? <T>Enviando...</T> : <T>Enviar</T>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-8 lg:pl-10">
            <div>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                <T>¿Tienes preguntas? ¿Necesitas ayuda?</T>
                <br />
                <T>Nuestro equipo está listo para apoyarte.</T>
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">
                    <T>Correo Electrónico</T>
                  </h4>
                  <a
                    href="mailto:informes@zenithmex.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    contacto@zenithmex.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">
                    <T>Teléfono</T>
                  </h4>
                  <a
                    href="tel:+525555555555"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +52 55 5555 5555
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">
                    <T>Ubicación</T>
                  </h4>
                  <p className="text-muted-foreground">
                    Ciudad de México, México
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}