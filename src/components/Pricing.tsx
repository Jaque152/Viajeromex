"use client";

import { useLocale } from 'next-intl';
import { T } from "@/components/T";

export function Pricing() {
  const locale = useLocale();

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">
            <T>Cotiza tu evento</T>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Columna Izquierda: Copywriting */}
          <div className="w-full lg:w-5/12 animate-fade-up delay-100">
            <h3 className="text-2xl font-serif text-foreground mb-6">
              <T>¿Listo para Planear tu Próximo Gran Evento? ¡Cotiza Ahora!</T>
            </h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed mb-10">
              <T>¿Estás soñando con una</T> <strong className="text-foreground font-semibold"><T>fiesta personal inolvidable</T></strong>, <T>un</T> <strong className="text-foreground font-semibold"><T>cumpleaños espectacular</T></strong>, <T>o tal vez una</T> <strong className="text-foreground font-semibold"><T>boda mágica</T></strong>? <T>¿O es momento de impresionar con una</T> <strong className="text-foreground font-semibold"><T>conferencia de negocios impecable</T></strong>, <T>un</T> <strong className="text-foreground font-semibold"><T>lanzamiento de producto dinámico</T></strong>, <T>o una</T> <strong className="text-foreground font-semibold"><T>cena de gala corporativa</T></strong> <T>de primer nivel?</T>
            </p>

            <h4 className="text-xl font-serif text-foreground mb-6"><T>¿Cómo funciona?</T></h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-light mb-12">
              <li className="flex gap-3">
                <span className="text-primary mt-1">•</span>
                <p><strong className="text-foreground font-semibold"><T>Completa el Formulario:</T></strong> <T>Tómate solo unos minutos para darnos la información clave.</T></p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1">•</span>
                <p><strong className="text-foreground font-semibold"><T>Recibe tu Cotización:</T></strong> <T>Recibirás una cotización detallada y sin compromiso.</T></p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1">•</span>
                <p><strong className="text-foreground font-semibold"><T>Procede al pago:</T></strong> <T>En la cotización recibirás un folio y el monto de la misma, aquí encontrarás el botón de pago.</T></p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary mt-1">•</span>
                <p><strong className="text-foreground font-semibold"><T>¡Empecemos a Planear!</T></strong> <T>Una vez pagado, nuestro equipo se encarga de cada detalle para asegurar el éxito total.</T></p>
              </li>
            </ul>

            <button className="border border-foreground text-foreground px-8 py-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors duration-300">
              <T>Proceder al pago</T>
            </button>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="w-full lg:w-7/12 animate-fade-up delay-200">
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-foreground font-medium"><T>Nombre completo</T> <span className="text-primary">*</span></label>
                <input type="text" className="w-full border border-border bg-transparent p-3 text-sm focus:border-foreground outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-foreground font-medium"><T>Teléfono</T> <span className="text-primary">*</span></label>
                  <input type="tel" className="w-full border border-border bg-transparent p-3 text-sm focus:border-foreground outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-foreground font-medium"><T>Email</T> <span className="text-primary">*</span></label>
                  <input type="email" className="w-full border border-border bg-transparent p-3 text-sm focus:border-foreground outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-foreground font-medium"><T>Asistentes</T> <span className="text-primary">*</span></label>
                  <input type="number" className="w-full border border-border bg-transparent p-3 text-sm focus:border-foreground outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-foreground font-medium"><T>Fecha</T> <span className="text-primary">*</span></label>
                  <input type="date" className="w-full border border-border bg-transparent p-3 text-sm focus:border-foreground outline-none transition-colors text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-foreground font-medium"><T>Lugar del evento</T> <span className="text-primary">*</span></label>
                <input type="text" className="w-full border border-border bg-transparent p-3 text-sm focus:border-foreground outline-none transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-foreground font-medium"><T>Especificaciones del evento</T> <span className="text-primary">*</span></label>
                <textarea rows={5} className="w-full border border-border bg-transparent p-3 text-sm focus:border-foreground outline-none transition-colors resize-none"></textarea>
              </div>

              <button type="submit" className="border border-foreground text-foreground px-10 py-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors duration-300">
                <T>Enviar</T>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}