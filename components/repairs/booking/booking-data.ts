export type Device = {
  slug: string;
  name: string;
  image: string;
};

export const DEVICES: Device[] = [
  { slug: "phone", name: "Phone", image: "/tech/repairs/phone.png" },
  { slug: "tablet", name: "Tablet", image: "/tech/repairs/tablet.png" },
  { slug: "laptop", name: "Laptop", image: "/tech/repairs/laptop.png" },
  { slug: "pc-desktop", name: "PC Desktop", image: "/tech/repairs/pc.png" },
  {
    slug: "data-recovery",
    name: "Data Recovery",
    image: "/tech/repairs/data-recovery.png",
  },
  { slug: "drone", name: "Drone", image: "/tech/repairs/drone.png" },
  {
    slug: "game-console",
    name: "Game Console",
    image: "/tech/repairs/gaming-console.png",
  },
  {
    slug: "other",
    name: "Other Devices",
    image: "/tech/repairs/other-device.png",
  },
];

export const BRANDS_BY_DEVICE: Record<string, string[]> = {
  phone: ["Apple", "Samsung", "Google", "Huawei", "OnePlus", "Other"],
  tablet: ["Apple", "Samsung", "Microsoft", "Amazon", "Other"],
  laptop: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Other"],
  "pc-desktop": ["Custom Build", "Dell", "HP", "Alienware", "Other"],
  "data-recovery": ["Hard Drive", "SSD", "USB / Flash Drive", "Other"],
  drone: ["DJI", "Parrot", "Autel", "Other"],
  "game-console": ["PlayStation", "Xbox", "Nintendo Switch", "Other"],
  other: ["Not Listed"],
};

export const ISSUES = [
  "Screen Damage",
  "Battery",
  "Charging Port",
  "Camera",
  "Water Damage",
  "Software / Data",
  "Other",
];

export const STORES = ["Nearest available", "High Street"];

export function getDeviceBySlug(slug: string | undefined) {
  return DEVICES.find((d) => d.slug === slug) ?? DEVICES[0];
}
