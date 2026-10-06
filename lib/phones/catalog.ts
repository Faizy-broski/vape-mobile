// Shared (client + server) details for the New Stock phone catalogue.
//
// Prices, stock and the options on sale live in Supabase like every other
// product — phones are products in the "phones" category with one variant
// per memory + colour, named "8GB / 256GB · Black" — so they're edited from
// /admin/products and priced at checkout like the rest of the shop. What
// lives here is fixed manufacturer detail: swatch colours and spec sheets.

export const PHONE_CATEGORY_SLUG = "phones";

// Phone brands are kept out of the vape shop's brand strip and filters.
export const PHONE_BRAND_NAMES = ["Samsung", "Apple"];

export const NEW_STOCK_STORE = "25 Kingston";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Display-only "£1,080" — cart lines keep the "£1080.00" form checkout compares against. */
export function displayPrice(value: number) {
  return gbp.format(value);
}

const VARIANT_SEPARATOR = " · ";

/** "8GB / 256GB · Black" → { memory: "8GB / 256GB", colour: "Black" }. */
export function parseVariantName(name: string) {
  const index = name.lastIndexOf(VARIANT_SEPARATOR);
  if (index === -1) return { memory: name, colour: null };
  return {
    memory: name.slice(0, index).trim(),
    colour: name.slice(index + VARIANT_SEPARATOR.length).trim(),
  };
}

const SWATCHES: Record<string, string> = {
  "peach pink": "#F3C7BC",
  white: "#EEEEEC",
  black: "#2A2B2F",
  "light green": "#C9DFC1",
  blue: "#7F9DCB",
  violet: "#B6A3D8",
  grey: "#8A8E95",
  "cosmic orange": "#E9772F",
  "deep blue": "#2E3C5E",
  silver: "#E2E3E6",
};

export function swatchFor(colour: string | null) {
  return (colour && SWATCHES[colour.toLowerCase()]) ?? "#9CA3AF";
}

export type PhoneSpecs = {
  network: "4G" | "5G";
  tagline: string;
  highlights: string[];
  specs: [label: string, value: string][];
  inTheBox: string[];
};

const SAMSUNG_BOX = ["Handset", "USB-C to USB-C cable", "SIM ejection pin", "Quick start guide"];
const IPHONE_BOX = ["iPhone 17 Pro Max", "USB-C Charge Cable (1 m, woven)", "Documentation"];

// Keyed by product slug.
export const PHONE_SPECS: Record<string, PhoneSpecs> = {
  "apple-iphone-17-pro-max": {
    network: "5G",
    tagline: "Apple's most powerful iPhone, with the biggest display and longest battery life yet.",
    highlights: [
      "6.9\" ProMotion display up to 120Hz",
      "A19 Pro chip with vapour-chamber cooling",
      "Triple 48MP Pro Fusion cameras",
      "18MP Center Stage front camera",
    ],
    specs: [
      ["Display", "6.9\" Super Retina XDR OLED, ProMotion up to 120Hz, Always-On"],
      ["Chip", "A19 Pro"],
      ["Rear cameras", "48MP Fusion main · 48MP Ultra Wide · 48MP Telephoto (up to 8× optical-quality zoom)"],
      ["Front camera", "18MP Center Stage"],
      ["Video", "4K Dolby Vision up to 120 fps, ProRes RAW"],
      ["Build", "Heat-forged aluminium unibody, Ceramic Shield 2 front"],
      ["Water resistance", "IP68"],
      ["Charging", "USB-C, MagSafe & Qi2.2 wireless"],
      ["Software", "iOS 26"],
      ["Connectivity", "5G, Wi-Fi 7, Bluetooth 6"],
    ],
    inTheBox: IPHONE_BOX,
  },
  "samsung-galaxy-a57-5g": {
    network: "5G",
    tagline: "Samsung's flagship A-series — premium design, pro-grade camera and Galaxy AI.",
    highlights: [
      "6.7\" Super AMOLED, 120Hz",
      "50MP main camera with OIS",
      "8GB RAM · 256GB storage",
      "Long-term OS & security updates",
    ],
    specs: [
      ["Display", "6.7\" FHD+ Super AMOLED, 120Hz"],
      ["Memory", "8GB RAM · 256GB storage"],
      ["Rear cameras", "50MP main (OIS) · ultra-wide · macro"],
      ["Battery", "5,000mAh with fast charging"],
      ["Build", "Glass back, metal frame, IP-rated dust & water resistance"],
      ["Security", "In-display fingerprint, Samsung Knox"],
      ["Software", "Android with One UI, Galaxy AI features"],
      ["Network", "5G, dual SIM"],
    ],
    inTheBox: SAMSUNG_BOX,
  },
  "samsung-galaxy-a56-5g": {
    network: "5G",
    tagline: "A metal-framed all-rounder with a bright 120Hz display and Awesome Intelligence.",
    highlights: [
      "6.7\" Super AMOLED, 120Hz",
      "Exynos 1580 processor",
      "50MP OIS triple camera",
      "45W Super Fast Charging",
    ],
    specs: [
      ["Display", "6.7\" FHD+ Super AMOLED, 120Hz, Vision Booster"],
      ["Processor", "Exynos 1580 (4nm)"],
      ["Memory", "8GB RAM · 128GB storage"],
      ["Rear cameras", "50MP main (OIS) · 12MP ultra-wide · 5MP macro"],
      ["Front camera", "12MP"],
      ["Battery", "5,000mAh, 45W Super Fast Charging"],
      ["Build", "Gorilla Glass Victus+ front & back, metal frame, IP67"],
      ["Security", "In-display fingerprint, Samsung Knox Vault"],
      ["Software", "Android 15 / One UI 7 with 6 OS upgrades"],
      ["Network", "5G, dual SIM"],
    ],
    inTheBox: SAMSUNG_BOX,
  },
  "samsung-galaxy-a37-5g": {
    network: "5G",
    tagline: "The newest mid-range Galaxy — sleek, fast and built to last.",
    highlights: [
      "6.7\" Super AMOLED, 120Hz",
      "50MP main camera with OIS",
      "6GB RAM · 128GB storage",
      "Long-term OS & security updates",
    ],
    specs: [
      ["Display", "6.7\" FHD+ Super AMOLED, 120Hz"],
      ["Memory", "6GB RAM · 128GB storage"],
      ["Rear cameras", "50MP main (OIS) · ultra-wide · macro"],
      ["Battery", "5,000mAh with fast charging"],
      ["Build", "Glass back, IP-rated dust & water resistance"],
      ["Security", "In-display fingerprint, Samsung Knox"],
      ["Software", "Android with One UI, Galaxy AI features"],
      ["Network", "5G, dual SIM"],
    ],
    inTheBox: SAMSUNG_BOX,
  },
  "samsung-galaxy-a36-5g": {
    network: "5G",
    tagline: "Slim, tough and smart — Snapdragon power with Samsung's Awesome Intelligence.",
    highlights: [
      "6.7\" Super AMOLED, 120Hz",
      "Snapdragon 6 Gen 3",
      "50MP OIS triple camera",
      "45W Super Fast Charging",
    ],
    specs: [
      ["Display", "6.7\" FHD+ Super AMOLED, 120Hz, Vision Booster"],
      ["Processor", "Snapdragon 6 Gen 3 (4nm)"],
      ["Memory", "6GB or 8GB RAM · 128GB storage"],
      ["Rear cameras", "50MP main (OIS) · 8MP ultra-wide · 5MP macro"],
      ["Front camera", "12MP"],
      ["Battery", "5,000mAh, 45W Super Fast Charging"],
      ["Build", "Gorilla Glass Victus+ front & back, IP67"],
      ["Security", "In-display fingerprint, Samsung Knox Vault"],
      ["Software", "Android 15 / One UI 7 with 6 OS upgrades"],
      ["Network", "5G, dual SIM"],
    ],
    inTheBox: SAMSUNG_BOX,
  },
  "samsung-galaxy-a27-5g": {
    network: "5G",
    tagline: "Big-screen Galaxy with loads of storage and 5G at a great price.",
    highlights: [
      "6.7\" Super AMOLED display",
      "8GB RAM · 256GB storage",
      "50MP triple camera",
      "5,000mAh all-day battery",
    ],
    specs: [
      ["Display", "6.7\" FHD+ Super AMOLED, 120Hz"],
      ["Memory", "8GB RAM · 256GB storage"],
      ["Rear cameras", "50MP main · ultra-wide · macro"],
      ["Battery", "5,000mAh with fast charging"],
      ["Security", "Fingerprint sensor, Samsung Knox"],
      ["Software", "Android with One UI and long-term updates"],
      ["Network", "5G, dual SIM"],
    ],
    inTheBox: SAMSUNG_BOX,
  },
  "samsung-galaxy-a26-5g": {
    network: "5G",
    tagline: "Water-resistant, glass-backed and built for years of updates.",
    highlights: [
      "6.7\" Super AMOLED, 120Hz",
      "IP67 dust & water resistance",
      "50MP OIS triple camera",
      "6 years of OS upgrades",
    ],
    specs: [
      ["Display", "6.7\" FHD+ Super AMOLED, 120Hz"],
      ["Processor", "Exynos 1380 (5nm)"],
      ["Memory", "6GB / 128GB or 8GB / 256GB"],
      ["Rear cameras", "50MP main (OIS) · 8MP ultra-wide · 2MP macro"],
      ["Front camera", "13MP"],
      ["Battery", "5,000mAh, 25W fast charging"],
      ["Build", "Gorilla Glass Victus+ front, glass back, IP67"],
      ["Storage expansion", "microSD up to 2TB"],
      ["Software", "Android 15 / One UI 7 with 6 OS upgrades"],
      ["Network", "5G, dual SIM"],
    ],
    inTheBox: SAMSUNG_BOX,
  },
  "samsung-galaxy-a17-5g": {
    network: "5G",
    tagline: "A slim 5G Galaxy with a Super AMOLED screen and a stabilised 50MP camera.",
    highlights: [
      "6.7\" Super AMOLED, 90Hz",
      "50MP main camera with OIS",
      "IP54 splash resistance",
      "6 years of OS upgrades",
    ],
    specs: [
      ["Display", "6.7\" FHD+ Super AMOLED, 90Hz"],
      ["Processor", "Exynos 1330 (5nm)"],
      ["Memory", "4GB RAM · 128GB storage"],
      ["Rear cameras", "50MP main (OIS) · 5MP ultra-wide · 2MP macro"],
      ["Front camera", "13MP"],
      ["Battery", "5,000mAh, 25W fast charging"],
      ["Build", "Gorilla Glass Victus front, IP54"],
      ["Storage expansion", "microSD up to 2TB"],
      ["Software", "Android 15 / One UI 7 with 6 OS upgrades"],
      ["Network", "5G, dual SIM"],
    ],
    inTheBox: SAMSUNG_BOX,
  },
  "samsung-galaxy-a17-4g": {
    network: "4G",
    tagline: "Super AMOLED, a stabilised camera and long-term updates without the 5G price.",
    highlights: [
      "6.7\" Super AMOLED, 90Hz",
      "50MP main camera with OIS",
      "Up to 8GB RAM · 256GB storage",
      "6 years of OS upgrades",
    ],
    specs: [
      ["Display", "6.7\" FHD+ Super AMOLED, 90Hz"],
      ["Processor", "MediaTek Helio G99"],
      ["Memory", "4GB / 128GB or 8GB / 256GB"],
      ["Rear cameras", "50MP main (OIS) · 5MP ultra-wide · 2MP macro"],
      ["Front camera", "13MP"],
      ["Battery", "5,000mAh, 25W fast charging"],
      ["Build", "IP54 splash resistance"],
      ["Storage expansion", "microSD up to 2TB"],
      ["Software", "Android 15 / One UI 7 with 6 OS upgrades"],
      ["Network", "4G LTE, dual SIM"],
    ],
    inTheBox: SAMSUNG_BOX,
  },
  "samsung-galaxy-a07-5g": {
    network: "5G",
    tagline: "Affordable 5G with a big, smooth screen and a battery that keeps going.",
    highlights: [
      "6.7\" display, smooth refresh rate",
      "50MP main camera",
      "4GB RAM · 128GB storage",
      "6 years of OS upgrades",
    ],
    specs: [
      ["Display", "6.7\" HD+ PLS LCD, high refresh rate"],
      ["Processor", "MediaTek Dimensity 6300 (6nm)"],
      ["Memory", "4GB RAM · 128GB storage"],
      ["Rear cameras", "50MP main · 2MP depth"],
      ["Front camera", "8MP"],
      ["Battery", "Big-capacity battery with 25W fast charging"],
      ["Build", "IP54 splash resistance"],
      ["Storage expansion", "microSD up to 2TB"],
      ["Software", "Android 15 / One UI 7 with 6 OS upgrades"],
      ["Network", "5G, dual SIM"],
    ],
    inTheBox: SAMSUNG_BOX,
  },
  "samsung-galaxy-a07-4g": {
    network: "4G",
    tagline: "Our best-value Galaxy — big screen, 50MP camera and years of updates.",
    highlights: [
      "6.7\" HD+ display, 90Hz",
      "MediaTek Helio G99",
      "50MP main camera",
      "6 years of OS upgrades",
    ],
    specs: [
      ["Display", "6.7\" HD+ PLS LCD, 90Hz"],
      ["Processor", "MediaTek Helio G99"],
      ["Memory", "4GB / 64GB or 4GB / 128GB"],
      ["Rear cameras", "50MP main · 2MP depth"],
      ["Front camera", "8MP"],
      ["Battery", "5,000mAh, 25W fast charging"],
      ["Build", "IP54 splash resistance"],
      ["Storage expansion", "microSD up to 2TB"],
      ["Software", "Android 15 / One UI 7 with 6 OS upgrades"],
      ["Network", "4G LTE, dual SIM"],
    ],
    inTheBox: SAMSUNG_BOX,
  },
  "samsung-galaxy-a06-5g": {
    network: "5G",
    tagline: "The most affordable way into Samsung 5G.",
    highlights: [
      "6.7\" HD+ display",
      "MediaTek Dimensity 6300",
      "50MP main camera",
      "5,000mAh battery",
    ],
    specs: [
      ["Display", "6.7\" HD+ PLS LCD, 90Hz"],
      ["Processor", "MediaTek Dimensity 6300 (6nm)"],
      ["Memory", "4GB RAM · 128GB storage"],
      ["Rear cameras", "50MP main · 2MP depth"],
      ["Front camera", "8MP"],
      ["Battery", "5,000mAh, 25W fast charging"],
      ["Build", "IP54 splash resistance"],
      ["Storage expansion", "microSD up to 1TB"],
      ["Security", "Side-key fingerprint, Samsung Knox Vault"],
      ["Network", "5G, dual SIM"],
    ],
    inTheBox: SAMSUNG_BOX,
  },
  "samsung-galaxy-a06-4g": {
    network: "4G",
    tagline: "Everyday essentials done right — big screen, big battery, small price.",
    highlights: [
      "6.7\" HD+ display",
      "MediaTek Helio G85",
      "50MP main camera",
      "5,000mAh battery",
    ],
    specs: [
      ["Display", "6.7\" HD+ PLS LCD"],
      ["Processor", "MediaTek Helio G85"],
      ["Memory", "4GB RAM · 64GB storage"],
      ["Rear cameras", "50MP main · 2MP depth"],
      ["Front camera", "8MP"],
      ["Battery", "5,000mAh, 25W fast charging"],
      ["Storage expansion", "microSD up to 1TB"],
      ["Security", "Side-key fingerprint, Samsung Knox Vault"],
      ["Software", "Android 14 / One UI 6 with 4 OS upgrades"],
      ["Network", "4G LTE, dual SIM"],
    ],
    inTheBox: SAMSUNG_BOX,
  },
};
