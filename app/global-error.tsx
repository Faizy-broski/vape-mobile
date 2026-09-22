"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
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
    <html lang="en" className="dark">
      <body className="flex min-h-svh flex-col items-center justify-center gap-5 bg-background px-6 text-center font-sans text-foreground antialiased">
        <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Critical Error
        </span>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Something went wrong.
        </h1>
        <p className="max-w-md text-muted-foreground">
          The application ran into an unexpected problem. Please try again.
        </p>
        <button
          onClick={() => retry()}
          className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
