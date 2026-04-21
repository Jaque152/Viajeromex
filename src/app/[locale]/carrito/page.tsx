"use client";
import { T } from "@/components/T";
import { useLocale } from 'next-intl';
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import {
  Trash2, Minus, Plus, ShoppingCart, ArrowRight,
  Calendar, MapPin
} from "lucide-react";

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    });
    return `${formatter.format(price)} MXN`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-MX", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  };

  const locale = useLocale();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mb-2">
                <T>Tu Carrito</T>
              </h1>
              <p className="text-lg font-medium text-slate-500">
                {cart.items.length} {cart.items.length === 1 ? <T>experiencia</T> : <T>experiencias</T>} <T>seleccionadas</T>
              </p>
            </div>
            {cart.items.length > 0 && (
              <Button variant="ghost" onClick={clearCart} className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors">
                <Trash2 className="w-5 h-5 mr-2" /> <T>Vaciar carrito</T>
              </Button>
            )}
          </div>

          {cart.items.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-[2.5rem] py-24 text-center shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-3"><T>Tu carrito está vacío</T></h2>
              <p className="text-slate-500 font-medium mb-8"><T>Descubre el destino perfecto y comienza tu aventura.</T></p>
              <Button asChild className="h-14 px-8 rounded-full bg-primary hover:bg-slate-900 text-white font-bold transition-colors">
                <Link href={`/${locale}/experiencias`}><T>Explorar Experiencias</T></Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              
              <div className="lg:col-span-8 space-y-6">
                {cart.items.map((item) => {
                  const itemImage = item.experience.images && item.experience.images.length > 0 
                                      ? item.experience.images[0] 
                                      : '/placeholder.jpg';
                  
                  return (
                    <div key={`${item.packageId}-${item.date}`} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-3 flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-48 aspect-[4/3] sm:aspect-square flex-shrink-0">
                        <img src={itemImage} alt={item.experience.title} className="w-full h-full object-cover rounded-[1.5rem]" />
                      </div>
                      <div className="flex-1 py-4 pr-4 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Badge className="mb-3 bg-cyan-100 text-cyan-700 hover:bg-cyan-100 font-bold border-none px-3 py-1 rounded-full"><T>{item.levelName}</T></Badge>
                            <h3 className="text-2xl font-black tracking-tight text-slate-900"><T>{item.experience.title}</T></h3>
                          </div>
                          <button onClick={() => removeFromCart(item.packageId, item.date)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-medium text-slate-500 mb-6">
                          <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><MapPin className="w-4 h-4 text-primary" /> {item.experience.location}</span>
                          <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><Calendar className="w-4 h-4 text-primary" /> <T>{formatDate(item.date)}</T></span>
                        </div>
                        
                        <div className="flex items-end justify-between mt-auto">
                          <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white shadow-sm" onClick={() => updateQuantity(item.packageId, item.date, item.people - 1)} disabled={item.people <= 1}><Minus className="w-4 h-4 text-slate-700" /></Button>
                            <span className="font-black text-lg w-4 text-center">{item.people}</span>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white shadow-sm text-primary" onClick={() => updateQuantity(item.packageId, item.date, item.people + 1)}><Plus className="w-4 h-4" /></Button>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-primary">{formatPrice(item.totalPrice)}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider"><T>IVA incluido</T></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-4">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 sticky top-32 shadow-2xl shadow-primary/20">
                  <h2 className="text-2xl font-black text-white mb-8 tracking-tight"><T>Resumen</T></h2>
                  <div className="flex justify-between items-end mb-10 pt-8 border-t border-white/10">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-sm"><T>Total</T></span>
                    <span className="text-4xl font-black text-cyan-400">{formatPrice(cart.total)}</span>
                  </div>
                  <Button asChild className="w-full h-16 rounded-2xl bg-cyan-400 hover:bg-white text-slate-900 font-black text-lg transition-colors shadow-lg shadow-cyan-400/20 group">
                    <Link href={`/${locale}/checkout`}>
                      <T>Proceder al Pago</T>
                      <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
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