import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/upload-payment-proof
 *
 * Handles payment proof file upload:
 * 1. Validates file type (jpg, jpeg, png, pdf)
 * 2. Validates file size (max 5MB)
 * 3. Uploads to Supabase Storage (payment-proofs bucket, private)
 * 4. Creates/updates payment record
 * 5. Updates booking status to payment_submitted
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bookingCode = formData.get("booking_code") as string | null;

    if (!file || !bookingCode) {
      return NextResponse.json(
        { error: "File dan kode booking wajib diisi." },
        { status: 400 }
      );
    }

    // ── Validate file type ──
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File hanya boleh berupa JPG, PNG, atau PDF." },
        { status: 400 }
      );
    }

    // ── Validate file size (max 5MB) ──
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // ── Get booking by code ──
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, status, dp_amount")
      .eq("booking_code", bookingCode)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Booking tidak ditemukan." },
        { status: 404 }
      );
    }

    if (booking.status === "cancelled") {
      return NextResponse.json(
        { error: "Booking ini telah dibatalkan." },
        { status: 400 }
      );
    }

    // ── Upload to Supabase Storage ──
    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `${bookingCode}-${Date.now()}.${ext}`;
    const filePath = `proofs/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Gagal mengupload file. Coba lagi." },
        { status: 500 }
      );
    }

    // ── Update or insert payment record ──
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id")
      .eq("booking_id", booking.id)
      .single();

    if (existingPayment) {
      await supabase
        .from("payments")
        .update({ proof_url: filePath, status: "submitted" })
        .eq("id", existingPayment.id);
    } else {
      await supabase.from("payments").insert({
        booking_id: booking.id,
        payment_method: "bank_transfer",
        amount: booking.dp_amount, // Set default amount to dp_amount to satisfy check constraint (> 0)
        proof_url: filePath,
        status: "submitted",
      });
    }

    // ── Update booking status ──
    await supabase
      .from("bookings")
      .update({ status: "payment_submitted" })
      .eq("id", booking.id);

    return NextResponse.json({
      success: true,
      message:
        "Bukti pembayaran berhasil diupload. Admin akan memverifikasi dalam waktu singkat.",
    });
  } catch (err) {
    console.error("[POST /api/upload-payment-proof]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
