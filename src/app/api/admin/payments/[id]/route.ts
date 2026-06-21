import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { verify } = body as { verify: boolean };

    if (verify === undefined) {
      return NextResponse.json(
        { error: "Aksi verifikasi (verify: true/false) wajib ditentukan." },
        { status: 400 }
      );
    }

    // Verify admin authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Harap login sebagai admin." },
        { status: 401 }
      );
    }

    const adminClient = createAdminClient();

    // 1. Get payment details
    const { data: payment, error: paymentError } = await adminClient
      .from("payments")
      .select("id, booking_id")
      .eq("id", id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: "Rekam pembayaran tidak ditemukan." },
        { status: 404 }
      );
    }

    // 2. Perform updates based on decision
    if (verify) {
      // Approve: Payment status verified, booking status confirmed
      await adminClient
        .from("payments")
        .update({
          status: "verified",
          verified_by: user.id,
          verified_at: new Date().toISOString(),
        })
        .eq("id", id);

      await adminClient
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", payment.booking_id);
    } else {
      // Reject: Payment status rejected, booking status pending_payment (re-uploadable)
      await adminClient
        .from("payments")
        .update({
          status: "rejected",
          verified_by: user.id,
          verified_at: new Date().toISOString(),
        })
        .eq("id", id);

      await adminClient
        .from("bookings")
        .update({ status: "pending_payment" })
        .eq("id", payment.booking_id);
    }

    return NextResponse.json({
      success: true,
      message: verify ? "Pembayaran disetujui" : "Pembayaran ditolak",
    });
  } catch (err) {
    console.error("[PATCH /api/admin/payments/[id]]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
