import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";
import { ArrowLeft, Tag, ArrowRight, Phone, ShieldCheck } from "lucide-react";

interface ItemDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ItemDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("items")
    .select("name, description, category")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!item) {
    return { title: "Alat Tidak Ditemukan" };
  }

  return {
    title: `Sewa ${item.name}`,
    description:
      item.description ??
      `Sewa ${item.name} — alat ${item.category} berkualitas di sewa_in.tgr.`,
  };
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !item) {
    notFound();
  }

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER ?? "";
  const waMessage = encodeURIComponent(
    `Halo sewa_in.tgr, saya tertarik menyewa ${item.name}. Bisa info ketersediaan dan cara booking?`
  );

  return (
    <section className="section-padding">
      <div className="container-page max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/katalog"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Katalog
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">{item.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-secondary to-secondary/50">
                <div className="text-8xl mb-3">🏕️</div>
                <p className="text-sm text-muted-foreground">Foto segera hadir</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Tag className="h-3 w-3" />
              {item.category}
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold text-foreground">{item.name}</h1>

            {/* Description */}
            {item.description && (
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Price */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-1">
              <p className="text-sm text-muted-foreground">Harga sewa per hari</p>
              <p className="text-4xl font-bold text-primary">
                {formatCurrency(item.price_per_day)}
              </p>
              <p className="text-xs text-muted-foreground">
                DP minimal{" "}
                <span className="font-semibold text-foreground">
                  {formatCurrency(Math.ceil(item.price_per_day * 0.5))}
                </span>{" "}
                (50%) untuk 1 hari
              </p>
            </div>

            {/* Trust points */}
            <div className="space-y-2 text-sm text-muted-foreground">
              {[
                "Alat terawat dan dicek sebelum dipinjamkan",
                "Jaminan KTP atau SIM saat pengambilan",
                "Pembayaran DP via transfer BCA",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                  <span>{t}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/booking?item=${item.id}`}
                id="item-detail-cta-booking"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/80 hover:-translate-y-0.5 transition-all"
              >
                Booking Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>

              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="item-detail-cta-wa"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Tanya Admin
                </a>
              )}
            </div>

            {/* Back link */}
            <Link
              href="/katalog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke katalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
