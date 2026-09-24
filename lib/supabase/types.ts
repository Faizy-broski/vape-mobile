export type RepairDevice = {
  id: string;
  slug: string;
  name: string;
  image: string;
  sort_order: number;
  created_at: string;
};

export type RepairDeviceBrand = {
  id: string;
  device_id: string;
  name: string;
  sort_order: number;
  created_at: string;
};

export type RepairIssue = {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
};

export type RepairStore = {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
};

export type BookingStatus = "new" | "in_progress" | "completed" | "cancelled";

export type RepairBooking = {
  id: string;
  device: string;
  brand: string;
  issue: string;
  name: string;
  email: string;
  phone: string;
  store: string | null;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
};

export type ShopCategory = {
  id: string;
  slug: string;
  name: string;
  image: string;
  sort_order: number;
  created_at: string;
};

export type ShopBrand = {
  id: string;
  name: string;
  image: string;
  sort_order: number;
  created_at: string;
};

export type ProductSection = {
  id: string;
  slug: string;
  title: string;
  href: string;
  sort_order: number;
  created_at: string;
};

export type ProductBadge = "Sale" | "New" | null;

export type Product = {
  id: string;
  section_id: string | null;
  category_id: string | null;
  name: string;
  price: number;
  old_price: number | null;
  badge: ProductBadge;
  image: string;
  stock: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// Note: the Supabase clients in this app (see server.ts / admin.ts /
// client.ts) are intentionally NOT parameterized with a generated
// `Database` type — supabase-js's generic constraints are fussy to satisfy
// by hand. Each data-access function in lib/data/*.ts casts query results
// to the row types above instead. Run `supabase gen types typescript` later
// if you want full query-builder type-safety.
