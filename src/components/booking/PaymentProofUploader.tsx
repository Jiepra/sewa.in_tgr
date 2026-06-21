"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PaymentProofUploaderProps {
  bookingCode: string;
  bookingStatus: string;
  paymentStatus?: "pending" | "submitted" | "verified" | "rejected";
}

export default function PaymentProofUploader({
  bookingCode,
  bookingStatus,
  paymentStatus,
}: PaymentProofUploaderProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isUploaded =
    bookingStatus === "payment_submitted" ||
    bookingStatus === "confirmed" ||
    bookingStatus === "ready_to_pickup" ||
    bookingStatus === "ongoing" ||
    bookingStatus === "returned" ||
    bookingStatus === "completed";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Format file tidak didukung", {
        description: "Hanya file JPG, PNG, atau PDF yang diperbolehkan.",
      });
      return;
    }

    // Validate size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File terlalu besar", {
        description: "Ukuran file maksimal adalah 5MB.",
      });
      return;
    }

    setFile(selectedFile);

    // Create image preview if applicable
    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

  function handleRemoveFile() {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("booking_code", bookingCode);

    try {
      const res = await fetch("/api/upload-payment-proof", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error("Upload gagal", {
          description: json.error ?? "Terjadi kesalahan saat mengupload bukti pembayaran.",
        });
        return;
      }

      toast.success("Upload berhasil", {
        description: "Bukti transfer telah dikirim ke admin.",
      });
      handleRemoveFile();
      router.refresh();
    } catch {
      toast.error("Kesalahan jaringan", {
        description: "Gagal menghubungi server. Silakan coba lagi.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  // 1. Booking has been confirmed / completed
  if (
    bookingStatus === "confirmed" ||
    bookingStatus === "ready_to_pickup" ||
    bookingStatus === "ongoing" ||
    bookingStatus === "returned" ||
    bookingStatus === "completed"
  ) {
    return (
      <div className="rounded-xl border border-primary-foreground/10 bg-primary/5 p-5 text-center space-y-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-foreground text-sm">
          Pembayaran Telah Dikonfirmasi
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Pembayaran kamu telah diverifikasi oleh admin. Silakan koordinasi
          pengambilan barang sesuai jadwal.
        </p>
      </div>
    );
  }

  // 2. Booking status is cancelled
  if (bookingStatus === "cancelled") {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-center space-y-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-foreground text-sm">
          Booking Telah Dibatalkan
        </h3>
        <p className="text-xs text-muted-foreground">
          Booking ini tidak dapat menerima pembayaran karena telah dibatalkan.
        </p>
      </div>
    );
  }

  // 3. Payment proof already submitted and waiting verification
  if (isUploaded) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-center space-y-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
        <h3 className="font-semibold text-foreground text-sm">
          Menunggu Verifikasi Admin
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Bukti pembayaran telah berhasil diupload. Admin akan memeriksa dan
          mengubah status booking-mu segera.
        </p>
      </div>
    );
  }

  // 4. Default: Show file uploader
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          {paymentStatus === "rejected"
            ? "Bukti Pembayaran Ditolak. Harap upload ulang bukti transfer baru."
            : "Upload Bukti Transfer"}
        </h3>
        <p className="text-xs text-muted-foreground">
          Format: JPG, PNG, atau PDF (maksimal 5MB).
        </p>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        {!file ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <Upload className="h-8 w-8 text-muted-foreground mb-3" />
            <span className="text-sm font-medium text-foreground">
              Pilih file bukti transfer
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              atau seret file ke sini
            </span>
          </label>
        ) : (
          <div className="relative rounded-xl border border-border p-4 bg-muted/20">
            <div className="flex items-center gap-3">
              {previewUrl ? (
                <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-border bg-background">
                  <img
                    src={previewUrl}
                    alt="Preview bukti transfer"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-primary">
                  <FileText className="h-8 w-8" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                disabled={isUploading}
                aria-label="Hapus file"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {file && (
          <Button
            type="submit"
            className="w-full"
            disabled={isUploading}
            id="btn-upload-proof"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengupload Bukti...
              </>
            ) : (
              "Kirim Bukti Pembayaran"
            )}
          </Button>
        )}
      </form>
    </div>
  );
}
