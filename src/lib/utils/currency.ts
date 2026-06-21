/**
 * Currency Utility Functions
 */

/**
 * Format a number to Indonesian Rupiah format.
 * Example: 50000 → "Rp 50.000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
