import type { Metadata } from "next";
import { listBookings, getDistinctDevices, getDistinctBrands } from "@/lib/data/bookings";
import type { BookingStatus } from "@/lib/supabase/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice";
import { BookingFilters } from "@/components/admin/bookings/booking-filters";
import { BookingsTable } from "@/components/admin/bookings/bookings-table";

export const metadata: Metadata = { title: "Bookings — Admin" };

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    device?: string;
    brand?: string;
    q?: string;
  }>;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-black tracking-tight">Bookings</h1>
        <SupabaseSetupNotice />
      </div>
    );
  }

  const params = await searchParams;
  const [bookings, devices, brands] = await Promise.all([
    listBookings({
      status: params.status as BookingStatus | undefined,
      device: params.device,
      brand: params.brand,
      query: params.q,
    }),
    getDistinctDevices(),
    getDistinctBrands(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-black tracking-tight">Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {bookings.length} repair {bookings.length === 1 ? "request" : "requests"}
        </p>
      </div>

      <BookingFilters devices={devices} brands={brands} />

      <BookingsTable bookings={bookings} />
    </div>
  );
}
