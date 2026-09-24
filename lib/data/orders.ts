import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type OrderStatus = "new" | "processing" | "ready" | "completed" | "cancelled";

export type OrderItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
};

export type Order = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  status: OrderStatus;
  created_at: string;
};

export type NewOrderInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  items: OrderItem[];
  subtotal: number;
};

export async function addOrder(input: NewOrderInput) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({ ...input, status: "new" })
    .select()
    .single();
  if (error) throw error;
  return data as Order;
}

export type OrderFilters = {
  status?: OrderStatus;
  query?: string;
};

export async function listOrders(filters: OrderFilters = {}): Promise<Order[]> {
  const supabase = createAdminClient();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.query) {
    const q = filters.query.replace(/[%,]/g, "");
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = createAdminClient();
  await supabase.from("orders").update({ status }).eq("id", id);
}

export async function getOrderStats() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("orders").select("status");
  if (error) throw error;

  const rows = data ?? [];
  return {
    total: rows.length,
    new: rows.filter((r) => r.status === "new").length,
    processing: rows.filter((r) => r.status === "processing").length,
    ready: rows.filter((r) => r.status === "ready").length,
    completed: rows.filter((r) => r.status === "completed").length,
    cancelled: rows.filter((r) => r.status === "cancelled").length,
  };
}
