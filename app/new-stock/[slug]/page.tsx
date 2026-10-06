import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Box, Check, ChevronRight, MapPin, PackageCheck, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PhonePurchase } from "@/components/new-stock/phone-purchase";
import { PhoneCard } from "@/components/new-stock/phone-card";
import { getNewStockPhone, listNewStockPhones } from "@/lib/data/phones";
import { NEW_STOCK_STORE, PHONE_SPECS, displayPrice } from "@/lib/phones/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const fallback = { title: "New Stock — V&M Vape | Mobile" };
  if (!isSupabaseConfigured()) return fallback;
  const { slug } = await params;
  const phone = await getNewStockPhone(slug);
  if (!phone) return fallback;
  return {
    title: `${phone.name} — Brand New from ${displayPrice(phone.price)} | V&M Vape | Mobile`,
    description: PHONE_SPECS[phone.slug]?.tagline ?? phone.description ?? undefined,
  };
}

export default async function PhonePage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isSupabaseConfigured()) notFound();

  const { slug } = await params;
  const [phone, all] = await Promise.all([getNewStockPhone(slug), listNewStockPhones()]);
  if (!phone) notFound();

  const spec = PHONE_SPECS[phone.slug];
  const related = all
    .filter((p) => p.id !== phone.id && p.stock > 0)
    .sort(
      (a, b) =>
        Number(b.brand?.name === phone.brand?.name) - Number(a.brand?.name === phone.brand?.name) ||
        Math.abs(a.price - phone.price) - Math.abs(b.price - phone.price),
    )
    .slice(0, 4);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="wrap pt-6 pb-12 sm:pt-8 sm:pb-16">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link href="/new-stock" className="hover:text-foreground">
              New Stock
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="truncate text-foreground">{phone.name}</span>
          </nav>

          <PhonePurchase phone={phone} />

          <ul className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: PackageCheck, title: "Brand new & sealed", body: "Original box, never opened." },
              { icon: MapPin, title: `Collect at ${NEW_STOCK_STORE}`, body: "Order online, pick up in store." },
              { icon: ShieldCheck, title: "Secure checkout", body: "We confirm every order with you." },
            ].map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4">
                <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {spec && (
          <section className="bg-[oklch(0.15_0.02_155)] py-14 text-white sm:py-20">
            <div className="wrap">
              <span className="text-xs font-semibold tracking-[0.2em] text-[oklch(0.82_0.15_141)] uppercase">
                Highlights
              </span>
              <h2 className="mt-3 max-w-3xl font-heading text-2xl leading-tight font-black tracking-tight xs:text-3xl sm:text-4xl">
                {spec.tagline}
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-3 xs:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                {spec.highlights.map((h, i) => (
                  <div
                    key={h}
                    className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 transition-colors hover:bg-white/8"
                  >
                    <span className="font-heading text-sm font-black text-white/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-6 font-heading text-lg leading-snug font-bold">{h}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="wrap section-y">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                Overview
              </span>
              <h2 className="mt-2 font-heading text-2xl font-black tracking-tight uppercase xs:text-3xl">
                About this phone
              </h2>
              {phone.description && (
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {phone.description.split(/\n\s*\n/).map((para) => (
                    <p key={para.slice(0, 32)}>{para}</p>
                  ))}
                </div>
              )}

              {spec && (
                <div className="mt-8 rounded-3xl border border-border/70 p-6">
                  <h3 className="flex items-center gap-2 font-heading text-base font-bold">
                    <Box className="size-4.5 text-primary" />
                    What&apos;s in the box
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {spec.inTheBox.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm">
                        <Check className="size-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {spec && (
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                  Tech Specs
                </span>
                <h2 className="mt-2 font-heading text-2xl font-black tracking-tight uppercase xs:text-3xl">
                  Specifications
                </h2>
                <dl className="mt-5 divide-y divide-border overflow-hidden rounded-3xl border border-border/70">
                  <div className="grid grid-cols-[8rem_1fr] gap-4 bg-muted/50 px-5 py-4 text-sm sm:grid-cols-[11rem_1fr]">
                    <dt className="font-semibold">Network</dt>
                    <dd className="text-muted-foreground">{spec.network}</dd>
                  </div>
                  {spec.specs.map(([label, value], i) => (
                    <div
                      key={label}
                      className={`grid grid-cols-[8rem_1fr] gap-4 px-5 py-4 text-sm sm:grid-cols-[11rem_1fr] ${i % 2 === 1 ? "bg-muted/50" : ""}`}
                    >
                      <dt className="font-semibold">{label}</dt>
                      <dd className="text-muted-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">
                  Manufacturer specifications. Features may vary by region and software version.
                </p>
              </div>
            )}
          </div>
        </section>

        {related.length > 0 && (
          <section className="wrap pb-16 sm:pb-24">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-heading text-xl font-black tracking-tight uppercase xs:text-2xl">
                More New Stock
              </h2>
              <Link
                href="/new-stock"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5"
              >
                View all
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 xs:gap-4 sm:gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <PhoneCard key={p.id} phone={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
