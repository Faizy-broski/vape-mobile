import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { RepairBookingWizard } from "@/components/repairs/booking/repair-booking-wizard";
import { getCatalog, getDeviceBySlug } from "@/lib/data/repair-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice";

export const metadata: Metadata = {
  title: "Book a Repair — V&M Vape | Mobile",
  description: "Tell us about your device and we'll take it from there.",
};

export default async function BookRepairPage({
  searchParams,
}: {
  searchParams: Promise<{ device?: string }>;
}) {
  const { device } = await searchParams;
  const configured = isSupabaseConfigured();
  const catalog = configured ? await getCatalog() : null;
  const selectedDevice = configured ? await getDeviceBySlug(device) : null;
  const initialDevice = selectedDevice?.slug ?? catalog?.devices[0]?.slug ?? "";

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="wrap section-y">
          <div className="mx-auto max-w-3xl">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              Book a Repair
            </span>
            <h1 className="mt-2 font-heading text-3xl font-black tracking-tight uppercase xs:text-4xl sm:text-5xl">
              What need to fix?
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
              Tell us about your device and we&apos;ll take it from there.
            </p>

            <div className="mt-10 rounded-[2rem] bg-[oklch(0.98_0.01_95)] p-6 ring-1 ring-foreground/5 xs:p-8 sm:p-10">
              {catalog ? (
                <RepairBookingWizard initialDevice={initialDevice} catalog={catalog} />
              ) : (
                <SupabaseSetupNotice />
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
