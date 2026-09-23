import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const FOOTER_COLUMNS: {
  title: string;
  items: { label: string; href?: string }[];
}[] = [
  {
    title: "Services",
    items: [
      { label: "Repairs", href: "/repairs" },
      { label: "Shop", href: "/vape-shop" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Visit",
    items: [
      { label: "High Street" },
      { label: "United Kingdom" },
      { label: "Mon–Sat 9:30–18:00" },
    ],
  },
  {
    title: "Contact",
    items: [
      { label: "01234 567 890", href: "tel:01234567890" },
      { label: "hello@V&M.co.uk", href: "mailto:hello@vandm.co.uk" },
    ],
  },
  {
    title: "Social",
    items: [
      { label: "Instagram", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "Google", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[oklch(0.28_0.05_155)] text-white">
      <p
        aria-hidden
        className="pointer-events-none absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading leading-none font-black text-white/5 select-none"
        style={{ fontSize: "clamp(10rem, 36vw, 46rem)" }}
      >
        V&M
      </p>

      <div className="wrap relative z-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 xs:grid-cols-2 lg:grid-cols-5">
          <div className="xs:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/V&M-logo.svg"
                alt="V&M"
                width={36}
                height={36}
                className="size-9"
              />
              <span className="font-heading text-base font-bold tracking-tight">
                VAPE <span className="text-white/50 font-normal">|</span> MOBILE
              </span>
            </Link>
            <p className="mt-4 max-w-[24ch] text-sm text-white/50">
              Phone, tablet and laptop repair. Accessories at the counter.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold tracking-[0.15em] text-white/60 uppercase">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) =>
                  item.href ? (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={item.label} className="text-sm text-white/50">
                      {item.label}
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-white/15" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-heading text-lg font-black tracking-tight uppercase xs:text-xl sm:text-2xl">
            Reliable repairs. Done properly.
          </p>
          <p className="text-xs tracking-wide text-white/40 uppercase">
            © {new Date().getFullYear()} V&amp;M Vape | Mobile
          </p>
        </div>
      </div>
    </footer>
  );
}
