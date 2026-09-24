-- Row Level Security.
--
-- Catalog / product tables: readable by anyone (anon + authenticated),
-- matching what's shown on the public site. All writes to every table in
-- this app go through the service-role admin client from trusted Server
-- Actions (see lib/supabase/admin.ts), which bypasses RLS entirely — so no
-- INSERT/UPDATE/DELETE policies are needed for anon/authenticated roles.
--
-- repair_bookings holds customer PII and gets NO public policies at all:
-- only the service-role client can read or write it.

alter table public.repair_devices enable row level security;
alter table public.repair_device_brands enable row level security;
alter table public.repair_issues enable row level security;
alter table public.repair_stores enable row level security;
alter table public.shop_categories enable row level security;
alter table public.shop_brands enable row level security;
alter table public.product_sections enable row level security;
alter table public.products enable row level security;
alter table public.repair_bookings enable row level security;

create policy "Public read repair_devices"
  on public.repair_devices for select
  to anon, authenticated
  using (true);

create policy "Public read repair_device_brands"
  on public.repair_device_brands for select
  to anon, authenticated
  using (true);

create policy "Public read repair_issues"
  on public.repair_issues for select
  to anon, authenticated
  using (true);

create policy "Public read repair_stores"
  on public.repair_stores for select
  to anon, authenticated
  using (true);

create policy "Public read shop_categories"
  on public.shop_categories for select
  to anon, authenticated
  using (true);

create policy "Public read shop_brands"
  on public.shop_brands for select
  to anon, authenticated
  using (true);

create policy "Public read product_sections"
  on public.product_sections for select
  to anon, authenticated
  using (true);

create policy "Public read active products"
  on public.products for select
  to anon, authenticated
  using (is_active = true);
