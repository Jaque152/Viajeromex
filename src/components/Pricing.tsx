"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="precios" className="py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 border-primary/30 text-primary">
            Viajes a Tu Medida
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
            Diseñamos tu{" "}
            <span className="text-gradient">aventura perfecta</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Cada viajero es único. Por eso creamos experiencias 100% personalizadas
            que se adaptan a tus gustos, tiempos y presupuesto.
          </p>
        </div>

        {/* Custom Service Card - Centered */}
        <div className="max-w-lg mx-auto">
          <Card className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 shadow-xl hover:shadow-2xl transition-all duration-300">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />

            <CardHeader className="pb-4 relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-semibold">Servicio Personalizado</h3>
              <p className="text-muted-foreground mt-2">Diseñamos tu viaje a la medida de tus sueños</p>
            </CardHeader>

            <CardContent className="relative">
              <p className="text-muted-foreground mb-6">
                ¿Tienes un destino en mente? ¿Un presupuesto específico? ¿Necesidades especiales?
                Nuestro equipo de expertos creará un itinerario único solo para ti.
              </p>

              <div className="p-5 bg-background/60 backdrop-blur-sm rounded-xl mb-6 border border-border/50">
                <h4 className="font-medium mb-4 text-foreground">¿Qué incluye?</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    Itinerario 100% personalizado
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    Precio ajustado a tu presupuesto
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    Asesoría de expertos en destinos
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    Atención dedicada 
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    Sin cargos ocultos - IVA incluido
                  </li>
                </ul>
              </div>

              <Button asChild className="w-full rounded-full h-12 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                <Link href="/cotizar">
                  Cotizar Ahora
                </Link>
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Respuesta en menos de 24 horas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
