-- Checkout orders submitted from /checkout, managed from /admin/orders.
-- Contains customer PII (name/email/phone/address), so — like
-- repair_bookings — this table gets no public RLS policies at all; only
-- the service-role admin client can read or write it.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  notes text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10, 2) not null default 0 check (subtotal >= 0),
  status text not null default 'new'
    check (status in ('new', 'processing', 'ready', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

alter table public.orders enable row level security;
