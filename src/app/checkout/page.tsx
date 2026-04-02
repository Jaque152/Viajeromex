"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { CheckCircle, Loader2, User, FileText, Lock, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const manualFolio = searchParams.get("folio");
  const manualMonto = searchParams.get("monto");

  const { cart, clearCart } = useCart();
  
  // Condicional estricto para saber si es un pago manual
  const isManualPayment = Boolean(manualFolio && manualMonto);
  const finalTotal = isManualPayment ? parseFloat(manualMonto as string) : cart.total;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const [contactInfo, setContactInfo] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [needsInvoice, setNeedsInvoice] = useState(false);
  
  const [billingInfo, setBillingInfo] = useState({ 
    rfc: "", razon_social: "", direccion_facturacion: "", 
    ciudad_facturacion: "", estado_facturacion: "", codigo_postal_facturacion: ""
  });

  const [cardInfo, setCardInfo] = useState({
    number: "", name: "", expiry: "", cvv: ""
  });

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Enviar a backend seguro (/api/checkout)
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactInfo,
          billingInfo,
          needsInvoice,
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

      // 2. Si todo salió bien, mostrar el éxito
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

  const isFormValid = contactInfo.firstName && contactInfo.email && contactInfo.phone &&
    cardInfo.number.length >= 15 && cardInfo.name && cardInfo.expiry.length === 5 && cardInfo.cvv.length >= 3;

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    setCardInfo({ ...cardInfo, expiry: val });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Header />
        <main className="flex-1 pt-32 flex items-center justify-center px-4">
          <Card className="max-w-lg w-full text-center p-10 shadow-2xl">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-serif font-bold mb-3">¡Pago Exitoso!</h1>
            <p className="text-stone-600 mb-2">Tu reservación ha sido confirmada.</p>
            <p className="mb-8">Código: <span className="font-mono font-bold text-lg">{confirmationCode}</span></p>
            <Button asChild className="w-full bg-orange-400 hover:bg-orange-500 rounded-full h-12 text-lg"><Link href="/">Volver al Inicio</Link></Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              <Card className="p-6 border-stone-200 shadow-sm">
                <h2 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2 text-stone-800">
                  <User className="text-orange-600 w-5 h-5"/> Datos de Contacto
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input value={contactInfo.firstName} onChange={(e)=>setContactInfo({...contactInfo, firstName:e.target.value})} placeholder="Nombre *" required className="bg-white" />
                  <Input value={contactInfo.lastName} onChange={(e)=>setContactInfo({...contactInfo, lastName:e.target.value})} placeholder="Apellidos" className="bg-white" />
                  <Input type="email" value={contactInfo.email} onChange={(e)=>setContactInfo({...contactInfo, email:e.target.value})} placeholder="Email *" required className="bg-white" />
                  <Input type="tel" value={contactInfo.phone} onChange={(e)=>setContactInfo({...contactInfo, phone:e.target.value})} placeholder="Teléfono *" required className="bg-white" />
                </div>
              </Card>
              
              <Card className="p-6 border-stone-200 shadow-sm">
                <h2 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2 text-stone-800">
                  <FileText className="text-orange-600 w-5 h-5"/> Facturación
                </h2>
                <label className="flex items-center gap-2 mb-4 cursor-pointer text-stone-600">
                  <input type="checkbox" checked={needsInvoice} onChange={(e)=>setNeedsInvoice(e.target.checked)} className="rounded text-orange-600 focus:ring-orange-500" /> 
                  Requiero factura
                </label>
                
                {needsInvoice && (
                  <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    <Input placeholder="RFC *" required={needsInvoice} value={billingInfo.rfc} onChange={(e)=>setBillingInfo({...billingInfo, rfc:e.target.value})} className="bg-white" />
                    <Input placeholder="Razón Social *" required={needsInvoice} value={billingInfo.razon_social} onChange={(e)=>setBillingInfo({...billingInfo, razon_social:e.target.value})} className="bg-white" />
                    <Input className="sm:col-span-2 bg-white" placeholder="Dirección Completa (Calle y número) *" required={needsInvoice} value={billingInfo.direccion_facturacion} onChange={(e)=>setBillingInfo({...billingInfo, direccion_facturacion:e.target.value})} />
                    <Input placeholder="Ciudad *" required={needsInvoice} value={billingInfo.ciudad_facturacion} onChange={(e)=>setBillingInfo({...billingInfo, ciudad_facturacion:e.target.value})} className="bg-white" />
                    <Input placeholder="Estado *" required={needsInvoice} value={billingInfo.estado_facturacion} onChange={(e)=>setBillingInfo({...billingInfo, estado_facturacion:e.target.value})} className="bg-white" />
                    <Input placeholder="Código Postal *" required={needsInvoice} value={billingInfo.codigo_postal_facturacion} onChange={(e)=>setBillingInfo({...billingInfo, codigo_postal_facturacion:e.target.value})} className="bg-white" />
                  </div>
                )}
              </Card>

              <Card className="p-6 border-stone-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  <CreditCard className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif font-semibold flex items-center gap-2 text-stone-800">
                      <CreditCard className="text-orange-600 w-5 h-5"/> Método de Pago
                    </h2>
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-md">
                      <Lock className="w-3 h-3" /> PAGO SEGURO
                    </div>
                  </div>
                  
                  <div className="grid gap-4 max-w-md">
                    <Input placeholder="Número de Tarjeta *" required maxLength={19} value={cardInfo.number} onChange={(e)=>setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '')})} className="bg-white font-mono text-lg tracking-widest" />
                    <Input placeholder="Nombre en la tarjeta *" required value={cardInfo.name} onChange={(e)=>setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})} className="bg-white" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="MM/AA *" required maxLength={5} value={cardInfo.expiry} onChange={handleExpiryChange} className="bg-white text-center" />
                      <Input placeholder="CVV *" type="password" required maxLength={4} value={cardInfo.cvv} onChange={(e)=>setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})} className="bg-white text-center tracking-widest" />
                    </div>
                    <p className="text-[10px] text-stone-400 text-center mt-2">Tus datos están protegidos y encriptados de extremo a extremo.</p>
                  </div>
                </div>
              </Card>

            </div>
            
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-28 border-stone-200 shadow-xl">
                <h2 className="text-xl font-serif font-semibold mb-6 text-stone-800">Resumen de Compra</h2>
                
                <div className="space-y-3 mb-6">
                  {isManualPayment ? (
                    <div className="flex justify-between items-center text-sm border-b border-stone-100 pb-3">
                      <div>
                        <span className="font-bold text-stone-800 block">Pago de Cotización</span>
                        <span className="text-xs text-orange-600 font-mono font-bold tracking-widest">FOLIO: {manualFolio}</span>
                      </div>
                      <span className="font-bold text-stone-900">{formatPrice(finalTotal)}</span>
                    </div>
                  ) : (
                    cart.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-stone-600 truncate pr-4">{item.experience.title} (x{item.people})</span>
                        <span className="font-medium text-stone-900">{formatPrice(item.totalPrice)}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-stone-100 pt-4 mt-4">
                  <div className="flex justify-between items-end text-xl font-bold text-orange-700 mb-6">
                    <span>Total a Pagar</span>
                    <div className="text-right">
                      <div>{formatPrice(finalTotal)}</div>
                      <div className="text-xs font-normal text-stone-500">IVA incluido</div>
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={!isFormValid || isProcessing} className="w-full bg-orange-600 hover:bg-orange-700 text-white h-14 rounded-full shadow-lg shadow-orange-200 gap-2 text-lg transition-all">
                    {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    {isProcessing ? "Procesando pago..." : `Pagar ${formatPrice(finalTotal)}`}
                  </Button>
                </div>
              </Card>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}