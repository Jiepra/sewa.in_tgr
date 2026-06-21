import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BookingForm from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Booking Sewa Alat",
  description:
    "Isi form booking untuk menyewa alat gunung dan camping. Harga dihitung otomatis.",
};

interface BookingPageProps {
  searchParams: Promise<{ item?: string }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { item: preselectedItemId } = await searchParams;
  const supabase = await createClient();

  // Fetch all active items for the form
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("name");

  return (
    <section className="section-padding">
      <div className="container-page">
        {/* Header */}
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground">Form Booking Sewa</h1>
          <p className="mt-2 text-muted-foreground">
            Isi data di bawah ini. Total harga dan DP dihitung otomatis oleh
            sistem — kamu tidak perlu menghitung manual.
          </p>
        </div>

        <BookingForm
          availableItems={items ?? []}
          preselectedItemId={preselectedItemId}
        />
      </div>
    </section>
  );
}
