"use client";

import { useLocale } from 'next-intl';
import { useState, Suspense, useEffect } from "react";
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
  const { cart, clearCart } = useCart();
  const finalTotal = cart.total;
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [contactInfo, setContactInfo] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  
  const [billingInfo, setBillingInfo] = useState({ 
    pais: "", direccion: "", localidad: "", estado: "", codigo_postal: ""
  });

  const [addNotes, setAddNotes] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  const [cardInfo, setCardInfo] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const locale = useLocale();

  useEffect(() => {
    const savedData = sessionStorage.getItem("explonix_temp_contact");
    if (savedData) {
      const { nombre, email, folio } = JSON.parse(savedData);
      setContactInfo(prev => ({ ...prev, firstName: nombre, email: email }));
      setOrderNotes(`Pago referente al Folio: ${folio}`);
      setAddNotes(true);
      sessionStorage.removeItem("explonix_temp_contact"); 
    }
  }, []);

  const phNombre = useT("Nombre ");
  const phApellidos = useT("Apellidos");
  const phEmail = useT("Email ");
  const phTelefono = useT("Teléfono ");
  const phPais = useT("País / Región ");
  const phDireccion = useT("Dirección completa (Calle y número) ");
  const phLocalidad = useT("Localidad / Ciudad ");
  const phEstado = useT("Región / Estado ");
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
        body: JSON.stringify({ locale, contactInfo, billingInfo, orderNotes: addNotes ? orderNotes : null, cart, cardInfo, formattedTotal: formatPrice(finalTotal), manualFolioData:null })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Error procesando el pago");
      setShowSuccess(true);
      clearCart();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al procesar el pago: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = 
    contactInfo.firstName && contactInfo.email && contactInfo.phone &&
    billingInfo.pais && billingInfo.direccion && billingInfo.localidad && billingInfo.estado && billingInfo.codigo_postal &&
    cardInfo.number.length >= 15 && cardInfo.name && cardInfo.expiry.length === 5 && cardInfo.cvv.length >= 3 &&
    cart.items.length > 0;

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    setCardInfo({ ...cardInfo, expiry: val });
  };

  const inputClass = "h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl px-5 font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium";

  if (showSuccess) {
    return (
      <main className="flex-1 pt-40 pb-24 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-100">
          <div className="w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-cyan-500" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4 text-slate-900"><T>¡Pago Exitoso!</T></h1>
          <p className="text-slate-500 font-medium mb-10 text-lg"><T>Tu transacción ha sido confirmada y tu aventura está lista.</T></p>
          <Button asChild className="w-full bg-slate-900 hover:bg-primary text-white font-black rounded-2xl h-16 text-lg transition-colors">
            <Link href={`/${locale}/`}><T>Volver al Inicio</T></Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900"><T>Checkout</T></h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            {/* Panel Contacto */}
            <div className="bg-white p-8 md:p-10 border border-slate-100 shadow-sm rounded-[2rem]">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900 tracking-tight">
                <div className="p-2 bg-primary/10 rounded-lg"><User className="text-primary w-5 h-5"/></div>
                <T>Datos de Contacto</T>
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input value={contactInfo.firstName} onChange={(e)=>setContactInfo({...contactInfo, firstName:e.target.value})} placeholder={phNombre} required className={inputClass} />
                <Input value={contactInfo.lastName} onChange={(e)=>setContactInfo({...contactInfo, lastName:e.target.value})} placeholder={phApellidos} className={inputClass} />
                <Input type="email" value={contactInfo.email} onChange={(e)=>setContactInfo({...contactInfo, email:e.target.value})} placeholder={phEmail} required className={inputClass} />
                <Input type="tel" value={contactInfo.phone} onChange={(e)=>setContactInfo({...contactInfo, phone:e.target.value})} placeholder={phTelefono} required className={inputClass} />
              </div>
            </div>
              
            {/* Panel Facturación */}
            <div className="bg-white p-8 md:p-10 border border-slate-100 shadow-sm rounded-[2rem]">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900 tracking-tight">
                <div className="p-2 bg-primary/10 rounded-lg"><FileText className="text-primary w-5 h-5"/></div>
                <T>Dirección de Facturación</T>
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Input placeholder={phPais} required value={billingInfo.pais} onChange={(e)=>setBillingInfo({...billingInfo, pais:e.target.value})} className={`sm:col-span-2 ${inputClass}`} />
                <Input placeholder={phDireccion} required value={billingInfo.direccion} onChange={(e)=>setBillingInfo({...billingInfo, direccion:e.target.value})} className={`sm:col-span-2 ${inputClass}`} />
                <Input placeholder={phLocalidad} required value={billingInfo.localidad} onChange={(e)=>setBillingInfo({...billingInfo, localidad:e.target.value})} className={inputClass} />
                <Input placeholder={phEstado} required value={billingInfo.estado} onChange={(e)=>setBillingInfo({...billingInfo, estado:e.target.value})} className={inputClass} />
                <Input placeholder={phCP} required value={billingInfo.codigo_postal} onChange={(e)=>setBillingInfo({...billingInfo, codigo_postal:e.target.value})} className={inputClass} />
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100">
                <label className="flex items-center gap-4 cursor-pointer text-slate-700 font-bold text-sm">
                  <div className="relative flex items-center">
                    <input type="checkbox" checked={addNotes} onChange={(e)=>setAddNotes(e.target.checked)} className="peer w-5 h-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 checked:border-primary checked:bg-primary transition-all" />
                    <CheckCircle className="absolute w-3 h-3 text-white left-1 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <T>Añadir nota al pedido (Opcional)</T>
                </label>
                
                {addNotes && (
                  <div className="mt-6 animate-fade-up">
                    <Textarea 
                      placeholder={phNotas} value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}
                      className="bg-slate-50 border-none min-h-[120px] font-medium text-slate-700 focus-visible:ring-2 focus-visible:ring-primary rounded-xl px-5 py-4 resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Panel Pago */}
            <div className="bg-slate-900 p-8 md:p-10 shadow-xl shadow-primary/10 rounded-[2rem] relative overflow-hidden text-white">
              <div className="absolute -top-20 -right-20 p-6 opacity-[0.03] pointer-events-none">
                <CreditCard className="w-[400px] h-[400px]" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                  <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                    <div className="p-2 bg-cyan-400/20 rounded-lg"><CreditCard className="text-cyan-400 w-5 h-5" /></div>
                    <T>Método de Pago</T>
                  </h2>
                  <div className="h-8 opacity-90 bg-white/10 px-4 py-1.5 rounded-lg backdrop-blur-md">
                     <img src="/logo-keycop-2.png" alt="Powered by Keycop" className="h-full object-contain brightness-0 invert" />
                  </div>
                </div>
                  
                <div className="grid gap-5 max-w-md">
                  <Input placeholder={phTarjeta} required maxLength={19} value={cardInfo.number} onChange={(e)=>setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '')})} className="bg-white/10 border-none h-14 font-mono text-lg tracking-widest focus-visible:ring-cyan-400 rounded-xl px-5 text-white placeholder:text-white/30" />
                  <Input placeholder={phNombreTarjeta} required value={cardInfo.name} onChange={(e)=>setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})} className="bg-white/10 border-none h-14 font-bold focus-visible:ring-cyan-400 rounded-xl px-5 text-white placeholder:text-white/30" />
                  <div className="grid grid-cols-2 gap-5">
                    <Input placeholder={phFecha} required maxLength={5} value={cardInfo.expiry} onChange={handleExpiryChange} className="bg-white/10 border-none h-14 font-bold text-center focus-visible:ring-cyan-400 rounded-xl text-white placeholder:text-white/30" />
                    <Input placeholder={phCvv} type="password" required maxLength={4} value={cardInfo.cvv} onChange={(e)=>setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})} className="bg-white/10 border-none h-14 font-mono text-center tracking-widest focus-visible:ring-cyan-400 rounded-xl text-white placeholder:text-white/30" />
                  </div>
                  
                  <div className="flex items-center gap-4 mt-6">
                    <ShieldCheck className="w-6 h-6 text-cyan-400" />
                    <p className="text-xs font-bold text-white/50 tracking-wide"><T>Tus datos están protegidos y encriptados de extremo a extremo.</T></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          <div className="lg:col-span-4">
            <div className="bg-white p-8 lg:p-10 sticky top-32 border border-slate-100 shadow-xl rounded-[2.5rem]">
              <h2 className="text-xl font-black mb-8 text-slate-900 border-b border-slate-100 pb-6 tracking-tight"><T>Resumen de Compra</T></h2>
              
              <div className="space-y-6 mb-10">
                {cart.items.length === 0 ? (
                  <p className="text-slate-400 font-medium"><T>Tu carrito está vacío.</T></p>
                ) : (
                  cart.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm items-start gap-4">
                      <span className="text-slate-500 font-medium leading-relaxed">
                        <T>{item.experience.title}</T> <span className="font-black text-slate-900 block mt-1">x{item.people} <T>personas</T></span>
                      </span>
                      <span className="font-black text-slate-900">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-100 pt-8">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-slate-400 font-black uppercase tracking-widest text-sm"><T>Total</T></span>
                  <div className="text-right">
                    <div className="text-3xl font-black text-primary">{formatPrice(finalTotal)}</div>
                    <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest"><T>IVA incluido</T></div>
                  </div>
                </div>
                
                <Button type="submit" disabled={!isFormValid || isProcessing} className="w-full bg-primary hover:bg-slate-900 text-white font-black h-16 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.3)] transition-all text-lg group">
                  {isProcessing ? <Loader2 className="animate-spin w-5 h-5 mr-3" /> : <Lock className="w-5 h-5 mr-3" />}
                  {isProcessing ? textProcesando : `${textPagar} ${formatPrice(finalTotal)}`}
                </Button>
              </div>
            </div>
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