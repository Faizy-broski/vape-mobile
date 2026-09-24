-- Adds a URL slug, a long description and an optional brand link to
-- products, so /vape-shop/product/[slug] has something to show and the
-- admin product form can capture richer detail.

alter table public.products
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists brand_id uuid references public.shop_brands(id) on delete set null;

-- Backfill slugs for rows created before this migration.
update public.products
set slug = trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
where slug is null;

-- De-duplicate any collisions from the backfill (two products with the same
-- name) by suffixing the row's short id.
update public.products p
set slug = p.slug || '-' || left(p.id::text, 8)
where p.slug in (
  select slug from public.products group by slug having count(*) > 1
);

alter table public.products alter column slug set not null;
alter table public.products add constraint products_slug_key unique (slug);

create index if not exists products_brand_idx on public.products(brand_id);

-- Reasonable category assignments for the seed products, so
-- /vape-shop/category/[slug] has something to show out of the box. Admin
-- can reassign any of this from /admin/products.
update public.products set category_id = (select id from public.shop_categories where slug = 'vape-kits')
where name in ('Lost Mary BM6000', 'IVG Pro 10K Kit', 'Double Brew Bundle', 'Riot Squad Pro Max+',
               'Aspire Pod Kit', 'Voopoo Pod Kit', 'OXVA Origin Kit', 'Caliburn G3 Kit');

update public.products set category_id = (select id from public.shop_categories where slug = 'big-puff-kits-pods')
where name in ('Vape Kit Pro', 'Puff Bar Edition', 'Big Puff Max Kit');

update public.products set category_id = (select id from public.shop_categories where slug = 'spare-pods')
where name in ('Crystal Pod Refill');

update public.products set category_id = (select id from public.shop_categories where slug = '50ml-shortfill')
where name in ('Mixed Berries Shortfill');

update public.products set category_id = (select id from public.shop_categories where slug = 'nic-salts')
where name in ('Nic Salt Twist Pack', 'Classic Tobacco 10ml');

update public.products set category_id = (select id from public.shop_categories where slug = 'vape-juice')
where name in ('Tropical Fruit Burst');

update public.products set brand_id = (select id from public.shop_brands where name = 'Lost Mary')
where name = 'Lost Mary BM6000';
