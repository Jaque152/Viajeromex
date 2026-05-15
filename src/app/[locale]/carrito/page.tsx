"use client";
import { T } from "@/components/T";
import { useLocale } from 'next-intl';
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import {
  Trash2, Minus, Plus, ShoppingBag, ArrowRight,
  Calendar, MapPin
} from "lucide-react";
import Image from "next/image";

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const locale = useLocale();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 }).format(price);
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
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-6xl animate-fade-in-up">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-border pb-8">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-secondary mb-4 block">
                <T>Su Selección</T>
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-2">
                <T>Su Bolsa</T>
              </h1>
              <p className="text-sm font-light text-muted-foreground italic">
                {cart.items.length} {cart.items.length === 1 ? <T>experiencia</T> : <T>experiencias</T>}
              </p>
            </div>
            {cart.items.length > 0 && (
              <button onClick={clearCart} className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" strokeWidth={1.5} /> <T>Vaciar bolsa</T>
              </button>
            )}
          </div>

          {cart.items.length === 0 ? (
            <div className="py-24 text-center">
              <ShoppingBag className="w-12 h-12 text-border mx-auto mb-6" strokeWidth={1} />
              <h2 className="text-2xl font-serif text-foreground mb-4"><T>Su bolsa está vacía</T></h2>
              <p className="text-muted-foreground font-light mb-10"><T>La mesa está puesta, solo falta elegir su destino.</T></p>
              <Link href={`/${locale}/experiencias`} className="inline-block border border-foreground text-foreground px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors duration-300">
                <T>Explorar Colección</T>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-16 items-start">
              
              {/* Lista de Items */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-10">
                {cart.items.map((item) => {
                  const itemImage = item.experience.images && item.experience.images.length > 0 
                                      ? item.experience.images[0] 
                                      : '/placeholder.jpg';
                  
                  return (
                    <div key={`${item.packageId}-${item.date}`} className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-border/50 group">
                      
                      <div className="w-full sm:w-40 aspect-square relative overflow-hidden bg-muted/30 shrink-0">
                        <Image src={itemImage} alt={item.experience.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-secondary font-bold"><T>{item.levelName}</T></span>
                            <button onClick={() => removeFromCart(item.packageId, item.date)} className="text-muted-foreground hover:text-primary transition-colors">
                              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          </div>
                          <h3 className="text-2xl font-serif text-foreground mb-4 leading-tight"><T>{item.experience.title}</T></h3>
                          
                          <div className="space-y-2 text-xs font-light text-muted-foreground mb-6">
                            <span className="flex items-center gap-3"><MapPin className="w-3.5 h-3.5" /> {item.experience.location}</span>
                            <span className="flex items-center gap-3"><Calendar className="w-3.5 h-3.5" /> <T>{formatDate(item.date)}</T></span>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between border-t border-border/50 pt-4">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold"><T>Asistentes</T></span>
                            <div className="flex items-center gap-3 border border-border px-3 py-1">
                              <button onClick={() => updateQuantity(item.packageId, item.date, item.people - 1)} disabled={item.people <= 1} className="hover:text-primary disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                              <span className="text-sm font-medium w-4 text-center">{item.people}</span>
                              <button onClick={() => updateQuantity(item.packageId, item.date, item.people + 1)} className="hover:text-primary"><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-medium text-foreground">{formatPrice(item.totalPrice)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resumen */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="bg-white p-10 border border-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] sticky top-32">
                  <h2 className="text-2xl font-serif text-foreground mb-8 border-b border-border pb-4"><T>Resumen</T></h2>
                  
                  <div className="flex justify-between items-end mb-10">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground"><T>Total (IVA Inc)</T></span>
                    <span className="text-3xl font-serif text-primary">{formatPrice(cart.total)}</span>
                  </div>
                  
                  <Link href={`/${locale}/checkout`} className="group flex items-center justify-center gap-4 bg-foreground text-background px-8 py-5 w-full hover:bg-primary transition-all duration-300">
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase"><T>Proceder al Pago</T></span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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