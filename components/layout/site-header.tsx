"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Repairs", href: "/repairs" },
  { label: "Vape Shop", href: "/vape-shop" },
  { label: "Accessories", href: "/accessories" },
  { label: "Stores", href: "/stores" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70"
    >
      <div className="wrap flex h-16 items-center justify-between gap-4 py-3 sm:h-18">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-foreground text-[11px] font-heading font-bold tracking-tight">
            V&M
          </span>
          <span className="font-heading text-base font-bold tracking-tight xs:text-lg">
            VAPE <span className="text-muted-foreground font-normal">|</span> MOBILE
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-foreground/80 uppercase transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Search">
            <Search className="size-4.5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex" aria-label="Cart">
            <ShoppingCart className="size-4.5" />
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
              0
            </span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Account">
            <User className="size-4.5" />
          </Button>

          <Link
            href="/book-a-repair"
            className={cn(
              buttonVariants({ variant: "default" }),
              "ml-2 hidden rounded-full px-5 sm:inline-flex",
            )}
          >
            Book a Repair
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu" />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <SheetHeader>
                <SheetTitle className="font-heading">V&M Vape | Mobile</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-3 text-base font-medium uppercase tracking-wide hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/book-a-repair"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "default" }), "mt-4 rounded-full")}
                >
                  Book a Repair
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
