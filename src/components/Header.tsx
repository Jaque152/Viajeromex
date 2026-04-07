"use client";
import { T } from "@/components/T";
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState, useTransition} from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label:<T> Inicio</T> },
  { href: "/experiencias", label: <T>Experiencias</T>}, 
  { href: "/#contacto", label: <T>Contacto</T> },
];

export function Header() {
  const locale = useLocale(); // Detecta si es 'es' o 'en'
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showMiniCart, setShowMiniCart] = useState(false);
  const { cart, getItemCount } = useCart();
  const itemCount = getItemCount();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleLanguageChange = (nextLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`) || `/${nextLocale}`;
    
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo*/}
          <Link href={`/${locale}/`} className="flex items-center gap-3 group">
            <div className="w-14 h-14 flex items-center justify-center p-1 transition-transform duration-300 group-hover:scale-110">
              <img 
                src="/logo 2.png"
                alt="Logo zenithmex.com"
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-serif font-semibold text-foreground">Zenith</span>
              <span className="text-xl font-serif font-light text-primary">Mexico</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline uppercase">{locale}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[100px]">
                <DropdownMenuItem onClick={() => handleLanguageChange('es')} className="cursor-pointer">
                  <span className={locale === 'es' ? "font-semibold text-primary" : ""}>ES - Español</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="cursor-pointer">
                  <span className={locale === 'en' ? "font-semibold text-primary" : ""}>EN - English</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <div
              className="relative"
              onMouseEnter={() => setShowMiniCart(true)}
              onMouseLeave={() => setShowMiniCart(false)}
            >
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground" asChild>
                <Link href={`/${locale}/carrito`}>
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </Button>

              {showMiniCart && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-sm">
                      <T>Tu Carrito</T>
                    </h3>
                  </div>
                  {cart.items.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      <T>Tu carrito está vacío</T>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-64 overflow-y-auto">
                        {cart.items.slice(0, 3).map((item) => {
                          // Extrae la primera imagen del arreglo JSONB
                          const miniImage = item.experience.images && item.experience.images.length > 0 
                                              ? item.experience.images[0] 
                                              : '/placeholder.jpg';

                          return (
                            <div key={`${item.packageId}-${item.date}`} className="p-3 border-b border-border/50">
                              <div className="flex gap-3">
                                <img src={miniImage} className="w-12 h-12 rounded object-cover" alt={item.experience.title} />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-medium truncate"><T>{item.experience.title}</T></h4>
                                  <p className="text-[10px] text-muted-foreground">{item.people}p • <T>{item.levelName}</T></p>
                                  <p className="text-xs font-semibold text-primary">{formatPrice(item.totalPrice)}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-4 bg-secondary/30">
                        <Link href={`/${locale}/carrito`} className="block w-full py-2 bg-primary text-primary-foreground text-center rounded-lg text-sm font-medium">
                        <T>Ver Carrito</T></Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only"><T>Menú de navegación</T></SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={`/${locale}${link.href}`} className="text-lg font-medium">{link.label}</Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}