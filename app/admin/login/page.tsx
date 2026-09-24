import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login — V&M Vape | Mobile",
};

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/tech/tech-repair-hero.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[oklch(0.16_0.04_141/0.82)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div
          aria-hidden
          className="absolute inset-0 [background-image:linear-gradient(oklch(1_0_0/0.05)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/0.05)_1px,transparent_1px)] [background-size:44px_44px]"
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2.5">
            <Image src="/V&M-logo.svg" alt="V&M" width={36} height={36} className="size-9" />
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              V&amp;M Admin
            </span>
          </div>

          <div className="max-w-md">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Staff Access
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-[1.05] font-black tracking-tight text-white uppercase">
              Reliable Repairs.
              <br />
              Done Properly.
            </h1>
            <p className="mt-4 text-sm text-white/60">
              Manage bookings, products and the repair catalog from one place.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Image src="/V&M-logo.svg" alt="V&M" width={36} height={36} className="size-9" />
            <span className="font-heading text-lg font-bold tracking-tight">
              V&amp;M Admin
            </span>
          </div>

          <h2 className="font-heading text-2xl font-black tracking-tight">Welcome back</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter the admin password to continue.
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
