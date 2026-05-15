"use client";

import { useLocale } from 'next-intl';
import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { CheckCircle, Loader2, Lock, ShieldCheck } from "lucide-react";
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
  const phPais = useT("País / Región");
  const phDireccion = useT("Dirección completa (Calle y número)");
  const phLocalidad = useT("Localidad / Ciudad");
  const phEstado = useT("Región / Estado");
  const phCP = useT("Código Postal");
  const phTarjeta = useT("Número de tarjeta");
  const phNombreTarjeta = useT("Nombre en la tarjeta");
  const phFecha = useT("MM/AA");
  const phCvv = useT("CVV");
  const textProcesando = useT("Procesando pago...");
  const textPagar = useT("Completar Reserva");
  const phNotas = useT("Ej: Alergias alimentarias, peticiones especiales...");

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 }).format(price);
  
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

  const inputClass = "w-full bg-transparent border-b border-border py-3 text-sm text-foreground focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/60";
  const labelClass = "text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-1";

  if (showSuccess) {
    return (
      <main className="flex-1 pt-40 pb-24 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center bg-white border border-border p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] animate-fade-in-up">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-8" strokeWidth={1} />
          <h1 className="text-4xl md:text-5xl font-serif mb-6 text-foreground"><T>Reserva Confirmada</T></h1>
          <p className="text-muted-foreground font-light mb-12 text-lg"><T>Su pago ha sido procesado exitosamente. Hemos enviado los detalles de su itinerario por correo electrónico.</T></p>
          <Link href={`/${locale}/`} className="inline-block bg-foreground text-background px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors">
            <T>Volver al Inicio</T>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl animate-fade-in-up">
        
        <div className="mb-16 border-b border-border pb-8">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-secondary mb-4 block"><T>Paso Final</T></span>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground"><T>Finalizar Compra</T></h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-7 xl:col-span-8 space-y-16">
            
            {/* Panel Contacto */}
            <section>
              <h2 className="text-2xl font-serif mb-8 border-b border-border pb-2 text-foreground"><T>Datos del Huésped</T></h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>{phNombre}</label>
                  <input value={contactInfo.firstName} onChange={(e)=>setContactInfo({...contactInfo, firstName:e.target.value})} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{phApellidos}</label>
                  <input value={contactInfo.lastName} onChange={(e)=>setContactInfo({...contactInfo, lastName:e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{phEmail}</label>
                  <input type="email" value={contactInfo.email} onChange={(e)=>setContactInfo({...contactInfo, email:e.target.value})} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{phTelefono}</label>
                  <input type="tel" value={contactInfo.phone} onChange={(e)=>setContactInfo({...contactInfo, phone:e.target.value})} required className={inputClass} />
                </div>
              </div>
            </section>
              
            {/* Panel Facturación */}
            <section>
              <h2 className="text-2xl font-serif mb-8 border-b border-border pb-2 text-foreground"><T>Dirección de Facturación</T></h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="sm:col-span-2">
                  <label className={labelClass}>{phPais}</label>
                  <input required value={billingInfo.pais} onChange={(e)=>setBillingInfo({...billingInfo, pais:e.target.value})} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>{phDireccion}</label>
                  <input required value={billingInfo.direccion} onChange={(e)=>setBillingInfo({...billingInfo, direccion:e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{phLocalidad}</label>
                  <input required value={billingInfo.localidad} onChange={(e)=>setBillingInfo({...billingInfo, localidad:e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{phEstado}</label>
                  <input required value={billingInfo.estado} onChange={(e)=>setBillingInfo({...billingInfo, estado:e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{phCP}</label>
                  <input required value={billingInfo.codigo_postal} onChange={(e)=>setBillingInfo({...billingInfo, codigo_postal:e.target.value})} className={inputClass} />
                </div>
              </div>

              <div className="mt-12">
                <label className="flex items-center gap-4 cursor-pointer text-foreground font-medium text-sm">
                  <input type="checkbox" checked={addNotes} onChange={(e)=>setAddNotes(e.target.checked)} className="w-4 h-4 accent-primary" />
                  <T>Añadir peticiones especiales o alergias</T>
                </label>
                
                {addNotes && (
                  <div className="mt-6 animate-fade-in-up">
                    <textarea 
                      placeholder={phNotas} value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-4 text-sm text-foreground focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/50 resize-none"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Panel Pago */}
            <section>
              <div className="flex items-end justify-between mb-8 border-b border-border pb-2">
                <h2 className="text-2xl font-serif text-foreground"><T>Información de Pago</T></h2>
                <div className="h-6 opacity-60">
                   <img src="/logo-keycop-2.png" alt="Powered by Keycop" className="h-full object-contain grayscale" />
                </div>
              </div>

              <div className="bg-foreground text-background p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 grid gap-8">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted block mb-2">{phTarjeta}</label>
                    <input required maxLength={19} value={cardInfo.number} onChange={(e)=>setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '')})} className="w-full bg-transparent border-b border-background/20 py-2 text-xl font-serif tracking-widest text-background focus:border-primary outline-none transition-colors placeholder:text-background/20" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted block mb-2">{phNombreTarjeta}</label>
                    <input required value={cardInfo.name} onChange={(e)=>setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})} className="w-full bg-transparent border-b border-background/20 py-2 text-sm font-medium tracking-widest text-background focus:border-primary outline-none transition-colors placeholder:text-background/20" placeholder="TITULAR DE LA TARJETA" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted block mb-2">{phFecha}</label>
                      <input required maxLength={5} value={cardInfo.expiry} onChange={handleExpiryChange} className="w-full bg-transparent border-b border-background/20 py-2 text-sm font-medium tracking-widest text-background focus:border-primary outline-none transition-colors placeholder:text-background/20" placeholder="MM/AA" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted block mb-2">{phCvv}</label>
                      <input type="password" required maxLength={4} value={cardInfo.cvv} onChange={(e)=>setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})} className="w-full bg-transparent border-b border-background/20 py-2 text-sm font-medium tracking-widest text-background focus:border-primary outline-none transition-colors placeholder:text-background/20" placeholder="***" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-background/10">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <p className="text-[10px] font-medium text-background/60 tracking-wider uppercase"><T>Conexión cifrada de extremo a extremo.</T></p>
                  </div>
                </div>
              </div>
            </section>

          </div>
            
          {/* Resumen Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white p-8 lg:p-10 sticky top-32 border border-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-serif mb-8 text-foreground border-b border-border pb-4"><T>Detalle de Inversión</T></h2>
              
              <div className="space-y-6 mb-10">
                {cart.items.length === 0 ? (
                  <p className="text-muted-foreground text-sm font-light"><T>Tu carrito está vacío.</T></p>
                ) : (
                  cart.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm items-start gap-4">
                      <span className="text-muted-foreground font-light leading-relaxed">
                        <T>{item.experience.title}</T> <span className="font-medium text-foreground block mt-1">x{item.people} <T>personas</T></span>
                      </span>
                      <span className="font-medium text-foreground">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-border pt-8">
                <div className="flex justify-between items-end mb-10">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground"><T>Total A Pagar</T></span>
                  <div className="text-right">
                    <div className="text-3xl font-serif text-primary">{formatPrice(finalTotal)}</div>
                    <div className="text-[9px] font-medium text-muted-foreground mt-1 uppercase tracking-widest"><T>IVA incluido</T></div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={!isFormValid || isProcessing} 
                  className="w-full bg-foreground text-background py-5 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-primary transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : <Lock className="w-4 h-4" />}
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
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </div>
  );
}