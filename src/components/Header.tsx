"use client";

import { useLocale } from 'next-intl';
import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { T } from "@/components/T";

export function Header() {
  const locale = useLocale();
  const { cart, getItemCount } = useCart(); // Asegúrate de exportar 'cart' desde tu CartContext
  const itemCount = getItemCount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? "bg-background/95 backdrop-blur-md py-4 border-b border-border/50 shadow-sm" : "bg-transparent py-8"}`}>
        <div className="container mx-auto px-6 relative flex items-center justify-between md:justify-center">
          
          <nav className="hidden md:flex absolute left-6 items-center gap-10">
            <Link href={`/${locale}/experiencias`} className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors">
              <T>Expediciones</T>
            </Link>
            <Link href={`/${locale}/#cotizar`} className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors">
              <T>Diseño a Medida</T>
            </Link>
          </nav>

          <Link href={`/${locale}/`} className="text-3xl md:text-4xl font-serif font-medium tracking-widest text-primary flex items-center justify-center">
            Mextripia<span className="text-secondary text-5xl leading-none">.</span>
          </Link>

          <div className="hidden md:flex absolute right-6 items-center gap-8">
            <Link href={`/${locale === 'es' ? 'en' : 'es'}`} className="text-[11px] font-bold tracking-[0.2em] text-foreground hover:text-primary transition-colors">
              {locale === 'es' ? 'EN' : 'ES'}
            </Link>

            {/* Contenedor del Mini-Carrito con Hover */}
            <div className="relative group py-4">
              <Link href={`/${locale}/carrito`} className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground group-hover:text-primary transition-colors">
                  <T>Bolsa</T>
                </span>
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-secondary text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                      {itemCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Dropdown Mini-Carrito */}
              <div className="absolute right-0 top-full mt-0 w-80 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:scale-100 scale-95 z-50 overflow-hidden">
                <div className="p-6 max-h-[300px] overflow-y-auto">
                  {cart?.items?.length > 0 ? (
                    <div className="space-y-4">
                      {cart.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0">
                          <img src={item.experience.images[0] || '/placeholder.jpg'} alt={item.experience.title} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-foreground line-clamp-1">{item.experience.title}</p>
                            <p className="text-[10px] text-muted-foreground">{item.people} pax • {item.date}</p>
                            <p className="text-xs font-semibold text-primary mt-1">{formatPrice(item.totalPrice)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <ShoppingBag className="w-8 h-8 text-border mx-auto mb-3" strokeWidth={1} />
                      <p className="text-sm text-muted-foreground font-light"><T>Su bolsa está vacía.</T></p>
                    </div>
                  )}
                </div>
                
                {cart?.items?.length > 0 && (
                  <div className="bg-background p-6 border-t border-border">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground"><T>Total</T></span>
                      <span className="text-lg font-serif text-foreground">{formatPrice(cart.total)}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={`/${locale}/checkout`} className="w-full bg-foreground text-white text-center py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors">
                        <T>Pagar ahora</T>
                      </Link>
                      <Link href={`/${locale}/carrito`} className="w-full bg-transparent border border-foreground text-foreground text-center py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors">
                        <T>Ver detalles</T>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Menú Móvil */}
      <div className={`fixed inset-0 z-[60] bg-background flex flex-col justify-center p-8 transition-all duration-700 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <button className="absolute top-8 right-6 text-foreground" onClick={() => setMobileMenuOpen(false)}>
          <X className="w-8 h-8" strokeWidth={1} />
        </button>
        <nav className="flex flex-col items-center gap-8">
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/`} className="text-4xl font-serif text-foreground hover:text-primary transition-colors"><T>Inicio</T></Link>
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/experiencias`} className="text-4xl font-serif text-foreground hover:text-primary transition-colors"><T>Expediciones</T></Link>
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/#cotizar`} className="text-4xl font-serif text-foreground hover:text-primary transition-colors"><T>Diseño a Medida</T></Link>
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/carrito`} className="text-xl font-serif text-secondary mt-8 border-b border-secondary pb-1">
            <T>Bolsa</T> ({itemCount})
          </Link>
        </nav>
      </div>
    </>
  );
}