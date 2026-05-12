"use client";

import { useLocale } from 'next-intl';
import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { T } from "@/components/T";

export function Header() {
  const locale = useLocale();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? "bg-background/90 backdrop-blur-md py-4 border-b border-secondary/20" : "bg-transparent py-8"}`}>
        <div className="container mx-auto px-6 relative flex items-center justify-between md:justify-center">
          
          {/* Lado Izquierdo (Desktop) */}
          <nav className="hidden md:flex absolute left-6 items-center gap-10">
            <Link href={`/${locale}/experiencias`} className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary animated-line relative">
              <T>Expediciones</T>
            </Link>
            <Link href={`/${locale}/cotizar`} className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary animated-line relative">
              <T>Diseño a Medida</T>
            </Link>
          </nav>

          {/* Logo Central (Elegante y grande) */}
          <Link href={`/${locale}/`} className="text-3xl md:text-4xl font-serif font-medium tracking-widest text-primary flex items-center justify-center">
            EPICÚREO<span className="text-secondary text-5xl leading-none">.</span>
          </Link>

          {/* Lado Derecho (Desktop) */}
          <div className="hidden md:flex absolute right-6 items-center gap-10">
            <Link href={`/${locale === 'es' ? 'en' : 'es'}`} className="text-[11px] font-bold tracking-[0.2em] text-foreground hover:text-primary transition-colors">
              {locale === 'es' ? 'EN' : 'ES'}
            </Link>
            <Link href={`/${locale}/carrito`} className="flex items-center gap-2 group">
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
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Menú Móvil Pantalla Completa (Estilo Cortina) */}
      <div className={`fixed inset-0 z-[60] bg-background flex flex-col justify-center p-8 transition-all duration-700 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <button className="absolute top-8 right-6 text-foreground" onClick={() => setMobileMenuOpen(false)}>
          <X className="w-8 h-8" strokeWidth={1} />
        </button>
        
        <nav className="flex flex-col items-center gap-8">
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/`} className="text-4xl font-serif text-foreground hover:text-primary transition-colors italic"><T>Inicio</T></Link>
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/experiencias`} className="text-4xl font-serif text-foreground hover:text-primary transition-colors italic"><T>Expediciones</T></Link>
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/cotizar`} className="text-4xl font-serif text-foreground hover:text-primary transition-colors italic"><T>Diseño a Medida</T></Link>
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/carrito`} className="text-xl font-serif text-secondary mt-8 border-b border-secondary pb-1">
            <T>Bolsa</T> ({itemCount})
          </Link>
        </nav>
      </div>
    </>
  );
}