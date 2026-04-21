"use client";
import { useLocale } from 'next-intl';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mountain, Waves, Theater, Footprints } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

const experiences = [
  {
    id: 1,
    number: "01",
    title: "Ecosistemas Ocultos",
    description: "Desconéctate del radar y adéntrate en reservas naturales milenarias con guías expertos en conservación.",
    icon: Mountain,
    color: "text-emerald-500",
    bgAccent: "group-hover:bg-emerald-500/5",
    tag: "Naturaleza",
    slug: "naturaleza"
  },
  {
    id: 2,
    number: "02",
    title: "Dinámica Costera",
    description: "Domina las corrientes del Pacífico. Logística completa para surf, buceo y expediciones oceánicas de alto impacto.",
    icon: Waves,
    color: "text-cyan-500",
    bgAccent: "group-hover:bg-cyan-500/5",
    tag: "Aventura",
    slug: "aventura"
  },
  {
    id: 3,
    number: "03",
    title: "Inmersión Local",
    description: "Conecta directamente con las raíces culturales de México. Acceso exclusivo a comunidades, ritos y patrimonio.",
    icon: Theater,
    color: "text-indigo-500",
    bgAccent: "group-hover:bg-indigo-500/5",
    tag: "Cultura",
    slug: "cultura"
  },
  {
    id: 4,
    number: "04",
    title: "Circuito Culinario",
    description: "Mapeamos los sabores más auténticos del país. Desde alta cocina hasta los secretos mejor guardados.",
    icon: Footprints,
    color: "text-rose-500",
    bgAccent: "group-hover:bg-rose-500/5",
    tag: "Gastronomía",
    slug: "gastronomia"
  }
];

export function Experiences() {
  const locale = useLocale();
  return (
    <section id="experiencias" className="py-24 lg:py-32 relative bg-background">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Cabecera */}
        <div className="max-w-4xl mb-20 flex flex-col items-start">
          <Badge variant="outline" className="mb-6 rounded-full px-5 py-2 border-primary/30 text-primary font-bold tracking-widest uppercase text-xs">
            <T>Catálogo Explonix</T>
          </Badge>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.9]">
            <T>Diseña tu</T><br/>
            <span className="text-gradient-cool">
              <T>propia ruta</T>
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
            <T>Olvídate de los tours tradicionales. Con Explonix, te conectamos con experiencias dinámicas, seguras y fuera de lo común.</T>
          </p>
        </div>

        {/* Tarjetas Editoriales */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {experiences.map((exp) => (
            <Link
              key={exp.id}
              href={`/${locale}/experiencias?categoria=${exp.slug}`}
              className="block group"
            >
              <Card className={`h-full relative overflow-hidden bg-card border-none rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 ${exp.bgAccent}`}>
                
                {/* Ícono gigante como marca de agua en el fondo */}
                <exp.icon className={`absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 ${exp.color} pointer-events-none`} />

                <CardContent className="p-10 md:p-12 h-full flex flex-col relative z-10">
                  <div className="flex items-start justify-between mb-12">
                    {/* Número tipográfico */}
                    <span className="text-6xl font-black text-foreground/10 group-hover:text-primary/20 transition-colors font-serif">
                      {exp.number}
                    </span>
                    <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-xs font-bold bg-foreground text-background">
                      <T>{exp.tag}</T>
                    </Badge>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-3xl font-black mb-4 group-hover:text-primary transition-colors tracking-tight">
                      <T>{exp.title}</T>
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-sm">
                      <T>{exp.description}</T>
                    </p>
                  </div>

                  <div className="flex items-center text-sm font-bold text-foreground mt-4">
                    <span className="border-b-2 border-transparent group-hover:border-primary transition-all pb-1">
                      <T>Explorar</T>
                    </span>
                    <ArrowRight className="w-5 h-5 ml-3 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}