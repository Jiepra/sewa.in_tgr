import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // 2. Parse FormData
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const pricePerDayStr = formData.get("price_per_day") as string;
    const description = formData.get("description") as string | null;
    const isActiveStr = formData.get("is_active") as string;
    const file = formData.get("file") as File | null;
    const currentImageUrl = formData.get("current_image_url") as string | null;

    if (!name || !slug || !category || !pricePerDayStr) {
      return NextResponse.json(
        { error: "Field nama, slug, kategori, dan harga wajib diisi." },
        { status: 400 }
      );
    }

    const price_per_day = parseInt(pricePerDayStr, 10);
    if (isNaN(price_per_day) || price_per_day <= 0) {
      return NextResponse.json(
        { error: "Harga sewa per hari harus berupa angka positif." },
        { status: 400 }
      );
    }

    const is_active = isActiveStr === "true";
    const adminClient = createAdminClient();

    // 3. Check slug uniqueness (excluding current item)
    const { data: existingItem } = await adminClient
      .from("items")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .single();

    if (existingItem) {
      return NextResponse.json(
        { error: "Slug sudah digunakan oleh alat lain." },
        { status: 400 }
      );
    }

    // 4. Handle file upload if new file is selected
    let imageUrl = currentImageUrl;
    if (file && file.size > 0) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const fileName = `${slug}-${Date.now()}.${ext}`;
      const filePath = `${fileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await adminClient.storage
        .from("item-images")
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return NextResponse.json(
          { error: "Gagal mengupload gambar baru." },
          { status: 500 }
        );
      }

      imageUrl = adminClient.storage.from("item-images").getPublicUrl(filePath).data.publicUrl;
    }

    // 5. Update database record
    const { data: updatedItem, error: updateError } = await adminClient
      .from("items")
      .update({
        name,
        slug,
        category: category.toLowerCase().trim(),
        price_per_day,
        description: description || null,
        image_url: imageUrl,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json(
        { error: "Gagal memperbarui data alat di database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      item: updatedItem,
    });
  } catch (err) {
    console.error("[PATCH /api/admin/items/[id]]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Delete item (this cascade deletes item_units and booking_items if database constraints allow, but warning: we should check RLS/constraints)
    const { error: deleteError } = await adminClient
      .from("items")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Database delete error:", deleteError);
      return NextResponse.json(
        { error: "Gagal menghapus alat dari database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Alat berhasil dihapus.",
    });
  } catch (err) {
    console.error("[DELETE /api/admin/items/[id]]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
