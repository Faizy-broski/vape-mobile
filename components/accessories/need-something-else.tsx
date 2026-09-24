import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NeedSomethingElse() {
  return (
    <section className="wrap pb-16 sm:pb-24">
      <div className="flex flex-col items-start gap-5 rounded-3xl bg-card p-6 ring-1 ring-foreground/10 xs:flex-row xs:items-center xs:justify-between xs:p-8">
        <div>
          <h3 className="font-heading text-xl font-black tracking-tight uppercase xs:text-2xl">
            Can&apos;t find what you need?
          </h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Ask at the counter or book a repair — we stock adapters, screen
            protectors and power banks too.
          </p>
        </div>
        <Link
          href="/repairs/book"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ask Us
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
