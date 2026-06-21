"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/katalog", label: "Katalog" },
  { href: "/booking", label: "Booking" },
  { href: "/syarat-ketentuan", label: "S&K" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b border-border/60 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/90"
          : "bg-transparent"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-primary hover:opacity-90 transition-opacity"
          id="nav-brand"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-border">
            <Image
              src="/logo.png"
              alt="sewa_in.tgr Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-lg">sewa_in.tgr</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            id="nav-cta-booking"
            className="ml-2 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Booking Sekarang
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 pb-1">
            <Link
              href="/booking"
              className="flex items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              Booking Sekarang
            </Link>
          </div>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER ?? ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Phone className="h-4 w-4" />
            Hubungi WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
