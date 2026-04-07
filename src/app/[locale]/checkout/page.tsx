"use client";

import { useLocale } from 'next-intl';
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { CheckCircle, Loader2, User, FileText, Lock, CreditCard, ShieldCheck } from "lucide-react";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const manualFolio = searchParams.get("folio");
  const manualMonto = searchParams.get("monto");
  const { cart, clearCart } = useCart();
  
  const isManualPayment = Boolean(manualFolio && manualMonto);
  const finalTotal = isManualPayment ? parseFloat(manualMonto as string) : cart.total;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const [contactInfo, setContactInfo] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  
  const [billingInfo, setBillingInfo] = useState({ 
    pais: "", // Corregido: Ahora inicia vacío
    direccion: "", 
    localidad: "", 
    estado: "", 
    codigo_postal: ""
  });

  const [addNotes, setAddNotes] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  const [cardInfo, setCardInfo] = useState({
    number: "", name: "", expiry: "", cvv: ""
  });

  const locale = useLocale();

  const phNombre = useT("Nombre ");
  const phApellidos = useT("Apellidos");
  const phEmail = useT("Email ");
  const phTelefono = useT("Teléfono ");
  const phPais = useT("País / Región ");
  const phDireccion = useT("Dirección completa (Calle y número) ");
  const phLocalidad = useT("Localidad / Ciudad ");
  const phEstado = useT("Región / Estado *");
  const phCP = useT("Código Postal ");
  const phTarjeta = useT("Número de tarjeta ");
  const phNombreTarjeta = useT("Nombre en la tarjeta ");
  const phFecha = useT("MM/AA ");
  const phCvv = useT("CVV ");
  const textProcesando = useT("Procesando pago...");
  const textPagar = useT("Pagar");
  const phNotas = useT("Ej: Alergias alimentarias, etc.");

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: locale,
          contactInfo,
          billingInfo,
          orderNotes: addNotes ? orderNotes : null,
          cart: isManualPayment ? { items: [], total: finalTotal } : cart,
          cardInfo,
          formattedTotal: formatPrice(finalTotal), 
          manualFolioData: isManualPayment ? { folio: manualFolio, amount: finalTotal } : null
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error procesando el pago");
      }

      setConfirmationCode(data.visualCode);
      setShowSuccess(true);
      if (!isManualPayment) {
        clearCart();
      }
      
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al procesar el pago: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = 
    contactInfo.firstName && contactInfo.email && contactInfo.phone &&
    billingInfo.pais && billingInfo.direccion && billingInfo.localidad && billingInfo.estado && billingInfo.codigo_postal &&
    cardInfo.number.length >= 15 && cardInfo.name && cardInfo.expiry.length === 5 && cardInfo.cvv.length >= 3;

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    setCardInfo({ ...cardInfo, expiry: val });
  };

  if (showSuccess) {
    return (
      <main className="flex-1 pt-32 flex items-center justify-center px-4">
        <Card className="max-w-lg w-full text-center p-10 shadow-2xl border-none">
          <CheckCircle className="w-20 h-20 text-lime-600 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground"><T>¡Pago Exitoso!</T></h1>
          <p className="text-muted-foreground mb-2 text-lg"><T>Tu transacción ha sido confirmada.</T></p>
          <p className="mb-8 text-muted-foreground"><T>Código de confirmación:</T> <span className="font-mono font-bold text-xl text-foreground ml-2">{confirmationCode}</span></p>
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-14 text-lg">
            <Link href={`/${locale}/`}><T>Volver al Inicio</T></Link>
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 md:p-8 border-border shadow-sm rounded-2xl">
              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3 text-foreground">
                <User className="text-primary w-6 h-6"/> <T>Datos de Contacto</T>
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input value={contactInfo.firstName} onChange={(e)=>setContactInfo({...contactInfo, firstName:e.target.value})} placeholder={phNombre} required className="bg-background border-border h-12 text-sm focus-visible:ring-primary rounded-xl" />
                <Input value={contactInfo.lastName} onChange={(e)=>setContactInfo({...contactInfo, lastName:e.target.value})} placeholder={phApellidos} className="bg-background border-border h-12 text-sm focus-visible:ring-primary rounded-xl" />
                <Input type="email" value={contactInfo.email} onChange={(e)=>setContactInfo({...contactInfo, email:e.target.value})} placeholder={phEmail} required className="bg-background border-border h-12 text-sm focus-visible:ring-primary rounded-xl" />
                <Input type="tel" value={contactInfo.phone} onChange={(e)=>setContactInfo({...contactInfo, phone:e.target.value})} placeholder={phTelefono} required className="bg-background border-border h-12 text-sm focus-visible:ring-primary rounded-xl" />
              </div>
            </Card>
              
            <Card className="p-6 md:p-8 border-border shadow-sm rounded-2xl">
              <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3 text-foreground">
                <FileText className="text-primary w-6 h-6"/> <T>Dirección de Facturación</T>
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input placeholder={phPais} required value={billingInfo.pais} onChange={(e)=>setBillingInfo({...billingInfo, pais:e.target.value})} className="sm:col-span-2 bg-background border-border h-12 text-sm focus-visible:ring-primary rounded-xl" />
                <Input placeholder={phDireccion} required value={billingInfo.direccion} onChange={(e)=>setBillingInfo({...billingInfo, direccion:e.target.value})} className="sm:col-span-2 bg-background border-border h-12 text-sm focus-visible:ring-primary rounded-xl" />
                <Input placeholder={phLocalidad} required value={billingInfo.localidad} onChange={(e)=>setBillingInfo({...billingInfo, localidad:e.target.value})} className="bg-background border-border h-12 text-sm focus-visible:ring-primary rounded-xl" />
                <Input placeholder={phEstado} required value={billingInfo.estado} onChange={(e)=>setBillingInfo({...billingInfo, estado:e.target.value})} className="bg-background border-border h-12 text-sm focus-visible:ring-primary rounded-xl" />
                <Input placeholder={phCP} required value={billingInfo.codigo_postal} onChange={(e)=>setBillingInfo({...billingInfo, codigo_postal:e.target.value})} className="bg-background border-border h-12 text-sm focus-visible:ring-primary rounded-xl" />
              </div>

              <div className="mt-8 border-t border-border pt-6">
                 <label className="flex items-center gap-3 cursor-pointer text-foreground font-medium text-sm">
                  <input type="checkbox" checked={addNotes} onChange={(e)=>setAddNotes(e.target.checked)} className="rounded text-primary focus:ring-primary w-4 h-4" /> 
                  <T>Añadir nota al pedido (Opcional)</T>
                </label>
                
                {addNotes && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <Textarea 
                      placeholder={phNotas}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="bg-background border-border min-h-[120px] text-sm focus-visible:ring-primary rounded-xl resize-none"
                    />
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 md:p-8 border-border shadow-sm rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <CreditCard className="w-40 h-40" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif font-bold flex items-center gap-3 text-foreground">
                      <CreditCard className="text-primary w-6 h-6"/> <T>Método de Pago</T>
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                      <Lock className="w-3.5 h-3.5" /> <T>PAGO SEGURO</T>
                    </div>
                  </div>
                  
                  <div className="grid gap-5 max-w-md">
                    <Input placeholder={phTarjeta} required maxLength={19} value={cardInfo.number} onChange={(e)=>setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '')})} className="bg-background border-border h-12 font-mono text-lg tracking-widest focus-visible:ring-primary rounded-xl" />
                    <Input placeholder={phNombreTarjeta} required value={cardInfo.name} onChange={(e)=>setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})} className="bg-background border-border h-12 text-sm focus-visible:ring-primary rounded-xl" />
                    <div className="grid grid-cols-2 gap-5">
                      <Input placeholder={phFecha} required maxLength={5} value={cardInfo.expiry} onChange={handleExpiryChange} className="bg-background border-border h-12 text-sm text-center focus-visible:ring-primary rounded-xl" />
                      <Input placeholder={phCvv} type="password" required maxLength={4} value={cardInfo.cvv} onChange={(e)=>setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})} className="bg-background border-border h-12 text-sm text-center tracking-widest focus-visible:ring-primary rounded-xl" />
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-4"><T>Tus datos están protegidos y encriptados de extremo a extremo.</T></p>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              {isManualPayment ? (
                 <Card className="sticky top-28 border-border shadow-2xl rounded-2xl overflow-hidden">
                  <div className="bg-card p-8 text-foreground flex flex-col justify-between relative overflow-hidden border-b border-border">
                    <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary/10 rounded-full blur-[60px] opacity-60"></div>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-serif font-bold leading-tight mb-3 text-foreground">
                        <T>Pago de</T> <span className="text-primary italic"><T>Cotización</T></span>
                      </h2>
                      <div className="w-10 h-1.5 bg-primary mb-6 rounded-full"></div>
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest"><T>FOLIO DE SEGUIMIENTO</T></p>
                        <p className="font-mono text-xl text-foreground bg-background inline-block px-3 py-1.5 rounded-md shadow-sm border border-border">{manualFolio}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8 bg-background">
                    <div className="flex justify-between items-end text-xl font-bold text-foreground mb-8 border-b border-border pb-6">
                      <span className="font-serif"><T>Total a Pagar</T></span>
                      <div className="text-right">
                        <div className="text-2xl text-primary">{formatPrice(finalTotal)}</div>
                        <div className="text-xs font-medium text-muted-foreground mt-1"><T>IVA incluido</T></div>
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={!isFormValid || isProcessing} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-xl shadow-lg transition-all text-lg">
                      {isProcessing ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                      {isProcessing ? textProcesando : `${textPagar} ${formatPrice(finalTotal)}`}
                    </Button>
                  </CardContent>
                 </Card>
              ) : (
                <Card className="p-8 sticky top-28 border-border shadow-2xl rounded-2xl">
                  <h2 className="text-2xl font-serif font-bold mb-6 text-foreground border-b border-border pb-4"><T>Resumen de Compra</T></h2>
                  
                  <div className="space-y-4 mb-8">
                    {cart.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm items-start">
                        <span className="text-muted-foreground pr-4 leading-relaxed"><T>{item.experience.title}</T> <span className="font-semibold text-foreground">(x{item.people})</span></span>
                        <span className="font-bold text-foreground">{formatPrice(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-6 mt-6">
                    <div className="flex justify-between items-end text-xl font-bold text-foreground mb-8">
                      <span className="font-serif"><T>Total</T></span>
                      <div className="text-right">
                        <div className="text-2xl text-primary">{formatPrice(finalTotal)}</div>
                        <div className="text-xs font-medium text-muted-foreground mt-1"><T>IVA incluido</T></div>
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={!isFormValid || isProcessing} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 rounded-xl shadow-lg transition-all text-lg">
                      {isProcessing ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Lock className="w-5 h-5 mr-2" />}
                      {isProcessing ? textProcesando : `${textPagar} ${formatPrice(finalTotal)}`}
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </form>
        </div>
      </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin w-10 h-10 text-primary" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </div>
  );
}