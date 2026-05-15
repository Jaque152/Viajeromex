"use client";
import { T } from "@/components/T";
import { useLocale } from 'next-intl';
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Calendar, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const locale = useLocale();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-MX", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-bounce-up">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full mb-3 font-black text-[10px] uppercase tracking-widest border border-secondary/20">
                <Sparkles className="w-3 h-3" />
                <T>Tu selección gastronómica</T>
              </div>
              <h1 className="text-5xl md:text-6xl font-black font-bricolage text-foreground tracking-tight">
                <T>Tu Orden</T>
              </h1>
            </div>
            {cart.items.length > 0 && (
              <button onClick={clearCart} className="group flex items-center gap-2 text-muted-foreground hover:text-primary font-bold text-sm transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10">
                   <Trash2 className="w-4 h-4" />
                </div>
                <T>Vaciar todo</T>
              </button>
            )}
          </div>

          {cart.items.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-16 text-center shadow-xl shadow-slate-100 border-2 border-slate-50 animate-bounce-up">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-black font-bricolage text-foreground mb-4"><T>Tu bolsa está vacía</T></h2>
              <p className="text-muted-foreground font-medium mb-10 text-lg"><T>El menú está listo, solo falta que elijas tu primera ruta.</T></p>
              <Link href={`/${locale}/experiencias`} className="btn-3d bg-primary text-white px-10 py-5 rounded-full font-black text-lg inline-flex items-center gap-3">
                <T>Explorar Rutas</T>
                <ArrowRight className="w-5 h-5" strokeWidth={3} />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              
              {/* Lista de Experiencias */}
              <div className="lg:col-span-8 space-y-6">
                {cart.items.map((item, idx) => {
                  const itemImage = item.experience.images?.[0] || '/placeholder.jpg';
                  
                  return (
                    <div key={`${item.packageId}-${item.date}`} className="bg-white rounded-[2.5rem] p-4 shadow-lg shadow-slate-200/50 border-2 border-slate-50 flex flex-col sm:flex-row gap-6 animate-bounce-up" style={{ animationDelay: `${idx * 100}ms` }}>
                      <div className="w-full sm:w-48 aspect-square relative rounded-[2rem] overflow-hidden shrink-0">
                        <Image src={itemImage} alt={item.experience.title} fill className="object-cover" />
                      </div>
                      
                      <div className="flex-1 py-2 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider">
                            <T>{item.levelName}</T>
                          </div>
                          <button onClick={() => removeFromCart(item.packageId, item.date)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <h3 className="text-2xl font-black font-bricolage text-foreground mb-4 leading-tight"><T>{item.experience.title}</T></h3>
                        
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl text-xs font-bold text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 text-secondary" strokeWidth={3} /> {item.experience.location}
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl text-xs font-bold text-muted-foreground uppercase">
                            <Calendar className="w-3.5 h-3.5 text-secondary" strokeWidth={3} /> <T>{formatDate(item.date)}</T>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto bg-slate-50 p-2 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-4 px-2">
                            <button onClick={() => updateQuantity(item.packageId, item.date, item.people - 1)} disabled={item.people <= 1} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-foreground hover:text-primary disabled:opacity-30 transition-all"><Minus className="w-4 h-4" strokeWidth={3} /></button>
                            <span className="font-black text-xl w-6 text-center font-bricolage">{item.people}</span>
                            <button onClick={() => updateQuantity(item.packageId, item.date, item.people + 1)} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary transition-all"><Plus className="w-4 h-4" strokeWidth={3} /></button>
                          </div>
                          <div className="pr-4 text-right">
                            <p className="text-2xl font-black text-primary font-bricolage leading-none">{formatPrice(item.totalPrice)}</p>
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">IVA Inc.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resumen Bento */}
              <div className="lg:col-span-4 sticky top-32">
                <div className="bg-slate-900 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl shadow-primary/20 relative overflow-hidden animate-bounce-up delay-200">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                  <h2 className="text-3xl font-black font-bricolage mb-8 tracking-tight"><T>Total de la Cuenta</T></h2>
                  
                  <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-center text-slate-400 font-bold text-sm uppercase tracking-widest">
                       <T>Subtotal</T>
                       <span className="text-white">{formatPrice(cart.total)}</span>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                      <span className="text-primary font-black uppercase tracking-widest text-xs"><T>Total Final</T></span>
                      <span className="text-5xl font-black font-bricolage text-accent leading-none">{formatPrice(cart.total)}</span>
                    </div>
                  </div>

                  <Link href={`/${locale}/checkout`} className="btn-3d w-full h-16 rounded-2xl bg-primary text-white font-black text-xl flex items-center justify-center gap-3 hover:bg-rose-600 transition-colors">
                    <T>Pagar ahora</T>
                    <ArrowRight className="w-6 h-6" strokeWidth={3} />
                  </Link>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}