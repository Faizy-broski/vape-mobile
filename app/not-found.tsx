import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_0%,oklch(0.28_0.04_155)_0%,oklch(0.1_0.01_155)_65%)] px-5 py-16 text-center text-white xs:px-6 sm:py-24">
        <span className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
          Error 404
        </span>
        <h1 className="mt-4 font-heading leading-none font-black tracking-tight" style={{ fontSize: "clamp(4.5rem, 22vw, 10rem)" }}>
          404
        </h1>
        <p className="mt-4 max-w-md text-sm text-white/70 sm:text-lg">
          We couldn&apos;t find the page you&apos;re looking for. It may have
          been moved, or the link might be broken.
        </p>

        <div className="mt-8 flex flex-col gap-3 xs:flex-row">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-full bg-white px-6 py-3.5 h-auto text-black hover:bg-white/90",
            )}
          >
            Back to Home
          </Link>
          <Link
            href="/vape-shop"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Browse Vape Shop
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
