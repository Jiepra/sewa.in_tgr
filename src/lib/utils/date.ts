/**
 * Date Utility Functions
 */

import { differenceInCalendarDays, parseISO } from "date-fns";

/**
 * Calculate the number of rental days between two date strings.
 * Minimum 1 day.
 *
 * @param startDate - ISO date string (YYYY-MM-DD)
 * @param endDate   - ISO date string (YYYY-MM-DD)
 * @returns number of rental days (minimum 1)
 */
export function calculateRentalDays(
  startDate: string,
  endDate: string
): number {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const days = differenceInCalendarDays(end, start);
  return Math.max(days, 1);
}

/**
 * Format a Date object or ISO string to a readable Indonesian date.
 * Example: "21 Juni 2026"
 */
export function formatDateId(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
