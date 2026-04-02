"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { supabase } from '@/lib/supabase';

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        { 
          full_name: formData.name, 
          email: formData.email, 
          phone: formData.phone,
          message: formData.message 
        }
      ]);

    if (error) {
      console.error("Error al enviar:", error.message);
      alert("Hubo un error al enviar tu mensaje. Intenta de nuevo.");
    } else {
      alert("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
      // limpiar el formulario 
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  };
    
  return (
    <section id="contacto" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-secondary/30" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Content */}
          <div>
            <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 border-primary/30 text-primary">
              Atención al Cliente
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
              Personalizamos cada detalle{" "}
              <span className="text-gradient">para ti</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              ¿Tienes preguntas? ¿Necesitas ayuda?<br />
              Nuestro equipo está listo para apoyarte.
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Correo Electrónico</h4>
                    <a href="mailto:informes@zenithmex.com" className="text-muted-foreground hover:text-primary transition-colors">
                      informes@zenithmex.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Teléfono</h4>
                    <a href="tel:+525555555555" className="text-muted-foreground hover:text-primary transition-colors">
                      +52 55 5555 5555
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Ubicación</h4>
                    <p className="text-muted-foreground">
                      Ciudad de México, México
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
