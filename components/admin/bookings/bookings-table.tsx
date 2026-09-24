import type { RepairBooking } from "@/lib/supabase/types";
import { BookingStatusSelect } from "@/components/admin/bookings/booking-status-select";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BookingsTable({ bookings }: { bookings: RepairBooking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="text-sm font-medium text-foreground">No bookings found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters, or check back once requests come in.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[880px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-3">Received</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Device</th>
            <th className="px-4 py-3">Brand</th>
            <th className="px-4 py-3">Issue</th>
            <th className="px-4 py-3">Store</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="border-b border-border last:border-0 hover:bg-muted/30"
            >
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {formatDate(booking.created_at)}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{booking.name}</p>
                <p className="text-xs text-muted-foreground">
                  {booking.email} · {booking.phone}
                </p>
              </td>
              <td className="px-4 py-3">{booking.device}</td>
              <td className="px-4 py-3">{booking.brand}</td>
              <td className="px-4 py-3">{booking.issue}</td>
              <td className="px-4 py-3 whitespace-nowrap">{booking.store || "—"}</td>
              <td className="px-4 py-3">
                <BookingStatusSelect id={booking.id} status={booking.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
