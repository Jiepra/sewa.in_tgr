import Link from "next/link";
import { Mountain, Phone, MapPin, Clock } from "lucide-react";

const footerLinks = [
  {
    title: "Menu",
    links: [
      { href: "/", label: "Beranda" },
      { href: "/katalog", label: "Katalog Alat" },
      { href: "/booking", label: "Booking Sewa" },
      { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
    ],
  },
  {
    title: "Informasi",
    links: [
      { href: "/syarat-ketentuan#ketentuan", label: "Ketentuan Sewa" },
      { href: "/syarat-ketentuan#pembayaran", label: "Cara Pembayaran" },
      { href: "/syarat-ketentuan#kerusakan", label: "Kerusakan & Kehilangan" },
    ],
  },
];

export default function Footer() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER ?? "";

  return (
    <footer className="border-t border-border bg-foreground/[0.02]">
      {/* Main footer */}
      <div className="container-page py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-primary">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Mountain className="h-5 w-5" />
              </div>
              <span className="text-xl">sewa_in.tgr</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Penyewaan alat gunung dan camping berkualitas. Lengkap, terjangkau,
              dan mudah diakses. Petualanganmu dimulai dari sini.
            </p>

            {/* Contact info */}
            <div className="space-y-2 text-sm">
              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  id="footer-wa-link"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  WhatsApp Admin
                </a>
              )}
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Tegallalang, Bali</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>08.00 – 20.00 WITA</span>
              </div>
            </div>
          </div>

          {/* Nav links */}
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Payment info strip */}
      <div className="border-t border-border bg-muted/30">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium">Pembayaran:</span>
            <span className="rounded border border-border bg-background px-2 py-0.5 font-mono font-semibold text-foreground">
              BCA 7435614914
            </span>
            <span>a/n MUHAMMAD SAHWAL</span>
          </div>
          <p>DP minimal 50% dari total sewa</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container-page py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} sewa_in.tgr. Semua hak dilindungi.</p>
          <p>Dibuat dengan ❤️ untuk pecinta alam</p>
        </div>
      </div>
    </footer>
  );
}
