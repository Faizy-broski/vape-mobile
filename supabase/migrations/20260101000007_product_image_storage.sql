-- Storage bucket for product images uploaded from /admin/products. Publicly
-- readable (so product photos render on the storefront), writable only by
-- the service-role admin client (see lib/supabase/admin.ts) — the same
-- write model used for every other table in this app.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read product-images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');
