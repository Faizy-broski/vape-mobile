export type Store = {
  slug: string;
  name: string;
  address: string;
  phone: string;
  hours: { days: string; time: string }[];
  services: string[];
  image: string;
};

export const STORES: Store[] = [
  {
    slug: "high-street",
    name: "High Street",
    address: "48 High Street, London, SW1A 1AA",
    phone: "01234 567 890",
    hours: [
      { days: "Mon – Sat", time: "9:30 – 18:00" },
      { days: "Sunday", time: "Closed" },
    ],
    services: ["Tech Repair", "Vape Shop", "Accessories"],
    image: "/tech/tech-repair.png",
  },
  {
    slug: "riverside",
    name: "Riverside Retail Park",
    address: "12 Riverside Retail Park, London, E14 5AB",
    phone: "01234 567 891",
    hours: [
      { days: "Mon – Sat", time: "10:00 – 18:00" },
      { days: "Sunday", time: "11:00 – 16:00" },
    ],
    services: ["Vape Shop", "Quick Repairs"],
    image: "/vape/vape-shop.png",
  },
];
