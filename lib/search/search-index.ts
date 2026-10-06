export type SearchResult = {
  title: string;
  description?: string;
  href: string;
  group: string;
};

const PAGES: SearchResult[] = [
  { title: "Home", href: "/", group: "Pages" },
  { title: "Tech Repair", href: "/repairs", group: "Pages" },
  { title: "New Stock — Brand New Phones", href: "/new-stock", group: "Pages" },
  { title: "Vape Shop", href: "/vape-shop", group: "Pages" },
  { title: "Book a Repair", href: "/repairs/book", group: "Pages" },
];

const REPAIR_CATEGORIES: SearchResult[] = [
  { title: "Phone Repair", href: "/repairs/book?device=phone", group: "Repairs" },
  { title: "Tablet Repair", href: "/repairs/book?device=tablet", group: "Repairs" },
  { title: "Laptop Repair", href: "/repairs/book?device=laptop", group: "Repairs" },
  { title: "PC Desktop Repair", href: "/repairs/book?device=pc-desktop", group: "Repairs" },
  { title: "Data Recovery", href: "/repairs/book?device=data-recovery", group: "Repairs" },
  { title: "Drone Repair", href: "/repairs/book?device=drone", group: "Repairs" },
  { title: "Game Console Repair", href: "/repairs/book?device=game-console", group: "Repairs" },
];

const VAPE_CATEGORIES: SearchResult[] = [
  { title: "Vape Kits", href: "/vape-shop/category/vape-kits", group: "Vape Categories" },
  { title: "Vape Juice", href: "/vape-shop/category/vape-juice", group: "Vape Categories" },
  { title: "Nic Salts", href: "/vape-shop/category/nic-salts", group: "Vape Categories" },
  { title: "Coils", href: "/vape-shop/category/coils", group: "Vape Categories" },
  { title: "Spare Pods", href: "/vape-shop/category/spare-pods", group: "Vape Categories" },
];

// Product search now lives in Supabase rather than a static bundle, so it
// isn't included in this client-side index yet. Wiring it up means fetching
// products server-side and threading them down through SiteHeader — a
// reasonable follow-up once the catalog is live.
export const SEARCH_INDEX: SearchResult[] = [...PAGES, ...REPAIR_CATEGORIES, ...VAPE_CATEGORIES];
