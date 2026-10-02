# Supabase setup

This folder contains everything needed to stand up the database this app
reads and writes to: repair catalog, repair bookings, vape shop catalog
(categories, brands, product sections) and the full product catalog.

## 1. Create a project

Create a project at https://supabase.com/dashboard (or use an existing one).

## 2. Run the migrations

**Option A — SQL Editor (fastest, no CLI needed)**

Open the project's SQL Editor and run each file in `supabase/migrations/` in
order (they're numbered, so alphabetical order is correct):

1. `20260101000001_repair_catalog.sql`
2. `20260101000002_repair_bookings.sql`
3. `20260101000003_shop_catalog.sql`
4. `20260101000004_products.sql`
5. `20260101000005_rls_policies.sql`
6. `20260101000006_seed_data.sql`
7. `20260101000007_product_image_storage.sql`
8. `20260101000008_orders.sql`
9. `20260101000009_product_details.sql`
10. `20260101000010_product_variants.sql`

**Option B — Supabase CLI**

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

## 3. Get your keys

In the project's Settings → API page, you need three values:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — it
  bypasses Row Level Security and is only ever used server-side)

Add all three to `.env.local` (see `.env.example`).

## What's public vs. protected

- `repair_devices`, `repair_device_brands`, `repair_issues`, `repair_stores`,
  `shop_categories`, `shop_brands`, `product_sections`, and `products`
  (where `is_active = true`) are readable by anyone — that's what powers the
  public site.
- `repair_bookings` (customer name/email/phone) has **no public policies at
  all**. Only the service-role admin client, used from Server Actions after
  the admin password check, can read or write it.
- Every write in the app (admin catalog edits, product CRUD, booking status
  changes, new bookings) goes through the service-role client from a Server
  Action — never directly from the browser — so RLS never needs
  INSERT/UPDATE/DELETE policies for the anon role.

## Importing the V&M Online catalogue

`scripts/import-vandm.mjs` copies the vape products (not the mobile
products) from https://www.vandmonline.co.uk — a Shopify store — into
`products` and `product_variants`, creates any missing brands, and copies
every product image into the `product-images` bucket. It needs
`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
and migration `20260101000010_product_variants.sql` applied.

```bash
pnpm import:vandm                      # dry run: prints counts, writes .import-cache/vandm/preview.json
pnpm import:vandm --write --limit 5    # import 5 products to check they look right
pnpm import:vandm --write              # import everything
pnpm import:vandm --write --refresh    # later: re-download the source and sync prices/stock
```

Category comes from the product title (the source store's own collections
are mis-tagged) — the rules are at the top of the script. Shopify doesn't
publish stock counts, so in-stock options get a stock of 10 and sold-out
ones 0. Re-running overwrites imported fields (name, description, price,
image, category, brand) but never homepage section or sort order.
