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

    // 2. Parse FormData
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const pricePerDayStr = formData.get("price_per_day") as string;
    const description = formData.get("description") as string | null;
    const isActiveStr = formData.get("is_active") as string;
    const file = formData.get("file") as File | null;

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

    // 3. Check for slug uniqueness
    const { data: existingItem } = await adminClient
      .from("items")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingItem) {
      return NextResponse.json(
        { error: "Slug sudah digunakan. Harap buat slug yang unik." },
        { status: 400 }
      );
    }

    // 4. Handle file upload to public bucket "item-images"
    let imageUrl = null;
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
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return NextResponse.json(
          { error: "Gagal mengupload gambar alat." },
          { status: 500 }
        );
      }

      imageUrl = adminClient.storage.from("item-images").getPublicUrl(filePath).data.publicUrl;
    }

    // 5. Insert item into database
    const { data: newItem, error: insertError } = await adminClient
      .from("items")
      .insert({
        name,
        slug,
        category: category.toLowerCase().trim(),
        price_per_day,
        description: description || null,
        image_url: imageUrl,
        is_active,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return NextResponse.json(
        { error: "Gagal menyimpan data alat ke database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      item: newItem,
    });
  } catch (err) {
    console.error("[POST /api/admin/items]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
