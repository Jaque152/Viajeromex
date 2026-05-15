"use client";

import { useLocale } from 'next-intl';
import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { CheckCircle, Loader2, User, FileText, Lock, CreditCard, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
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

  const phNombre = useT("Nombre");
  const phApellidos = useT("Apellidos");
  const phEmail = useT("Email");
  const phTelefono = useT("Teléfono");
  const phPais = useT("País");
  const phDireccion = useT("Dirección");
  const phLocalidad = useT("Ciudad");
  const phEstado = useT("Estado");
  const phCP = useT("C.P.");
  const phTarjeta = useT("Número de tarjeta");
  const phNombreTarjeta = useT("Nombre en tarjeta");
  const phFecha = useT("MM/AA");
  const phCvv = useT("CVV");
  const textProcesando = useT("Cocinando pago...");
  const textPagar = useT("Confirmar Pago");

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

  const bentoInput = "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-foreground font-bold focus:border-secondary focus:bg-white transition-all outline-none placeholder:text-muted-foreground/60";

  if (showSuccess) {
    return (
      <main className="flex-1 pt-40 pb-24 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center bg-white border-4 border-accent/20 rounded-[3rem] p-16 shadow-2xl animate-bounce-up">
          <div className="w-24 h-24 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-accent/30">
            <CheckCircle className="w-12 h-12" strokeWidth={3} />
          </div>
          <h1 className="text-5xl font-black font-bricolage mb-4 text-foreground"><T>¡Buen Provecho!</T></h1>
          <p className="text-muted-foreground font-medium mb-10 text-xl leading-relaxed"><T>Tu pago ha sido confirmado. Hemos enviado tu itinerario culinario a tu correo electrónico.</T></p>
          <Link href={`/${locale}/`} className="btn-3d bg-slate-900 text-white font-black rounded-2xl px-10 py-5 text-lg transition-colors inline-block">
            <T>Volver al Inicio</T>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="mb-12 animate-bounce-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-3 font-black text-[10px] uppercase tracking-widest border border-primary/20">
            <Lock className="w-3 h-3" />
            <T>Paso Seguro</T>
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-bricolage text-foreground tracking-tight"><T>Checkout</T></h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-8 animate-bounce-up delay-100">
            
            {/* Panel Contacto Bento */}
            <div className="bg-white p-8 md:p-10 border-2 border-slate-100 shadow-xl shadow-slate-200/50 rounded-[3rem]">
              <h2 className="text-2xl font-black font-bricolage mb-8 flex items-center gap-3 text-foreground tracking-tight">
                <div className="p-2 bg-primary/10 rounded-xl"><User className="text-primary w-5 h-5" strokeWidth={2.5}/></div>
                <T>¿Quién viaja?</T>
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <input value={contactInfo.firstName} onChange={(e)=>setContactInfo({...contactInfo, firstName:e.target.value})} placeholder={phNombre} required className={bentoInput} />
                <input value={contactInfo.lastName} onChange={(e)=>setContactInfo({...contactInfo, lastName:e.target.value})} placeholder={phApellidos} className={bentoInput} />
                <input type="email" value={contactInfo.email} onChange={(e)=>setContactInfo({...contactInfo, email:e.target.value})} placeholder={phEmail} required className={bentoInput} />
                <input type="tel" value={contactInfo.phone} onChange={(e)=>setContactInfo({...contactInfo, phone:e.target.value})} placeholder={phTelefono} required className={bentoInput} />
              </div>
            </div>
              
            {/* Panel Facturación Bento */}
            <div className="bg-white p-8 md:p-10 border-2 border-slate-100 shadow-xl shadow-slate-200/50 rounded-[3rem]">
              <h2 className="text-2xl font-black font-bricolage mb-8 flex items-center gap-3 text-foreground tracking-tight">
                <div className="p-2 bg-secondary/10 rounded-xl"><FileText className="text-secondary w-5 h-5" strokeWidth={2.5}/></div>
                <T>Datos de Facturación</T>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <input placeholder={phPais} required value={billingInfo.pais} onChange={(e)=>setBillingInfo({...billingInfo, pais:e.target.value})} className={`md:col-span-12 ${bentoInput}`} />
                <input placeholder={phDireccion} required value={billingInfo.direccion} onChange={(e)=>setBillingInfo({...billingInfo, direccion:e.target.value})} className={`md:col-span-12 ${bentoInput}`} />
                <input placeholder={phLocalidad} required value={billingInfo.localidad} onChange={(e)=>setBillingInfo({...billingInfo, localidad:e.target.value})} className={`md:col-span-4 ${bentoInput}`} />
                <input placeholder={phEstado} required value={billingInfo.estado} onChange={(e)=>setBillingInfo({...billingInfo, estado:e.target.value})} className={`md:col-span-4 ${bentoInput}`} />
                <input placeholder={phCP} required value={billingInfo.codigo_postal} onChange={(e)=>setBillingInfo({...billingInfo, codigo_postal:e.target.value})} className={`md:col-span-4 ${bentoInput}`} />
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100">
                <label className="flex items-center gap-4 cursor-pointer text-foreground font-black text-sm group">
                  <input type="checkbox" checked={addNotes} onChange={(e)=>setAddNotes(e.target.checked)} className="w-5 h-5 accent-primary rounded-lg" />
                  <T>Añadir peticiones especiales o alergias</T>
                </label>
                
                {addNotes && (
                  <textarea 
                    placeholder="Ej: Soy alérgico a los mariscos, mesa cerca de la ventana..." value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}
                    className={`${bentoInput} mt-6 min-h-[120px] resize-none`}
                  />
                )}
              </div>
            </div>

            {/* Panel Pago Estilo Tarjeta VIP */}
            <div className="bg-slate-900 p-8 md:p-12 shadow-2xl shadow-primary/20 rounded-[3.5rem] relative overflow-hidden text-white border-4 border-slate-800">
              <div className="absolute -top-20 -right-20 p-6 opacity-[0.05] pointer-events-none rotate-12">
                <CreditCard className="w-[400px] h-[400px]" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                  <h2 className="text-3xl font-black font-bricolage flex items-center gap-4 tracking-tight">
                    <div className="p-3 bg-accent/20 rounded-2xl"><CreditCard className="text-accent w-7 h-7" strokeWidth={2.5} /></div>
                    <T>Método de Pago</T>
                  </h2>
                  <div className="h-8 opacity-90 grayscale brightness-200">
                     <img src="/logo-keycop-2.png" alt="Keycop" className="h-full object-contain" />
                  </div>
                </div>
                  
                <div className="grid gap-6 max-w-lg">
                  <div className="relative">
                    <input placeholder={phTarjeta} required maxLength={19} value={cardInfo.number} onChange={(e)=>setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '')})} className="bg-white/10 border-2 border-white/5 rounded-2xl h-16 font-mono text-xl tracking-[0.2em] focus:bg-white/20 focus:border-accent transition-all w-full px-6 text-white placeholder:text-white/20" />
                    <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20" />
                  </div>
                  <input placeholder={phNombreTarjeta} required value={cardInfo.name} onChange={(e)=>setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})} className="bg-white/10 border-2 border-white/5 rounded-2xl h-16 font-bold focus:bg-white/20 focus:border-accent transition-all w-full px-6 text-white placeholder:text-white/20" />
                  <div className="grid grid-cols-2 gap-6">
                    <input placeholder={phFecha} required maxLength={5} value={cardInfo.expiry} onChange={handleExpiryChange} className="bg-white/10 border-2 border-white/5 rounded-2xl h-16 font-bold text-center focus:bg-white/20 focus:border-accent transition-all text-white placeholder:text-white/20" />
                    <input placeholder={phCvv} type="password" required maxLength={4} value={cardInfo.cvv} onChange={(e)=>setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})} className="bg-white/10 border-2 border-white/5 rounded-2xl h-16 font-mono text-center tracking-widest focus:bg-white/20 focus:border-accent transition-all text-white placeholder:text-white/20" />
                  </div>
                  
                  <div className="flex items-center gap-4 mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <ShieldCheck className="w-8 h-8 text-accent shrink-0" strokeWidth={2.5} />
                    <p className="text-[11px] font-black text-white/50 tracking-wide uppercase"><T>Tus datos están protegidos por encriptación bancaria de grado militar.</T></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          {/* Sidebar Resumen */}
          <div className="lg:col-span-4 animate-bounce-up delay-200">
            <div className="bg-white p-8 lg:p-10 sticky top-32 border-2 border-slate-100 shadow-2xl shadow-slate-200 rounded-[3rem]">
              <h2 className="text-2xl font-black font-bricolage mb-8 text-foreground border-b-2 border-slate-50 pb-6 tracking-tight flex items-center gap-3">
                 <Sparkles className="w-5 h-5 text-primary" />
                 <T>Tu Itinerario</T>
              </h2>
              
              <div className="space-y-6 mb-10">
                {cart.items.length === 0 ? (
                  <p className="text-muted-foreground font-medium"><T>No hay rutas seleccionadas.</T></p>
                ) : (
                  cart.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start gap-4">
                      <span className="text-muted-foreground font-medium text-sm leading-snug">
                        <span className="font-black text-foreground block"><T>{item.experience.title}</T></span>
                        <span className="text-xs">x{item.people} <T>asistentes</T></span>
                      </span>
                      <span className="font-black text-foreground text-sm">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t-2 border-slate-50 pt-8">
                <div className="flex justify-between items-end mb-10">
                  <span className="text-primary font-black uppercase tracking-widest text-[10px] mb-2"><T>Total a Pagar</T></span>
                  <div className="text-right">
                    <div className="text-4xl font-black font-bricolage text-secondary leading-none">{formatPrice(finalTotal)}</div>
                    <div className="text-[9px] font-black text-muted-foreground mt-2 uppercase tracking-widest leading-none"><T>IVA incluido</T></div>
                  </div>
                </div>
                
                <button type="submit" disabled={!isFormValid || isProcessing} className="btn-3d w-full bg-secondary text-white font-black h-20 rounded-[2rem] shadow-xl shadow-secondary/20 transition-all text-xl group flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed">
                  {isProcessing ? <Loader2 className="animate-spin w-7 h-7" strokeWidth={3} /> : <ArrowRight className="w-7 h-7" strokeWidth={3} />}
                  {isProcessing ? textProcesando : textPagar}
                </button>
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
          <Loader2 className="animate-spin w-12 h-12 text-primary" strokeWidth={3} />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </div>
  );
}