"use client";

import { useLocale } from 'next-intl';
import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { T } from "@/components/T";

export function Header() {
  const locale = useLocale();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-6 w-full z-50 px-4 md:px-6 flex justify-center pointer-events-none">
        <div className={`pointer-events-auto transition-all duration-500 flex items-center justify-between px-6 py-3 rounded-full w-full max-w-5xl ${isScrolled ? "bg-white/90 backdrop-blur-xl shadow-xl shadow-primary/10 border border-white/50" : "bg-white shadow-lg border border-slate-100"}`}>
          
          {/* Logo Viajeromex Gastronómico */}
          <Link href={`/${locale}/`} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
              <UtensilsCrossed className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold font-bricolage text-foreground tracking-tight">
              Viajeromex
            </span>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-foreground/80">
            <Link href={`/${locale}/experiencias`} className="hover:text-primary transition-colors py-2 px-3 rounded-full hover:bg-primary/5">
              <T>Rutas Culinarias</T>
            </Link>
            <Link href={`/${locale}/#cotizar`} className="hover:text-secondary transition-colors py-2 px-3 rounded-full hover:bg-secondary/5">
              <T>Cata a Medida</T>
            </Link>
          </nav>

          {/* Acciones */}
          <div className="hidden md:flex items-center gap-4">
            <Link href={`/${locale === 'es' ? 'en' : 'es'}`} className="w-10 h-10 flex items-center justify-center font-black text-xs rounded-full bg-muted text-foreground hover:bg-primary hover:text-white transition-colors">
              {locale === 'es' ? 'EN' : 'ES'}
            </Link>
            
            <Link href={`/${locale}/carrito`} className="flex items-center gap-3 bg-secondary text-white px-5 py-2.5 rounded-full hover:bg-secondary/90 transition-transform hover:scale-105 active:scale-95 shadow-md shadow-secondary/30">
              <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
              <span className="font-bold text-sm"><T>Orden</T> {itemCount > 0 && `(${itemCount})`}</span>
            </Link>
          </div>

          {/* Menú Hamburguesa */}
          <button className="md:hidden bg-muted w-10 h-10 rounded-full flex items-center justify-center text-foreground" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-5 h-5" strokeWidth={2.5} />
          </button>

        </div>
      </header>

      {/* Menú Móvil Overlay */}
      <div className={`fixed inset-0 z-[60] bg-primary flex flex-col p-8 transition-transform duration-500 ease-in-out ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex justify-between items-center mb-12">
          <span className="text-3xl font-black text-white font-bricolage">Viajeromex</span>
          <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>
        
        <nav className="flex flex-col gap-6 text-white">
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/`} className="text-4xl font-black font-bricolage hover:translate-x-2 transition-transform"><T>Inicio</T></Link>
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/experiencias`} className="text-4xl font-black font-bricolage hover:translate-x-2 transition-transform"><T>Rutas Culinarias</T></Link>
          <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/#cotizar`} className="text-4xl font-black font-bricolage hover:translate-x-2 transition-transform"><T>Cata a Medida</T></Link>
          
          <div className="mt-8 border-t border-white/20 pt-8">
            <Link onClick={() => setMobileMenuOpen(false)} href={`/${locale}/carrito`} className="flex items-center gap-4 text-2xl font-black font-bricolage bg-white text-primary w-fit px-8 py-4 rounded-full">
              <ShoppingBag className="w-6 h-6" strokeWidth={2.5} />
              <T>Ver Orden</T> ({itemCount})
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}