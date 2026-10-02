-- Product variants (flavour / strength / colour options). A product with no
-- variants is sold as-is using products.price/stock; a product with variants
-- is sold per variant, and products.price/old_price hold the cheapest
-- variant's price so listings can show "From £X" and price filters/sorting
-- keep working on the products table alone.

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  old_price numeric(10, 2) check (old_price is null or old_price >= 0),
  stock int not null default 0 check (stock >= 0),
  image text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, name)
);

create index if not exists product_variants_product_idx on public.product_variants(product_id);

drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row
  execute function public.set_updated_at();

-- Same model as products: public can read active variants of active
-- products; every write goes through the service-role admin client.
alter table public.product_variants enable row level security;

create policy "Public read active product_variants"
  on public.product_variants for select
  to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.is_active = true
    )
  );

-- Categories added for the V&M Online catalogue import. The tile images are
-- placeholders until the import script swaps in a product photo.
insert into public.shop_categories (slug, name, image, sort_order) values
  ('nic-shots', 'Nic Shots', '/vape/vapes/4.png', 11),
  ('vape-accessories', 'Vape Accessories', '/vape/vapes/8.png', 12)
on conflict (slug) do nothing;
