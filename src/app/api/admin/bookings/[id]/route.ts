import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import type { BookingStatus } from "@/types/database";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status: BookingStatus };

    if (!status) {
      return NextResponse.json(
        { error: "Status wajib ditentukan." },
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

    // Update booking status
    const { data: updatedBooking, error } = await adminClient
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Gagal memperbarui status booking." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (err) {
    console.error("[PATCH /api/admin/bookings/[id]]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
