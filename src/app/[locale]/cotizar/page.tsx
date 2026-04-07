"use client";
import { useLocale } from 'next-intl';
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import {
  MapPin, Calendar, Users, Wallet, MessageSquare,
  User, CheckCircle, Sparkles, Loader2, ArrowRight
} from "lucide-react";
import { supabase } from '@/lib/supabase';

const BUDGET_OPTIONS = [
  "Menos de $10,000 MXN",
  "$10,000 - $25,000 MXN",
  "$25,000 - $50,000 MXN",
  "$50,000 - $100,000 MXN",
  "Más de $100,000 MXN",
];

// componente para traducir opciones dinámicas 
function TranslatedOption({ value }: { value: string }) {
  const translatedText = useT(value);
  return <option value={value}>{translatedText}</option>;
}

export default function CotizarPage() {
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quoteCode, setQuoteCode] = useState("");

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 2,
    budget: "",
    requirements: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const phDestination = useT("Ej: Oaxaca, Riviera Maya...");
  const phRequirements = useT("¿Qué experiencias buscas?");
  const phFirstName = useT("Nombre *");
  const phLastName = useT("Apellidos");
  const phEmail = useT("Email *");
  const phPhone = useT("Teléfono *");
  const phSelectRange = useT("Selecciona un rango");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);

    try {
      const customer_name = `${formData.firstName} ${formData.lastName}`.trim();
      const visualQuoteCode = `COT-${Date.now().toString(36).toUpperCase()}`;

      const { error: dbError } = await supabase
        .from('custom_quotes')
        .insert([
          {
            customer_name: customer_name,
            customer_email: formData.email,
            phone: formData.phone,
            destination: formData.destination,
            start_date: formData.startDate,
            end_date: formData.endDate || null,
            pax_qty: formData.travelers,
            budget: formData.budget,
            special_requests: formData.requirements,
            status: 'pending'
          }
        ]);

      if (dbError) throw dbError;

      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'QUOTE',
          locale: locale,
          email: formData.email,
          customerName: formData.firstName,
          destination: formData.destination,
          budget: formData.budget,
          startDate: formData.startDate,
          endDate: formData.endDate || 'No definida',
          travelers: formData.travelers,
          message: formData.requirements || "Solicitud de itinerario personalizado."
        }),
      });

      setQuoteCode(visualQuoteCode);
      setShowSuccess(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      console.error("Error en cotización:", message);
      alert(`Hubo un error: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.destination && formData.startDate &&
    formData.email && formData.firstName && formData.phone;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32 flex items-center justify-center px-4">
          <Card className="max-w-lg w-full border-none shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-serif font-semibold mb-2"><T>¡Solicitud Recibida!</T></h1>
              <p className="text-muted-foreground mb-6">
                <T>Hola</T> <strong>{formData.firstName}</strong>, <T>hemos enviado un correo a</T> <strong>{formData.email}</strong> <T>confirmando tu solicitud.</T>
              </p>
              <div className="p-4 bg-secondary/50 rounded-lg mb-6 text-left border border-border">
                <p className="text-sm text-muted-foreground mb-1"><T>Folio de seguimiento</T></p>
                <p className="font-mono font-semibold text-lg">{quoteCode}</p>
              </div>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 rounded-full">
                <Link href={`/${locale}/`}><T>Volver al Inicio</T></Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/30">
      <Header />
      <main className="flex-1 pt-20">
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 border-primary/30 text-primary bg-white">
              <Sparkles className="w-3 h-3 mr-1" /> <T>Viaje a Tu Medida</T>
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
              <T>Diseñamos tu</T> <span className="text-primary"><T>aventura perfecta</T></span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              <T>Cuéntanos tu idea y crearemos un itinerario único adaptado a ti.</T>
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> <T>Detalles del Viaje</T>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium mb-2 block"><T>¿A dónde quieres ir? *</T></label>
                      <Input value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} placeholder={phDestination} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2"><Calendar className="w-4 h-4" /> <T>Inicio *</T></label>
                      <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} min={minDateStr} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2"><Calendar className="w-4 h-4" /> <T>Regreso</T></label>
                      <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} min={formData.startDate || minDateStr} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2"><Users className="w-4 h-4" /> <T>Viajeros</T></label>
                      <Input type="number" value={formData.travelers} onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })} min={1} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2"><Wallet className="w-4 h-4" /> <T>Presupuesto</T></label>
                      <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                        <option value="">{phSelectRange}</option>
                        {BUDGET_OPTIONS.map((o) => <TranslatedOption key={o} value={o} />)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2"><MessageSquare className="w-4 h-4" /> <T>Requerimientos</T></label>
                      <Textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder={phRequirements} rows={4} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2"><User className="w-5 h-5 text-primary" /> <T>Datos de Contacto</T></h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder={phFirstName} required />
                    <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder={phLastName} />
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={phEmail} required />
                    <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder={phPhone} required />
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" disabled={!isFormValid || isSubmitting} className="w-full h-14 rounded-full text-lg shadow-lg">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                {isSubmitting ? <T>Enviando...</T> : <T>Solicitar Cotización</T>}
              </Button>
            </form>
            <div className="max-w-2xl mx-auto mt-16 pt-12 border-t border-stone-200 text-center">
              <h3 className="text-sm font-bold text-stone-500 tracking-widest uppercase mb-4">
                <T>¿Ya cuentas con una cotización de tu asesor?</T>
              </h3>
              <Button asChild variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all h-12 px-8">
                <Link href={`/${locale}/pago-folio`} className="flex items-center gap-2">
                  <T>Ir a Pagar Folio</T> <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}