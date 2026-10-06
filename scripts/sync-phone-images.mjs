// Replaces the New Stock phone illustrations with official product photos:
// Samsung's own catalogue renders (looked up by model code through
// samsung.com's product finder) and Apple Store finish images. Each photo is
// trimmed, centred on a transparent square, converted to WebP, uploaded to
// the product-images bucket and set on the matching variant.
//
//   pnpm sync:phone-images            dry run — download + process, no upload
//   pnpm sync:phone-images --write    upload and update Supabase
//
// Uploaded URLs are recorded in scripts/phone-images.json, which
// seed-phones.mjs reads so a re-seed keeps the photos.

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const WRITE = process.argv.includes("--write");
const BUCKET = "product-images";
const SIZE = 1200;
const PADDING = 0.08;
const MAP_FILE = path.resolve("scripts/phone-images.json");
const HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
};

const apple = (finish) =>
  `https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch-${finish}?wid=5120&hei=2880&fmt=png-alpha`;

// [product slug, colour as named in the variant, source]. Samsung sources
// are model codes; colours that model was never made in (A06 4G Light Green,
// A07 5G Blue) are left out and keep their illustration.
const PHOTOS = [
  ["apple-iphone-17-pro-max", "Cosmic Orange", { url: apple("cosmicorange") }],
  ["apple-iphone-17-pro-max", "Deep Blue", { url: apple("deepblue") }],
  ["apple-iphone-17-pro-max", "Silver", { url: apple("silver") }],
  ["samsung-galaxy-a57-5g", "Grey", { model: "SM-A576BZADEUB" }], // Awesome Gray
  ["samsung-galaxy-a57-5g", "Blue", { model: "SM-A576BLBDEUB" }], // Awesome Icyblue
  ["samsung-galaxy-a56-5g", "Black", { model: "SM-A566BZKCEUB" }], // Awesome Graphite
  ["samsung-galaxy-a56-5g", "White", { model: "SM-A566BZACEUB" }], // Awesome Lightgray
  ["samsung-galaxy-a37-5g", "Black", { model: "SM-A376BZABEUB" }], // Awesome Charcoal
  ["samsung-galaxy-a36-5g", "White", { model: "SM-A366BZAGEUB" }],
  ["samsung-galaxy-a36-5g", "Black", { model: "SM-A366BZKGEUB" }],
  ["samsung-galaxy-a27-5g", "Black", { model: "SM-A276BZKCEUB" }],
  ["samsung-galaxy-a26-5g", "Peach Pink", { model: "SM-A266BZIIMEA" }],
  ["samsung-galaxy-a26-5g", "White", { model: "SM-A266BZWCEUB" }],
  ["samsung-galaxy-a26-5g", "Black", { model: "SM-A266BZKCEUB" }],
  ["samsung-galaxy-a17-5g", "Black", { model: "SM-A176BZKAEUB" }],
  ["samsung-galaxy-a17-4g", "Black", { model: "SM-A175FZKBEUB" }],
  ["samsung-galaxy-a17-4g", "Blue", { model: "SM-A175FLBBEUB" }], // Light Blue
  ["samsung-galaxy-a07-4g", "Violet", { model: "SM-A075FLVDMEA" }], // Light Violet
  ["samsung-galaxy-a07-4g", "Black", { model: "SM-A075FZKDMEA" }],
  ["samsung-galaxy-a06-5g", "Black", { model: "SM-A066EZKVMEA" }],
  ["samsung-galaxy-a06-4g", "Black", { model: "SM-A065FZKDMEA" }],
  ["samsung-galaxy-a06-4g", "Blue", { model: "SM-A065FLBDMEA" }], // Light Blue
];

// Model code suffix → samsung.com site that sells it.
const SITE_BY_SUFFIX = { EUB: "uk", MEA: "ae" };

async function fetchOk(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

/** modelCode → full-size gallery render URL, from samsung.com's product finder. */
async function samsungRenders(sites) {
  const renders = new Map();
  for (const site of sites) {
    const url = `https://searchapi.samsung.com/v6/front/b2c/product/finder/global?type=01010000&siteCode=${site}&start=1&num=200&sort=newest&onlyFilterInfoYN=N&keySummaryYN=Y`;
    const json = await (await fetchOk(url)).json();
    for (const family of json.response?.resultData?.productList ?? []) {
      for (const model of family.modelList ?? []) {
        if (model.largeUrl) renders.set(model.modelCode, `https:${model.largeUrl}?$ORIGIN_PNG$`);
      }
    }
  }
  return renders;
}

/**
 * Apple's finish images sit on an opaque #f5f5f7 backdrop. Clears the
 * backdrop by flood-filling from the edges (so light finishes like Silver
 * aren't eaten) and feathers the anti-aliased rim.
 */
async function removeBackdrop(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const bg = [data[0], data[1], data[2]];
  const dist = (i) =>
    Math.max(Math.abs(data[i] - bg[0]), Math.abs(data[i + 1] - bg[1]), Math.abs(data[i + 2] - bg[2]));
  const CLEAR = 6;
  const FEATHER = 40;

  const seen = new Uint8Array(width * height);
  const stack = [];
  for (let x = 0; x < width; x++) stack.push(x, (height - 1) * width + x);
  for (let y = 0; y < height; y++) stack.push(y * width, y * width + width - 1);
  while (stack.length > 0) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    const i = p * 4;
    const d = dist(i);
    if (d > FEATHER) continue;
    if (d > CLEAR) {
      // Rim pixel: partly backdrop. Fade it, but don't spread further in.
      data[i + 3] = Math.round(((d - CLEAR) / (FEATHER - CLEAR)) * 255);
      continue;
    }
    data[i + 3] = 0;
    const x = p % width;
    if (x > 0) stack.push(p - 1);
    if (x < width - 1) stack.push(p + 1);
    if (p >= width) stack.push(p - width);
    if (p < width * (height - 1)) stack.push(p + width);
  }
  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

async function processImage(buffer, { matte = false } = {}) {
  let source = buffer;
  if (matte) {
    // Crop to the phone first (keeps the flood fill small), leaving a thin
    // backdrop border so the fill can reach every side.
    const cropped = await sharp(buffer)
      .trim({ threshold: 4 })
      .extend({ top: 4, bottom: 4, left: 4, right: 4, background: "#f5f5f7" })
      .toBuffer();
    source = await removeBackdrop(cropped);
  }
  const trimmed = await sharp(source).trim({ threshold: 10 }).toBuffer();
  const inner = Math.round(SIZE * (1 - PADDING * 2));
  const fitted = await sharp(trimmed)
    .resize(inner, inner, { fit: "inside", withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  const { width, height } = fitted.info;
  return sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: fitted.data, left: Math.round((SIZE - width) / 2), top: Math.round((SIZE - height) / 2) }])
    .webp({ quality: 88, alphaQuality: 100 })
    .toBuffer();
}

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (see .env.example).");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

const fileName = (slug, colour) => `${slug}-${colour.toLowerCase().replace(/\s+/g, "-")}.webp`;

async function main() {
  const sites = new Set(
    PHOTOS.flatMap(([, , src]) => (src.model ? [SITE_BY_SUFFIX[src.model.slice(-3)]] : [])),
  );
  const renders = await samsungRenders(sites);
  const supabase = WRITE ? client() : null;
  const previewDir = path.resolve(".import-cache/phone-images");
  await fs.mkdir(previewDir, { recursive: true });

  const map = JSON.parse(await fs.readFile(MAP_FILE, "utf8").catch(() => "{}"));

  for (const [slug, colour, src] of PHOTOS) {
    const sourceUrl = src.url ?? renders.get(src.model);
    if (!sourceUrl) throw new Error(`No Samsung render found for ${src.model} (${slug} ${colour})`);
    const image = await processImage(Buffer.from(await (await fetchOk(sourceUrl)).arrayBuffer()), {
      matte: Boolean(src.url),
    });
    const name = fileName(slug, colour);
    await fs.writeFile(path.join(previewDir, name), image);

    if (!supabase) {
      console.log(`${slug} · ${colour}  ←  ${src.model ?? "Apple"}  (${Math.round(image.length / 1024)} KB)`);
      continue;
    }

    const objectPath = `phones/${name}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(objectPath, image, { contentType: "image/webp", upsert: true, cacheControl: "31536000" });
    if (error) throw new Error(`upload ${objectPath}: ${error.message}`);
    // Version the URL so browsers and next/image pick up a re-upload.
    const publicUrl = `${supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl}?v=${Date.now()}`;
    map[`${slug}|${colour}`] = publicUrl;
    console.log(`${slug} · ${colour}  →  ${objectPath}`);
  }

  if (!supabase) {
    console.log(`\nDry run — previews in ${previewDir}. Re-run with --write to upload.`);
    return;
  }

  await fs.writeFile(MAP_FILE, `${JSON.stringify(map, null, 2)}\n`);

  // Point each variant (and each product's cover) at its photo.
  const slugs = [...new Set(PHOTOS.map(([slug]) => slug))];
  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, variants:product_variants(id, name, image, sort_order)")
    .in("slug", slugs);
  if (error) throw new Error(`load products: ${error.message}`);

  for (const product of products) {
    const variants = [...product.variants].sort((a, b) => a.sort_order - b.sort_order);
    for (const v of variants) {
      const colour = v.name.split(" · ").pop();
      const url = map[`${product.slug}|${colour}`];
      if (!url) continue;
      v.image = url;
      const { error: e } = await supabase.from("product_variants").update({ image: url }).eq("id", v.id);
      if (e) throw new Error(`update variant ${v.name}: ${e.message}`);
    }
    // Cover: the first option that has a real photo.
    const cover = variants.find((v) => v.image?.startsWith("http"))?.image;
    if (cover) {
      const { error: e } = await supabase.from("products").update({ image: cover }).eq("id", product.id);
      if (e) throw new Error(`update product ${product.slug}: ${e.message}`);
    }
  }
  console.log("\nSupabase updated.");
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
