/**
 * Booking Utility Functions
 * All rental price and booking code logic lives here.
 */

import { calculateRentalDays } from "./date";

// ============================================================
// Types (inline to avoid circular imports at this layer)
// ============================================================

export interface BookingItemInput {
  price_per_day: number;
  quantity: number;
}

// ============================================================
// Price Calculation
// ============================================================

/**
 * Calculate the total rental amount for a list of items.
 *
 * Formula: Σ (price_per_day × quantity) × rental_days
 */
export function calculateBookingTotal(
  items: BookingItemInput[],
  startDate: string,
  endDate: string
): number {
  const days = calculateRentalDays(startDate, endDate);
  return items.reduce((total, item) => {
    return total + item.price_per_day * item.quantity * days;
  }, 0);
}

/**
 * Calculate the minimum DP (down payment) — 50% of total.
 */
export function calculateDpAmount(totalAmount: number): number {
  return Math.ceil(totalAmount * 0.5);
}

/**
 * Calculate the remaining amount after DP.
 */
export function calculateRemainingAmount(
  totalAmount: number,
  dpAmount: number
): number {
  return totalAmount - dpAmount;
}

// ============================================================
// Booking Code Generator
// ============================================================

/**
 * Generate a unique booking code.
 * Format: SIT-YYYYMMDD-XXXX (e.g. SIT-20260621-A3B7)
 */
export function generateBookingCode(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;
  const randomPart = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `SIT-${datePart}-${randomPart}`;
}

// ============================================================
// Phone Formatter
// ============================================================

/**
 * Normalize phone number to Indonesian format (62xxx).
 * Handles formats: 08xxx, +628xxx, 628xxx
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    return "62" + cleaned.slice(1);
  }
  if (cleaned.startsWith("62")) {
    return cleaned;
  }
  return cleaned;
}

/**
 * Build a WhatsApp confirmation message for a booking.
 */
export function buildWhatsAppMessage(
  bookingCode: string,
  customerName: string,
  dpAmount: number
): string {
  const dp = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(dpAmount);

  return encodeURIComponent(
    `Halo, saya sudah melakukan transfer DP untuk booking sewa_in.tgr.\n\nKode Booking: ${bookingCode}\nNama: ${customerName}\nJumlah DP: ${dp}\n\nMohon dikonfirmasi. Terima kasih!`
  );
}
