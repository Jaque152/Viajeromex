"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import {
  Trash2, Minus, Plus, ShoppingCart, ArrowRight,
  Calendar, Users, MapPin, ShoppingBag
} from "lucide-react";

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-MX", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">Tu Carrito</h1>
              <p className="text-muted-foreground">
                {cart.items.length} {cart.items.length === 1 ? "experiencia" : "experiencias"} seleccionadas
              </p>
            </div>
            {cart.items.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" /> Vaciar carrito
              </Button>
            )}
          </div>

          {cart.items.length === 0 ? (
            <Card className="border-dashed py-16 text-center">
              <ShoppingCart className="w-10 h-10 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-xl font-serif font-semibold mb-2">Tu carrito está vacío</h2>
              <Button asChild className="mt-4"><Link href="/experiencias">Explorar Experiencias</Link></Button>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => {
                  // Extraer la primera imagen del arreglo JSONB
                  const itemImage = item.experience.images && item.experience.images.length > 0 
                                      ? item.experience.images[0] 
                                      : '/placeholder.jpg';
                  
                  return (
                    <Card key={`${item.packageId}-${item.date}`} className="overflow-hidden">
                      <CardContent className="p-0 flex flex-col sm:flex-row">
                        <div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                          <img src={itemImage} alt={item.experience.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <Badge variant="secondary" className="mb-2">{item.levelName}</Badge>
                              <h3 className="text-lg font-serif font-semibold">{item.experience.title}</h3>
                            </div>
                            <button onClick={() => removeFromCart(item.packageId, item.date)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-4">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {item.experience.location}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(item.date)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 bg-stone-50 p-1 rounded-md border">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.packageId, item.date, item.people - 1)} disabled={item.people <= 1}><Minus className="w-3 h-3" /></Button>
                              <span className="font-bold">{item.people}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.packageId, item.date, item.people + 1)}><Plus className="w-3 h-3" /></Button>
                            </div>
                            <p className="text-xl font-bold text-primary">{formatPrice(item.totalPrice)}</p>
                            <p className="text-[10px] text-stone-500">IVA incluido</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="lg:col-span-1">
                <Card className="sticky top-28 p-6">
                  <h2 className="text-xl font-serif font-semibold mb-6">Resumen</h2>
                  <div className="flex justify-between text-lg font-bold mb-6 pt-4 border-t">
                    <span>Total</span><span className="text-primary">{formatPrice(cart.total)}</span>
                  </div>
                  <Button asChild className="w-full h-12 rounded-full"><Link href="/checkout">Proceder al Pago <ArrowRight className="ml-2 w-5 h-5" /></Link></Button>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}