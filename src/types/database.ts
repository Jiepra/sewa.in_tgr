// ============================================================
// Database Types — sewa_in.tgr
// Reflects the Supabase PostgreSQL schema from PRD.md
// ============================================================

export type UserRole = "owner" | "admin" | "staff";

export type ItemCondition = "good" | "maintenance" | "damaged" | "lost";

export type ItemUnitStatus =
  | "available"
  | "rented"
  | "maintenance"
  | "unavailable";

export type BookingStatus =
  | "pending_payment"
  | "payment_submitted"
  | "confirmed"
  | "ready_to_pickup"
  | "ongoing"
  | "returned"
  | "completed"
  | "cancelled";

export type GuaranteeType = "KTP" | "SIM";

export type PaymentStatus =
  | "pending"
  | "submitted"
  | "verified"
  | "rejected";

// ============================================================
// Table Row Types
// ============================================================

export interface Profile {
  id: string; // uuid, FK to auth.users
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Item {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price_per_day: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemUnit {
  id: string;
  item_id: string;
  unit_code: string;
  condition: ItemCondition;
  status: ItemUnitStatus;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_code: string;
  customer_id: string;
  rental_start_date: string; // ISO date string
  rental_end_date: string;   // ISO date string
  rental_days: number;
  guarantee_type: GuaranteeType;
  total_amount: number;
  dp_amount: number;
  remaining_amount: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingItem {
  id: string;
  booking_id: string;
  item_id: string;
  quantity: number;
  price_per_day_snapshot: number;
  subtotal: number;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  payment_method: string; // "bank_transfer"
  amount: number;
  proof_url: string | null;
  status: PaymentStatus;
  verified_by: string | null; // uuid of admin profile
  verified_at: string | null;
  created_at: string;
}

// ============================================================
// Joined / Extended Types (for UI use)
// ============================================================

export interface BookingWithCustomer extends Booking {
  customers: Customer;
}

export interface BookingDetail extends Booking {
  customers: Customer;
  booking_items: (BookingItem & { items: Item })[];
  payments: Payment[];
}

export interface ItemWithUnits extends Item {
  item_units: ItemUnit[];
}
