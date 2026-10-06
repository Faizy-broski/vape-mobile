// Loads the brand-new boxed phones in stock at the 25 Kingston shop into
// Supabase, as products in the "phones" category with one variant per
// memory + colour. These power /new-stock and the homepage "New Stock" row.
//
//   pnpm seed:phones            dry run — print what would be written
//   pnpm seed:phones --write    actually write to Supabase
//
// Safe to re-run: products upsert on slug and variants on (product, name).
// Re-running resets price, stock, description and images of the phones
// below to what's listed here, so after the first run prefer editing stock
// from /admin/products; homepage section is never touched.

import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const WRITE = process.argv.includes("--write");
const CATEGORY = { slug: "phones", name: "Phones", sort_order: 100 };

// Official photos uploaded by sync-phone-images.mjs; anything without one
// falls back to the bundled illustration.
const PHOTOS = JSON.parse(
  fs.existsSync(new URL("./phone-images.json", import.meta.url))
    ? fs.readFileSync(new URL("./phone-images.json", import.meta.url), "utf8")
    : "{}",
);
const img = (stem, colour) =>
  PHOTOS[`${stem}|${colour}`] ?? `/tech/phones/${stem}-${colour.toLowerCase().replace(/\s+/g, "-")}.svg`;

// Each stock line is [RAM / storage, colour, price £, units]. Units are how
// many identical boxes are on the shelf.
const PHONES = [
  {
    slug: "apple-iphone-17-pro-max",
    name: "Apple iPhone 17 Pro Max",
    brand: "Apple",
    badge: "New",
    description:
      "Brand new, sealed in box. iPhone 17 Pro Max is Apple's most powerful iPhone yet — a heat-forged aluminium unibody with vapour-chamber cooling lets the A19 Pro chip sustain peak performance for gaming, editing and AI.\n\n" +
      "The 6.9\" Super Retina XDR display with ProMotion and Always-On is protected by Ceramic Shield 2, and the redesigned camera plateau houses three 48MP Pro Fusion cameras — main, Ultra Wide and a Telephoto with up to 8× optical-quality zoom. The 18MP Center Stage front camera frames selfies and video calls automatically, landscape or portrait, without turning the phone.\n\n" +
      "With the biggest battery ever in an iPhone, USB-C, MagSafe, IP68 water resistance and iOS 26, it's built for the long haul.",
    lines: [
      ["256GB", "Cosmic Orange", 1080, 1],
      ["256GB", "Deep Blue", 1080, 1],
      ["256GB", "Silver", 1080, 1],
    ],
  },
  {
    slug: "samsung-galaxy-a57-5g",
    name: "Samsung Galaxy A57 5G",
    brand: "Samsung",
    badge: "New",
    description:
      "Brand new, sealed in box. The Galaxy A57 5G is the top of Samsung's 2026 A-series — a premium glass-and-metal design, a 6.7\" Super AMOLED display at 120Hz and a 50MP stabilised main camera that shoots crisp photos day and night.\n\n" +
      "8GB of RAM and 256GB of storage give plenty of room for apps, photos and video, while Galaxy AI tools help you edit, search and translate. A 5,000mAh battery with fast charging, IP-rated durability, Samsung Knox security and long-term software support make it a phone to keep for years.",
    lines: [
      ["8GB / 256GB", "Grey", 390, 1],
      ["8GB / 256GB", "Blue", 390, 1],
    ],
  },
  {
    slug: "samsung-galaxy-a56-5g",
    name: "Samsung Galaxy A56 5G",
    brand: "Samsung",
    badge: null,
    description:
      "Brand new, sealed in box. The Galaxy A56 5G brings flagship touches to the mid-range: a metal frame, Gorilla Glass Victus+ on both sides and IP67 dust and water resistance.\n\n" +
      "Its 6.7\" FHD+ Super AMOLED display runs at 120Hz with Vision Booster for outdoor visibility. The Exynos 1580 chip powers Samsung's Awesome Intelligence features, and the 50MP OIS main camera is joined by a 12MP ultra-wide and 5MP macro. A 5,000mAh battery with 45W Super Fast Charging and six generations of Android upgrades round it out.",
    lines: [
      ["8GB / 128GB", "Black", 295, 1],
      ["8GB / 128GB", "White", 295, 2],
    ],
  },
  {
    slug: "samsung-galaxy-a37-5g",
    name: "Samsung Galaxy A37 5G",
    brand: "Samsung",
    badge: "New",
    description:
      "Brand new, sealed in box. The 2026 Galaxy A37 5G pairs a sleek, durable design with a vivid 6.7\" Super AMOLED display at 120Hz and a 50MP main camera with optical image stabilisation.\n\n" +
      "6GB RAM and 128GB storage keep everyday apps flowing, Galaxy AI features help with photos and productivity, and a 5,000mAh battery with fast charging gets you through the day. Samsung Knox security and long-term software updates included.",
    lines: [["6GB / 128GB", "Black", 330, 2]],
  },
  {
    slug: "samsung-galaxy-a36-5g",
    name: "Samsung Galaxy A36 5G",
    brand: "Samsung",
    badge: null,
    description:
      "Brand new, sealed in box. The Galaxy A36 5G is slim, tough and smart — Gorilla Glass Victus+ front and back, IP67 dust and water resistance, and a 6.7\" Super AMOLED display at 120Hz.\n\n" +
      "Snapdragon 6 Gen 3 powers Samsung's Awesome Intelligence features like Circle to Search and Object Eraser. The 50MP OIS triple camera, 12MP selfie camera, 5,000mAh battery with 45W Super Fast Charging and six generations of OS upgrades make it one of the best-value phones you can buy.",
    lines: [
      ["6GB / 128GB", "White", 260, 1],
      ["6GB / 128GB", "Black", 260, 1],
      ["8GB / 128GB", "Black", 290, 1],
    ],
  },
  {
    slug: "samsung-galaxy-a27-5g",
    name: "Samsung Galaxy A27 5G",
    brand: "Samsung",
    badge: "New",
    description:
      "Brand new, sealed in box. The Galaxy A27 5G gives you a big, bright 6.7\" Super AMOLED display, fast 5G and a generous 8GB RAM / 256GB storage configuration — room for all your apps, photos and videos.\n\n" +
      "A 50MP triple camera captures sharp shots, a 5,000mAh battery with fast charging keeps going all day, and Samsung Knox plus long-term updates keep it secure for years.",
    lines: [["8GB / 256GB", "Black", 320, 1]],
  },
  {
    slug: "samsung-galaxy-a26-5g",
    name: "Samsung Galaxy A26 5G",
    brand: "Samsung",
    badge: null,
    description:
      "Brand new, sealed in box. The Galaxy A26 5G brings a glass back and IP67 dust and water resistance to an affordable 5G phone.\n\n" +
      "The 6.7\" FHD+ Super AMOLED display runs at a smooth 120Hz, the Exynos 1380 chip handles everyday multitasking, and the 50MP main camera with OIS is backed by an 8MP ultra-wide and 2MP macro. A 5,000mAh battery with 25W fast charging, microSD expansion up to 2TB and six years of Android upgrades complete the package.",
    lines: [
      ["6GB / 128GB", "Peach Pink", 249, 1],
      ["8GB / 256GB", "White", 310, 1],
      ["8GB / 256GB", "Black", 310, 1],
      ["8GB / 256GB", "Peach Pink", 310, 1],
    ],
  },
  {
    slug: "samsung-galaxy-a17-5g",
    name: "Samsung Galaxy A17 5G",
    brand: "Samsung",
    badge: "New",
    description:
      "Brand new, sealed in box. The Galaxy A17 5G is a slim 5G phone with a 6.7\" FHD+ Super AMOLED display at 90Hz and Gorilla Glass Victus protection.\n\n" +
      "Its 50MP main camera has optical image stabilisation for sharper low-light shots, joined by a 5MP ultra-wide and 2MP macro. Exynos 1330 power, a 5,000mAh battery with 25W fast charging, IP54 splash resistance and six years of OS upgrades make it a reliable everyday phone.",
    lines: [["4GB / 128GB", "Black", 180, 1]],
  },
  {
    slug: "samsung-galaxy-a17-4g",
    name: "Samsung Galaxy A17 4G",
    brand: "Samsung",
    badge: "New",
    description:
      "Brand new, sealed in box. The Galaxy A17 4G gives you a Super AMOLED display and a stabilised camera without paying for 5G.\n\n" +
      "Enjoy a 6.7\" FHD+ Super AMOLED screen at 90Hz, a 50MP OIS main camera with 5MP ultra-wide and 2MP macro, and the dependable Helio G99 processor. Available in 4GB/128GB or a roomy 8GB/256GB, with a 5,000mAh battery, 25W fast charging, IP54 splash resistance and six years of Android upgrades.",
    lines: [
      ["4GB / 128GB", "Black", 170, 2],
      ["8GB / 256GB", "Blue", 249, 1],
    ],
  },
  {
    slug: "samsung-galaxy-a07-5g",
    name: "Samsung Galaxy A07 5G",
    brand: "Samsung",
    badge: "New",
    description:
      "Brand new, sealed in box. The Galaxy A07 5G is affordable 5G done properly — a large 6.7\" display with a smooth refresh rate, the efficient MediaTek Dimensity 6300 chip and a 50MP main camera.\n\n" +
      "4GB RAM and 128GB storage (expandable with microSD), a long-lasting battery with 25W fast charging, IP54 splash resistance and six years of OS upgrades — exceptional value for a 5G Samsung.",
    lines: [["4GB / 128GB", "Blue", 160, 1]],
  },
  {
    slug: "samsung-galaxy-a07-4g",
    name: "Samsung Galaxy A07 4G",
    brand: "Samsung",
    badge: "New",
    description:
      "Brand new, sealed in box. The Galaxy A07 is the best-value way to get a current Samsung — a 6.7\" HD+ display at 90Hz, the capable Helio G99 processor and a 50MP main camera.\n\n" +
      "Choose 4GB/64GB or 4GB/128GB, both expandable with microSD up to 2TB. A 5,000mAh battery with 25W fast charging, IP54 splash resistance and an impressive six years of Android upgrades mean it'll stay fresh for years.",
    lines: [
      ["4GB / 64GB", "Violet", 130, 1],
      ["4GB / 64GB", "Black", 130, 1],
      ["4GB / 128GB", "Black", 149, 1],
    ],
  },
  {
    slug: "samsung-galaxy-a06-5g",
    name: "Samsung Galaxy A06 5G",
    brand: "Samsung",
    badge: null,
    description:
      "Brand new, sealed in box. The Galaxy A06 5G is the most affordable way into Samsung 5G — a 6.7\" HD+ display, MediaTek Dimensity 6300 processor and a 50MP main camera.\n\n" +
      "With 4GB RAM, 128GB storage (expandable with microSD), a 5,000mAh battery with 25W fast charging, IP54 splash resistance and a side-key fingerprint sensor, it covers everything you need day to day.",
    lines: [["4GB / 128GB", "Black", 149, 1]],
  },
  {
    slug: "samsung-galaxy-a06-4g",
    name: "Samsung Galaxy A06 4G",
    brand: "Samsung",
    badge: null,
    description:
      "Brand new, sealed in box. The Galaxy A06 covers the essentials brilliantly — a big 6.7\" HD+ display, MediaTek Helio G85 processor, 50MP main camera and a 5,000mAh battery with 25W fast charging.\n\n" +
      "4GB RAM and 64GB storage, expandable with microSD up to 1TB, plus a side-key fingerprint sensor and Samsung Knox Vault security. A perfect first smartphone or reliable backup.",
    lines: [
      ["4GB / 64GB", "Light Green", 110, 1],
      ["4GB / 64GB", "Black", 120, 1],
      ["4GB / 64GB", "Blue", 120, 1],
    ],
  },
];

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (see .env.example).");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function must(promise, label) {
  const { data, error } = await promise;
  if (error) throw new Error(`${label}: ${error.message}`);
  return data;
}

function buildRows() {
  return PHONES.map((phone, index) => {
    const variants = phone.lines.map(([memory, colour, price, units], order) => ({
      name: `${memory} · ${colour}`,
      price,
      old_price: null,
      stock: units,
      image: img(phone.slug, colour),
      is_active: true,
      sort_order: order,
    }));
    const cheapest = variants.reduce((min, v) => (v.price < min.price ? v : min));
    return {
      phone,
      product: {
        slug: phone.slug,
        name: phone.name,
        description: phone.description,
        price: cheapest.price,
        old_price: null,
        badge: phone.badge,
        image: variants[0].image,
        stock: variants.reduce((sum, v) => sum + v.stock, 0),
        is_active: true,
        sort_order: index,
      },
      variants,
    };
  });
}

async function main() {
  const rows = buildRows();
  for (const { product, variants } of rows) {
    console.log(`${product.name} — from £${product.price}, ${product.stock} in stock`);
    for (const v of variants) console.log(`    ${v.name.padEnd(28)} £${v.price}  ×${v.stock}`);
  }
  const units = rows.reduce((sum, r) => sum + r.product.stock, 0);
  console.log(`\n${rows.length} models, ${rows.reduce((s, r) => s + r.variants.length, 0)} options, ${units} phones.`);

  if (!WRITE) {
    console.log("\nDry run — re-run with --write to save to Supabase.");
    return;
  }

  const supabase = client();

  const [category] = await must(
    supabase
      .from("shop_categories")
      .upsert({ ...CATEGORY, image: rows[0].product.image }, { onConflict: "slug" })
      .select("id"),
    "upsert category",
  );

  const brandNames = [...new Set(PHONES.map((p) => p.brand))];
  await must(
    supabase.from("shop_brands").upsert(
      brandNames.map((name, i) => ({
        name,
        image: rows.find((r) => r.phone.brand === name).product.image,
        sort_order: 100 + i,
      })),
      { onConflict: "name", ignoreDuplicates: true },
    ),
    "upsert brands",
  );
  const brands = await must(
    supabase.from("shop_brands").select("id, name").in("name", brandNames),
    "load brands",
  );
  const brandId = new Map(brands.map((b) => [b.name, b.id]));

  const products = await must(
    supabase
      .from("products")
      .upsert(
        rows.map((r) => ({
          ...r.product,
          category_id: category.id,
          brand_id: brandId.get(r.phone.brand),
        })),
        { onConflict: "slug" },
      )
      .select("id, slug"),
    "upsert products",
  );
  const productId = new Map(products.map((p) => [p.slug, p.id]));

  for (const { product, variants } of rows) {
    const id = productId.get(product.slug);
    const names = variants.map((v) => v.name);
    // Drop options no longer listed so a sold-out colour doesn't linger.
    const existing = await must(
      supabase.from("product_variants").select("id, name").eq("product_id", id),
      "load variants",
    );
    const stale = existing.filter((v) => !names.includes(v.name)).map((v) => v.id);
    if (stale.length > 0) {
      await must(supabase.from("product_variants").delete().in("id", stale), "remove variants");
    }
    await must(
      supabase
        .from("product_variants")
        .upsert(variants.map((v) => ({ ...v, product_id: id })), { onConflict: "product_id,name" }),
      "upsert variants",
    );
  }

  console.log("\nSaved to Supabase.");
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
