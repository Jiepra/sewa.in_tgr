import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;

    // 1. Verify admin auth
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

    // 2. Parse update data
    const body = await request.json();
    const { condition, status } = body as {
      condition?: string;
      status?: string;
    };

    const adminClient = createAdminClient();

    // 3. Update unit in database
    const { data: updatedUnit, error } = await adminClient
      .from("item_units")
      .update({
        ...(condition && { condition }),
        ...(status && { status }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", unitId)
      .select()
      .single();

    if (error) {
      console.error("Database update unit error:", error);
      return NextResponse.json(
        { error: "Gagal memperbarui status unit." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      unit: updatedUnit,
    });
  } catch (err) {
    console.error("[PATCH /api/admin/units/[unitId]]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;

    // Verify admin auth
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

    // Delete unit
    const { error } = await adminClient
      .from("item_units")
      .delete()
      .eq("id", unitId);

    if (error) {
      console.error("Database delete unit error:", error);
      return NextResponse.json(
        { error: "Gagal menghapus unit." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Unit berhasil dihapus.",
    });
  } catch (err) {
    console.error("[DELETE /api/admin/units/[unitId]]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
