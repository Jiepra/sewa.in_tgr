import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ItemForm from "@/components/admin/ItemForm";

export const metadata: Metadata = {
  title: "Tambah Alat Baru",
};

export default function AddItemPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin/items"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kelola Alat
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">Tambah Alat</span>
      </div>

      {/* Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold text-foreground">Tambah Alat Baru</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Lengkapi detail alat untuk ditambahkan ke daftar katalog sewa.
        </p>
      </div>

      {/* Form */}
      <ItemForm />
    </div>
  );
}
