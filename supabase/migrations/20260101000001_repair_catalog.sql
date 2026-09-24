-- Repair catalog: devices, per-device brands, issue types and store
-- locations shown in the /repairs/book wizard and managed from
-- /admin/catalog.

create extension if not exists "pgcrypto";

create table if not exists public.repair_devices (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  image text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.repair_device_brands (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.repair_devices(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (device_id, name)
);

create table if not exists public.repair_issues (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.repair_stores (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists repair_device_brands_device_idx
  on public.repair_device_brands(device_id);
