import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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

    // 2. Parse request body
    const body = await request.json();
    const { item_id, unit_code, condition, status } = body as {
      item_id: string;
      unit_code: string;
      condition?: string;
      status?: string;
    };

    if (!item_id || !unit_code) {
      return NextResponse.json(
        { error: "Field item_id dan unit_code wajib diisi." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // 3. Check for unit_code uniqueness for this item
    const { data: existingUnit } = await adminClient
      .from("item_units")
      .select("id")
      .eq("item_id", item_id)
      .eq("unit_code", unit_code)
      .single();

    if (existingUnit) {
      return NextResponse.json(
        { error: `Kode unit "${unit_code}" sudah terdaftar untuk alat ini.` },
        { status: 400 }
      );
    }

    // 4. Insert new unit
    const { data: newUnit, error } = await adminClient
      .from("item_units")
      .insert({
        item_id,
        unit_code,
        condition: condition || "good",
        status: status || "available",
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert unit error:", error);
      return NextResponse.json(
        { error: "Gagal menyimpan data unit baru." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      unit: newUnit,
    });
  } catch (err) {
    console.error("[POST /api/admin/units]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
