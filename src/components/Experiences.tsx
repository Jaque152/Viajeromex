"use client";
import { useLocale } from 'next-intl';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Mountain, Waves, Theater, Footprints } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

const experiences = [
  {
    id: 1,
    title: "Santuarios Naturales",
    description: "Camina entre bosques milenarios donde el tiempo parece detenerse. Descubre la magia de los refugios naturales más impresionantes.",
    icon: Mountain,
    color: "from-emerald-500/20 to-emerald-600/10",
    tag: "Naturaleza",
    slug: "naturaleza"
  },
  {
    id: 2,
    title: "Aventura Marina",
    description: "Domina la energía del mar y experimenta la libertad de conectar con el océano Pacífico. Una experiencia única.",
    icon: Waves,
    color: "from-sky-500/20 to-sky-600/10",
    tag: "Aventura",
    slug: "aventura"
  },
  {
    id: 3,
    title: "Tradiciones Vivas",
    description: "Adéntrate en el corazón de la cultura local a través de sus mitos y sus héroes. Vive la energía de nuestras tradiciones.",
    icon: Theater,
    color: "from-amber-500/20 to-amber-600/10",
    tag: "Cultura",
    slug: "cultura"
  },
  {
    id: 4,
    title: "Rutas Gastronómicas",
    description: "Descubre los sabores auténticos de México en recorridos culinarios guiados por expertos locales.",
    icon: Footprints,
    color: "from-rose-500/20 to-rose-600/10",
    tag: "Gastronomía",
    slug: "gastronomia"
  }
];

export function Experiences() {
  const locale = useLocale();
  return (
    <section id="experiencias" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 border-primary/30 text-primary">
            <T>Nuestras Experiencias</T>
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
            <T>Vive el México que</T>{" "}
            <span className="text-gradient"><T>siempre soñaste</T></span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            <T>Experiencias únicas diseñadas para los amantes de la aventura y la cultura.
            Te conectamos con las mejores actividades guiadas por expertos.</T>
          </p>
        </div>

        {/* Experience Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {experiences.map((exp, index) => (
            <Link
              key={exp.id}
              href={`/${locale}/experiencias?categoria=${exp.slug}`}
              className="block group"
            >
              <Card
                className="h-full cursor-pointer border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Icon Area */}
                    <div className={`w-full md:w-48 h-40 md:h-auto bg-gradient-to-br ${exp.color} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                      <exp.icon className="w-16 h-16 text-foreground/30 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <Badge variant="secondary" className="text-xs">
                            <T>{exp.tag}</T>
                          </Badge>
                          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                        <h3 className="text-xl font-serif font-semibold mb-3 group-hover:text-primary transition-colors">
                          <T>{exp.title}</T>
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          <T>{exp.description}</T>
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <span className="text-sm text-primary font-medium group-hover:underline">
                         <T> Ver experiencias →</T>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/experiencias`}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            <T>Ver Todas las Experiencias</T>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-border/50">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-medium mb-1"><T>Guías Certificados</T></h4>
            <p className="text-sm text-muted-foreground"><T>Expertos locales</T></p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="font-medium mb-1"><T>100% Seguro</T></h4>
            <p className="text-sm text-muted-foreground"><T>Viajes protegidos</T></p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-medium mb-1"><T>Reserva Fácil</T></h4>
            <p className="text-sm text-muted-foreground"><T>En línea</T></p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="font-medium mb-1"><T>Experiencias Únicas</T></h4>
            <p className="text-sm text-muted-foreground"><T>Personalizadas</T></p>
          </div>
        </div>
      </div>
    </section>
  );
}
