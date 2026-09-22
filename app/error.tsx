"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
        <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Something went wrong
        </span>
        <h1 className="font-heading text-4xl font-black tracking-tight sm:text-5xl">
          We hit a snag.
        </h1>
        <p className="max-w-md text-muted-foreground">
          An unexpected error occurred while loading this page. You can try
          again, or head back home.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => retry()} className="gap-2 rounded-full px-6">
            <RotateCw className="size-4" />
            Try again
          </Button>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-6")}
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
