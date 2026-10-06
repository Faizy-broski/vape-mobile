import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Phone, Smartphone } from "lucide-react";
import { CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/contact";
import { NEW_STOCK_STORE } from "@/lib/phones/catalog";

const PERKS = [
  {
    icon: BadgeCheck,
    title: "Genuine & sealed",
    body: "Every handset is brand new and factory sealed in its original box.",
  },
  {
    icon: MapPin,
    title: `Collect at ${NEW_STOCK_STORE}`,
    body: "Order online and pick up in store — or pop in to see them in person.",
  },
  {
    icon: Smartphone,
    title: "Kit it out",
    body: "Grab a case, charger or cable at the counter to go with your new phone.",
  },
];

export function NewStockHelp() {
  return (
    <section className="wrap pb-16 sm:pb-24">
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
        {PERKS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-3xl bg-muted/60 p-6">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 font-heading text-base font-bold tracking-tight">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col items-start gap-5 rounded-3xl bg-card p-6 ring-1 ring-foreground/10 xs:p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-heading text-xl font-black tracking-tight uppercase xs:text-2xl">
            Looking for a different model?
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            New stock arrives every week. Give us a call and we&apos;ll check availability or order
            it in for you.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 xs:flex-row">
          <a
            href={CONTACT_PHONE_HREF}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Phone className="size-4" />
            {CONTACT_PHONE}
          </a>
          <Link
            href="/stores"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Find the shop
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
