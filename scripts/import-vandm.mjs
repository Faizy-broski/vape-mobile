// Imports the vape catalogue from the V&M Online Shopify store
// (https://www.vandmonline.co.uk) into Supabase: products, their variants
// (flavours / strengths / colours), brands and product images.
//
//   pnpm import:vandm                 dry run — fetch, transform, write a preview
//   pnpm import:vandm --write         actually write to Supabase
//   pnpm import:vandm --write --limit 5   only the first 5 products (smoke test)
//   pnpm import:vandm --refresh       re-download the source instead of using the cache
//
// Safe to re-run: products upsert on slug (the Shopify handle) and variants
// on (product, name), so a second run updates prices/stock instead of
// duplicating. Re-running does overwrite admin edits to imported fields
// (name, description, price, image, category, brand); homepage section and
// sort order are never touched.

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const SOURCE = "https://www.vandmonline.co.uk";
const BUCKET = "product-images";
// Shopify doesn't publish stock counts, only available / sold out.
const DEFAULT_STOCK = 10;
const IMAGE_WIDTH = 1000;
// The store's Cloudflare front answers Node's default fetch with 429, so
// requests identify as a regular browser.
const REQUEST_HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
  "accept-language": "en-GB,en;q=0.9",
};

const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const REFRESH = args.includes("--refresh");
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;
const CACHE_DIR = args.includes("--cache-dir")
  ? path.resolve(args[args.indexOf("--cache-dir") + 1])
  : path.resolve(".import-cache/vandm");

// --- Classification -------------------------------------------------------

// The source store's collections are inconsistently tagged (pods filed under
// coils, nic salts under 100ml shortfill...), so category comes from the
// product title. First match wins; order matters.
const CATEGORY_RULES = [
  ["SKIP", /gift card|terea|iqos/i],
  ["nicotine-pouches", /pouch/i],
  ["nic-shots", /nic(otine)?\s*(salt\s*)?(shot|booster)|ice shot/i],
  ["coils", /\bcoils?\b|mesh pod/i],
  ["vape-accessories", /\btank\b|battery|charger|drip tip|glass\b|accessor/i],
  ["100ml-shortfill", /100\s?ml/i],
  ["50ml-shortfill", /50\s?ml/i],
  ["nic-salts", /nic(otine)?\s*salt/i],
  ["vape-juice", /e-?liquid|\b10\s?ml\b|juice/i],
  ["spare-pods", /replacement pod|\bpods?\b(?!.*(kit|system|device))|cartridge/i],
  // Refillable kits always count as Vape Kits, however many puffs.
  ["vape-kits", /refillable/i],
  ["big-puff-kits-pods", /\b\d{1,2}\s?k\b|\b(cl)?[2-9]\d{3}\b|\d{4,5}\s?puff|big puff|4-in-1/i],
  ["600-puff-kits-pods", /\b(bm)?600\b|\b500\b|ske bar|crystal plus/i],
  ["vape-kits", /kit|device|disposable|\bpen\b|\bmod\b|pod system|xros/i],
];

// Phones, cases, screen protectors and repairs aren't imported.
const MOBILE_COLLECTIONS = [
  "all-mobile", "mobile-all", "mobile-phones", "phone-cases", "phone-chargers",
  "tempered-glass", "apple", "screen-replacement", "battery-replacement", "samsung",
  "samsung-screen-replacement",
];
// Last resort for titles no rule recognises.
const FALLBACK_COLLECTIONS = [["vape-kits", ["all-vape-kits", "starter-vape-kits"]]];

// Most source products list the shop itself as vendor, so the brand comes
// from the title; the vendor is only used when it's a real brand.
const BRAND_RULES = [
  ["Lost Mary", /lost mary|maryliq/i],
  ["Elf Bar", /elf\s?bar|elfa|elf liq/i],
  ["SKE", /\bske\b|crystal plus/i],
  ["Oxva", /oxva/i],
  ["Vaporesso", /vaporesso|xros/i],
  ["Voopoo", /voopoo/i],
  ["Uwell", /uwell|caliburn/i],
  ["Innokin", /innokin/i],
  ["Aspire", /aspire|cleito/i],
  ["SMOK", /\bsmok\b/i],
  ["Geekvape", /geek\s?vape/i],
  ["IVG", /\bivg\b/i],
  ["Hayati", /hayati/i],
  ["Gold Bar", /gold bar/i],
  ["Al Fakher", /al fakher/i],
  ["Pyne Pod", /pyne pod/i],
  ["PIXL", /pixl/i],
  ["Juul", /juul/i],
  ["Elux", /elux/i],
  ["Ohm Brew", /ohm brew|double brew|slush brew/i],
  ["Zeus Juice", /zeus/i],
  ["Yeti", /\byeti\b/i],
  ["Vampire Vape", /vampire vape/i],
  ["Bar Juice", /bar juice/i],
  ["Dinner Lady", /dinner lady/i],
  ["Nasty Juice", /nasty/i],
  ["Nexus", /nexus/i],
  ["Pod Salt", /pod salt/i],
  ["Seriously", /seriously/i],
  ["Nic Nic", /nic\s?nic/i],
  ["Velo", /\bvelo\b/i],
  ["Zyn", /\bzyn\b/i],
  ["Killa", /killa/i],
  ["Pablo", /pablo/i],
];
const STORE_VENDOR = /v\s*&\s*m/i;

function classify(product, collections) {
  const rule = CATEGORY_RULES.find(([, re]) => re.test(product.title));
  if (rule) return rule[0];
  const fallback = FALLBACK_COLLECTIONS.find(([, handles]) => handles.some((h) => collections.has(h)));
  return fallback ? fallback[0] : null;
}

function brandFor(product) {
  const rule = BRAND_RULES.find(([, re]) => re.test(product.title));
  if (rule) return rule[0];
  return product.vendor && !STORE_VENDOR.test(product.vendor) ? product.vendor.trim() : null;
}

// --- Source fetching (cached on disk) -------------------------------------

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch(url, {
      headers: { ...REQUEST_HEADERS, accept: "application/json" },
    });
    const text = await res.text();
    if (res.ok) {
      try {
        return JSON.parse(text);
      } catch {
        // rate limiters sometimes answer 200 with a plain-text body
      }
    }
    const delay = 5000 * (attempt + 1);
    console.warn(`  ${res.status} from ${url} — retrying in ${delay / 1000}s`);
    await wait(delay);
  }
  throw new Error(`Gave up fetching ${url}`);
}

async function fetchAllProducts(pathname) {
  const all = [];
  for (let page = 1; ; page++) {
    const { products } = await fetchJson(`${SOURCE}${pathname}?limit=250&page=${page}`);
    if (!products?.length) return all;
    all.push(...products);
    await wait(1000);
  }
}

async function cached(name, load) {
  const file = path.join(CACHE_DIR, name);
  if (!REFRESH) {
    try {
      return JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
      // not cached yet
    }
  }
  const data = await load();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data));
  return data;
}

async function loadSource() {
  console.log(`Fetching ${SOURCE} catalogue${REFRESH ? "" : " (cached if available)"}…`);
  const products = await cached("products.json", () => fetchAllProducts("/products.json"));
  const membership = new Map();
  for (const handle of [...MOBILE_COLLECTIONS, ...FALLBACK_COLLECTIONS.flatMap(([, h]) => h)]) {
    const members = await cached(`collections/${handle}.json`, async () => {
      await wait(1000);
      return (await fetchAllProducts(`/collections/${handle}/products.json`)).map((p) => p.handle);
    });
    for (const productHandle of members) {
      if (!membership.has(productHandle)) membership.set(productHandle, new Set());
      membership.get(productHandle).add(handle);
    }
  }
  return { products, membership };
}

// --- Transform -------------------------------------------------------------

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'", nbsp: " ", pound: "£" };

function htmlToText(html) {
  if (!html) return null;
  const text = html
    .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, "")
    .replace(/<\s*li[^>]*>/gi, "\n• ")
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|h[1-6]|li|ul|ol|tr)\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#?\w+);/g, (m, code) =>
      ENTITIES[code] ?? (code.startsWith("#") ? String.fromCharCode(Number(code.slice(1))) : m),
    )
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line && line !== "•")
    .join("\n")
    .trim();
  return text || null;
}

function imageUrl(src) {
  if (!src) return null;
  const url = new URL(src.startsWith("//") ? `https:${src}` : src);
  url.searchParams.set("width", String(IMAGE_WIDTH));
  return url.toString();
}

function toMoney(value) {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

function transform(product, category) {
  const name = product.title.replace(/\s+/g, " ").trim();
  const isSingle =
    product.variants.length === 1 && /^default title$/i.test(product.variants[0].title);

  const seen = new Set();
  const variants = isSingle
    ? []
    : product.variants.map((v, index) => {
        let variantName = v.title.replace(/\s+/g, " ").trim();
        // Shopify keeps option combos unique, but not case-insensitively.
        if (seen.has(variantName.toLowerCase())) variantName = `${variantName} (${index + 1})`;
        seen.add(variantName.toLowerCase());
        const price = toMoney(v.price) ?? 0;
        const compareAt = toMoney(v.compare_at_price);
        return {
          name: variantName,
          price,
          old_price: compareAt && compareAt > price ? compareAt : null,
          stock: v.available ? DEFAULT_STOCK : 0,
          image: imageUrl(v.featured_image?.src),
          sort_order: index,
        };
      });

  // Same derivation as the admin form: the cheapest in-stock option sets the
  // product's "From" price; stock is the total across options.
  const single = product.variants[0];
  const priced = variants.filter((v) => v.stock > 0);
  const cheapest = (priced.length ? priced : variants).reduce(
    (min, v) => (min === null || v.price < min.price ? v : min),
    null,
  );
  const singlePrice = toMoney(single.price) ?? 0;
  const singleCompare = toMoney(single.compare_at_price);

  const onSale = product.variants.some(
    (v) => toMoney(v.compare_at_price) > (toMoney(v.price) ?? 0),
  );
  const isNew = product.tags.some((t) => /^__label\d?:new$/i.test(t));

  // Descriptions often open with a "Description" heading and/or the product
  // name repeated — both redundant on the product page.
  const description = htmlToText(product.body_html)?.split("\n") ?? [];
  const isHeading = (line) =>
    /^(•\s*)?(product\s+)?(description|details):?$/i.test(line) ||
    line.toLowerCase() === name.toLowerCase();
  while (description.length && isHeading(description[0])) description.shift();

  return {
    slug: product.handle,
    name,
    description: description?.join("\n") || null,
    category,
    brand: brandFor(product),
    image: imageUrl(product.images[0]?.src),
    badge: onSale ? "Sale" : isNew ? "New" : null,
    price: cheapest ? cheapest.price : singlePrice,
    old_price: cheapest
      ? cheapest.old_price
      : singleCompare && singleCompare > singlePrice
        ? singleCompare
        : null,
    stock: variants.length
      ? variants.reduce((sum, v) => sum + v.stock, 0)
      : single.available
        ? DEFAULT_STOCK
        : 0,
    variants,
  };
}

// --- Supabase writes -------------------------------------------------------

function chunk(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

function supabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (run via `pnpm import:vandm`, which loads .env.local).",
    );
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function must(promise, what) {
  const { data, error } = await promise;
  if (error) throw new Error(`${what}: ${error.message}`);
  return data;
}

/** Copies a Shopify image into our bucket once; returns its public URL. */
async function makeImageCopier(supabase) {
  const mapFile = path.join(CACHE_DIR, "uploaded-images.json");
  let uploaded = {};
  try {
    uploaded = JSON.parse(await fs.readFile(mapFile, "utf8"));
  } catch {
    // first run
  }

  const copy = async (src, folder) => {
    if (!src) return null;
    if (uploaded[src]) return uploaded[src];

    let res;
    for (let attempt = 0; attempt < 4; attempt++) {
      res = await fetch(src, { headers: REQUEST_HEADERS });
      if (res.ok) break;
      await wait(3000 * (attempt + 1));
    }
    if (!res.ok) {
      console.warn(`  could not download ${src} (${res.status}) — skipping`);
      return null;
    }
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const base = path.basename(new URL(src).pathname).replace(/[^a-zA-Z0-9._-]/g, "-");
    const objectPath = `vandm/${folder}/${base}`;
    await must(
      supabase.storage
        .from(BUCKET)
        .upload(objectPath, Buffer.from(await res.arrayBuffer()), { contentType, upsert: true }),
      `upload ${objectPath}`,
    );
    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
    uploaded[src] = publicUrl;
    await fs.writeFile(mapFile, JSON.stringify(uploaded, null, 2));
    return publicUrl;
  };
  return copy;
}

async function writeToSupabase(rows) {
  const supabase = supabaseClient();
  const copyImage = await makeImageCopier(supabase);

  // Categories: every one the rules use must already exist (migrations
  // 0006 + 0010 create them).
  const categories = await must(supabase.from("shop_categories").select("id, slug, image"), "load categories");
  const categoryId = new Map(categories.map((c) => [c.slug, c.id]));
  const missing = [...new Set(rows.map((r) => r.category))].filter((s) => !categoryId.has(s));
  if (missing.length) {
    throw new Error(`Missing shop_categories: ${missing.join(", ")} — run the latest migration first.`);
  }

  // Images first, so a failure here doesn't leave half-written products.
  console.log("Copying images into Supabase storage…");
  let done = 0;
  for (const row of rows) {
    row.image = await copyImage(row.image, row.slug);
    for (const v of row.variants) v.image = await copyImage(v.image, row.slug);
    if (++done % 10 === 0) console.log(`  ${done}/${rows.length} products`);
  }
  const skipped = rows.filter((r) => !r.image);
  if (skipped.length) {
    console.warn(`Skipping ${skipped.length} product(s) with no usable image: ${skipped.map((r) => r.slug).join(", ")}`);
  }
  const ready = rows.filter((r) => r.image);

  // Brands: match existing ones case-insensitively, create the rest using
  // their first product's photo until a logo is uploaded.
  const brands = await must(supabase.from("shop_brands").select("id, name, sort_order"), "load brands");
  const brandId = new Map(brands.map((b) => [b.name.toLowerCase(), b.id]));
  let nextSort = Math.max(0, ...brands.map((b) => b.sort_order)) + 1;
  const newBrands = [];
  for (const row of ready) {
    if (row.brand && !brandId.has(row.brand.toLowerCase())) {
      brandId.set(row.brand.toLowerCase(), null);
      newBrands.push({ name: row.brand, image: row.image, sort_order: nextSort++ });
    }
  }
  if (newBrands.length) {
    const created = await must(
      supabase.from("shop_brands").insert(newBrands).select("id, name"),
      "create brands",
    );
    for (const b of created) brandId.set(b.name.toLowerCase(), b.id);
    console.log(`Created ${created.length} brand(s): ${created.map((b) => b.name).join(", ")}`);
  }

  // New categories get a real photo instead of their placeholder tile.
  for (const slug of ["nic-shots", "vape-accessories"]) {
    const category = categories.find((c) => c.slug === slug);
    const first = ready.find((r) => r.category === slug);
    if (category && first && category.image.startsWith("/vape/")) {
      await must(
        supabase.from("shop_categories").update({ image: first.image }).eq("id", category.id),
        `update ${slug} image`,
      );
    }
  }

  // Products.
  console.log("Upserting products…");
  const productId = new Map();
  for (const batch of chunk(ready, 50)) {
    const saved = await must(
      supabase
        .from("products")
        .upsert(
          batch.map((r) => ({
            slug: r.slug,
            name: r.name,
            description: r.description,
            price: r.price,
            old_price: r.old_price,
            badge: r.badge,
            image: r.image,
            stock: r.stock,
            is_active: true,
            category_id: categoryId.get(r.category),
            brand_id: r.brand ? brandId.get(r.brand.toLowerCase()) : null,
          })),
          { onConflict: "slug" },
        )
        .select("id, slug"),
      "upsert products",
    );
    for (const p of saved) productId.set(p.slug, p.id);
  }

  // Variants: drop ones that disappeared from the source, upsert the rest.
  console.log("Syncing variants…");
  const ids = [...productId.values()];
  const existing = [];
  for (const batch of chunk(ids, 100)) {
    existing.push(
      ...(await must(
        supabase.from("product_variants").select("id, product_id, name").in("product_id", batch),
        "load variants",
      )),
    );
  }
  const wanted = new Set(
    ready.flatMap((r) => r.variants.map((v) => `${productId.get(r.slug)}|${v.name}`)),
  );
  const stale = existing.filter((v) => !wanted.has(`${v.product_id}|${v.name}`)).map((v) => v.id);
  for (const batch of chunk(stale, 200)) {
    await must(supabase.from("product_variants").delete().in("id", batch), "delete stale variants");
  }

  const variantRows = ready.flatMap((r) =>
    r.variants.map((v) => ({ ...v, product_id: productId.get(r.slug), is_active: true })),
  );
  for (const batch of chunk(variantRows, 500)) {
    await must(
      supabase.from("product_variants").upsert(batch, { onConflict: "product_id,name" }),
      "upsert variants",
    );
  }

  console.log(
    `Done: ${ready.length} products, ${variantRows.length} variants${stale.length ? `, ${stale.length} stale variants removed` : ""}.`,
  );
}

// --- Main ------------------------------------------------------------------

async function main() {
  const { products, membership } = await loadSource();

  const rows = [];
  const skipped = { mobile: [], excluded: [], unclassified: [] };
  for (const product of products) {
    const collections = membership.get(product.handle) ?? new Set();
    const looksVape = /vape|pod|coil|nic|e-liquid|kit/i.test(product.title);
    if (!looksVape && MOBILE_COLLECTIONS.some((h) => collections.has(h))) {
      skipped.mobile.push(product.title);
      continue;
    }
    const category = classify(product, collections);
    if (category === "SKIP") skipped.excluded.push(product.title);
    else if (!category) skipped.unclassified.push(product.title);
    else rows.push(transform(product, category));
  }

  const selected = rows.slice(0, LIMIT);
  const byCategory = {};
  for (const r of selected) (byCategory[r.category] ??= []).push(r.name);

  console.log(`\nSource: ${products.length} products`);
  console.log(`Importing: ${selected.length} products, ${selected.reduce((s, r) => s + r.variants.length, 0)} variants`);
  for (const [slug, names] of Object.entries(byCategory)) console.log(`  ${slug.padEnd(20)} ${names.length}`);
  console.log(`Skipped: ${skipped.mobile.length} mobile, ${skipped.excluded.length} excluded (${skipped.excluded.join(", ")})`);
  if (skipped.unclassified.length) {
    console.log(`Unclassified (not imported): \n  ${skipped.unclassified.join("\n  ")}`);
  }

  const previewFile = path.join(CACHE_DIR, "preview.json");
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(previewFile, JSON.stringify({ byCategory, skipped, products: selected }, null, 2));
  console.log(`\nFull preview: ${previewFile}`);

  if (!WRITE) {
    console.log("Dry run — nothing written. Re-run with --write to import.");
    return;
  }
  await writeToSupabase(selected);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
