import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { bookingFormSchema } from "@/lib/validations/booking.schema";
import {
  generateBookingCode,
  calculateDpAmount,
  calculateRemainingAmount,
} from "@/lib/utils/booking";
import { calculateRentalDays } from "@/lib/utils/date";

/**
 * POST /api/bookings
 *
 * Creates a new booking:
 * 1. Validates input with Zod
 * 2. Creates customer record
 * 3. Creates booking record with generated booking_code
 * 4. Creates booking_items with price snapshot
 * 5. Creates initial payment record
 * 6. Returns booking_code for redirect
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const parsed = bookingFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = createAdminClient();

    // ── 1. Fetch item prices from DB (prevent price manipulation) ──
    const itemIds = data.items.map((i) => i.item_id);
    const { data: dbItems, error: itemsError } = await supabase
      .from("items")
      .select("id, price_per_day, is_active")
      .in("id", itemIds);

    if (itemsError || !dbItems) {
      return NextResponse.json(
        { error: "Gagal memuat data alat." },
        { status: 500 }
      );
    }

    // Verify all items are active
    const inactiveItem = dbItems.find((item) => !item.is_active);
    if (inactiveItem) {
      return NextResponse.json(
        { error: "Salah satu alat tidak tersedia." },
        { status: 400 }
      );
    }

    // ── 2. Calculate totals server-side ──
    const rentalDays = calculateRentalDays(
      data.rental_start_date,
      data.rental_end_date
    );

    const priceMap = new Map(dbItems.map((i) => [i.id, i.price_per_day]));

    let totalAmount = 0;
    const bookingItemsPayload = data.items.map((item) => {
      const pricePerDay = priceMap.get(item.item_id) ?? 0;
      const subtotal = pricePerDay * item.quantity * rentalDays;
      totalAmount += subtotal;
      return {
        item_id: item.item_id,
        quantity: item.quantity,
        price_per_day_snapshot: pricePerDay,
        subtotal,
      };
    });

    const dpAmount = calculateDpAmount(totalAmount);
    const remainingAmount = calculateRemainingAmount(totalAmount, dpAmount);

    // ── 3. Create customer ──
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        name: data.name,
        phone: data.phone,
        address: data.address,
      })
      .select("id")
      .single();

    if (customerError || !customer) {
      return NextResponse.json(
        { error: "Gagal menyimpan data pelanggan." },
        { status: 500 }
      );
    }

    // ── 4. Create booking ──
    const bookingCode = generateBookingCode();

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        booking_code: bookingCode,
        customer_id: customer.id,
        rental_start_date: data.rental_start_date,
        rental_end_date: data.rental_end_date,
        rental_days: rentalDays,
        guarantee_type: data.guarantee_type,
        total_amount: totalAmount,
        dp_amount: dpAmount,
        remaining_amount: remainingAmount,
        status: "pending_payment",
        notes: data.notes ?? null,
      })
      .select("id, booking_code")
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Gagal menyimpan booking." },
        { status: 500 }
      );
    }

    // ── 5. Create booking_items ──
    const { error: itemsInsertError } = await supabase
      .from("booking_items")
      .insert(
        bookingItemsPayload.map((item) => ({
          booking_id: booking.id,
          ...item,
        }))
      );

    if (itemsInsertError) {
      return NextResponse.json(
        { error: "Gagal menyimpan detail alat." },
        { status: 500 }
      );
    }

    // ── 6. Create initial payment record ──
    await supabase.from("payments").insert({
      booking_id: booking.id,
      payment_method: "bank_transfer",
      amount: dpAmount,
      status: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        booking_code: booking.booking_code,
        message: "Booking berhasil dibuat.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
