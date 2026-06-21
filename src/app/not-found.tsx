import Link from "next/link";
import { Mountain, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
        <Mountain className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-lg font-medium text-foreground">Halaman tidak ditemukan</p>
        <p className="text-muted-foreground max-w-sm">
          Alat yang kamu cari mungkin tidak tersedia atau URL tidak valid.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Lihat Katalog
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
        >
          Ke Beranda
        </Link>
      </div>
    </div>
  );
}
