-- Repair booking requests submitted from /repairs/book, managed from
-- /admin/bookings. Contains customer PII, so this table gets no public RLS
-- policies (see 20260101000005_rls_policies.sql) — only the service-role
-- admin client can read or write it.

create table if not exists public.repair_bookings (
  id uuid primary key default gen_random_uuid(),
  device text not null,
  brand text not null,
  issue text not null,
  name text not null,
  email text not null,
  phone text not null,
  store text,
  notes text,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists repair_bookings_status_idx on public.repair_bookings(status);
create index if not exists repair_bookings_device_idx on public.repair_bookings(device);
create index if not exists repair_bookings_brand_idx on public.repair_bookings(brand);
create index if not exists repair_bookings_created_at_idx on public.repair_bookings(created_at desc);
