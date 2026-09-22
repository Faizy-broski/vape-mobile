export type Product = {
  name: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  image: string;
};

export type ProductSectionData = {
  title: string;
  href: string;
  products: Product[];
};

export const PRODUCT_SECTIONS: ProductSectionData[] = [
  {
    title: "Starter Kits",
    href: "/vape-shop/category/starter-kits",
    products: [
      { name: "Lost Mary BM6000", price: "£14.99", image: "/vape/carousel/starter-kits-1.png" },
      { name: "IVG Pro 10K Kit", price: "£16.99", image: "/vape/carousel/starter-kits-2.png" },
      {
        name: "Double Brew Bundle",
        price: "£12.99",
        oldPrice: "£17.99",
        badge: "Sale",
        image: "/vape/carousel/starter-kits-3.png",
      },
      {
        name: "Riot Squad Pro Max+",
        price: "£13.99",
        badge: "New",
        image: "/vape/carousel/starter-kits-4.png",
      },
    ],
  },
  {
    title: "Big Puff Kits & Pods",
    href: "/vape-shop/category/big-puff-kits-pods",
    products: [
      { name: "Vape Kit Pro", price: "£14.99", image: "/vape/vapes/1.png" },
      {
        name: "Puff Bar Edition",
        price: "£12.99",
        oldPrice: "£16.99",
        badge: "Sale",
        image: "/vape/vapes/2.png",
      },
      {
        name: "Big Puff Max Kit",
        price: "£13.99",
        oldPrice: "£17.99",
        badge: "Sale",
        image: "/vape/vapes/3.png",
      },
      { name: "Crystal Pod Refill", price: "£9.99", image: "/vape/vapes/9.png" },
    ],
  },
  {
    title: "E-Liquids",
    href: "/vape-shop/category/e-liquids",
    products: [
      { name: "Mixed Berries Shortfill", price: "£9.99", image: "/vape/vapes/4.png" },
      { name: "Nic Salt Twist Pack", price: "£4.99", image: "/vape/vapes/5.png" },
      {
        name: "Classic Tobacco 10ml",
        price: "£3.99",
        oldPrice: "£5.99",
        badge: "Sale",
        image: "/vape/vapes/6.png",
      },
      {
        name: "Tropical Fruit Burst",
        price: "£9.99",
        badge: "New",
        image: "/vape/vapes/7.png",
      },
    ],
  },
  {
    title: "Best Sellers",
    href: "/vape-shop/category/best-sellers",
    products: [
      { name: "Aspire Pod Kit", price: "£14.99", image: "/vape/carousel/vape-1.png" },
      {
        name: "Voopoo Pod Kit",
        price: "£13.99",
        oldPrice: "£17.99",
        badge: "Sale",
        image: "/vape/carousel/vape-2.png",
      },
      { name: "OXVA Origin Kit", price: "£15.99", image: "/vape/carousel/vape-3.png" },
      {
        name: "Caliburn G3 Kit",
        price: "£16.99",
        badge: "New",
        image: "/vape/carousel/vape-4.png",
      },
    ],
  },
];
