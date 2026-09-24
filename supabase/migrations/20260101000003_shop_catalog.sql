-- Vape shop catalog: "Shop by Category" tiles, the brand strip, and the
-- homepage product row definitions (Starter Kits, Best Sellers, etc). The
-- actual products live in 20260101000004_products.sql.

create table if not exists public.shop_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  image text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.shop_brands (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  image text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.product_sections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  href text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
