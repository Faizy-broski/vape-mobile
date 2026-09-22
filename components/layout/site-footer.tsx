import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const FOOTER_COLUMNS = [
  {
    title: "Services",
    links: ["Phone Repair", "Laptop Repair", "Data Recovery", "Get a Quote"],
  },
  {
    title: "Shop",
    links: ["Starter Kits", "E-Liquids", "Accessories", "Best Sellers"],
  },
  {
    title: "Contact",
    links: ["Find a Store", "0800 123 4567", "hello@vapeandmobile.co.uk"],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="container-px relative z-10 mx-auto max-w-7xl py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-current text-xs font-heading font-bold">
              V&M
            </span>
            <p className="mt-4 max-w-[20ch] text-sm text-primary-foreground/70">
              Your local tech repair specialists and vape shop.
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold tracking-[0.15em] text-primary-foreground/50 uppercase">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-primary-foreground/15" />

        <p className="text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} V&M Vape | Mobile. All rights reserved.
        </p>
      </div>

      <p
        aria-hidden
        className="pointer-events-none absolute -bottom-6 left-1/2 w-full -translate-x-1/2 text-center font-heading text-[16vw] leading-none font-black whitespace-nowrap text-primary-foreground/[0.05] select-none"
      >
        RELIABLE REPAIRS. DONE PROPERLY.
      </p>
    </footer>
  );
}
