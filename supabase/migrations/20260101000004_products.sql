-- Full product catalog, managed from /admin/products.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references public.product_sections(id) on delete set null,
  category_id uuid references public.shop_categories(id) on delete set null,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  old_price numeric(10, 2) check (old_price is null or old_price >= 0),
  badge text check (badge is null or badge in ('Sale', 'New')),
  image text not null,
  stock int not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_section_idx on public.products(section_id);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(is_active);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();
