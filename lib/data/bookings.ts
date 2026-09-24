import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BookingStatus, RepairBooking } from "@/lib/supabase/types";

export type NewBookingInput = {
  device: string;
  brand: string;
  issue: string;
  name: string;
  email: string;
  phone: string;
  store: string;
  notes: string;
};

export async function addBooking(input: NewBookingInput) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("repair_bookings")
    .insert({ ...input, status: "new" })
    .select()
    .single();
  if (error) throw error;
  return data as RepairBooking;
}

export type BookingFilters = {
  status?: BookingStatus;
  device?: string;
  brand?: string;
  query?: string;
};

export async function listBookings(filters: BookingFilters = {}): Promise<RepairBooking[]> {
  const supabase = createAdminClient();
  let query = supabase.from("repair_bookings").select("*").order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.device) query = query.eq("device", filters.device);
  if (filters.brand) query = query.eq("brand", filters.brand);
  if (filters.query) {
    const q = filters.query.replace(/[%,]/g, "");
    query = query.or(
      `name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,device.ilike.%${q}%,brand.ilike.%${q}%,issue.ilike.%${q}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const supabase = createAdminClient();
  await supabase.from("repair_bookings").update({ status }).eq("id", id);
}

export async function getBookingStats() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("repair_bookings").select("status");
  if (error) throw error;

  const rows = data ?? [];
  return {
    total: rows.length,
    new: rows.filter((r) => r.status === "new").length,
    inProgress: rows.filter((r) => r.status === "in_progress").length,
    completed: rows.filter((r) => r.status === "completed").length,
    cancelled: rows.filter((r) => r.status === "cancelled").length,
  };
}

export async function getDistinctDevices() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("repair_bookings").select("device");
  return Array.from(new Set((data ?? []).map((r) => r.device))).sort();
}

export async function getDistinctBrands() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("repair_bookings").select("brand");
  return Array.from(new Set((data ?? []).map((r) => r.brand))).sort();
}
