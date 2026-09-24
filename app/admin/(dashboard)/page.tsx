import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Package,
} from "lucide-react";
import { getBookingStats, listBookings } from "@/lib/data/bookings";
import { listProducts } from "@/lib/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice";
import { StatCard } from "@/components/admin/stat-card";
import { BookingsTable } from "@/components/admin/bookings/bookings-table";

export const metadata: Metadata = { title: "Dashboard — Admin" };

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-black tracking-tight">Dashboard</h1>
        <SupabaseSetupNotice />
      </div>
    );
  }

  const [stats, recent, products] = await Promise.all([
    getBookingStats(),
    listBookings().then((b) => b.slice(0, 6)),
    listProducts(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-black tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of repair booking activity.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Total Bookings"
          value={stats.total}
          icon={<ClipboardList />}
          delay={0}
        />
        <StatCard
          label="New"
          value={stats.new}
          icon={<Clock />}
          accentClassName="bg-blue-500/10 text-blue-600"
          delay={0.05}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={<Clock />}
          accentClassName="bg-amber-500/10 text-amber-600"
          delay={0.1}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={<CheckCircle2 />}
          accentClassName="bg-primary/10 text-primary"
          delay={0.15}
        />
        <Link href="/admin/products" className="block">
          <StatCard
            label="Products"
            value={products.length}
            icon={<Package />}
            accentClassName="bg-violet-500/10 text-violet-600"
            delay={0.2}
          />
        </Link>
      </div>

      {stats.cancelled > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <XCircle className="size-3.5" />
          {stats.cancelled} cancelled
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold tracking-tight">
            Recent Bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline"
          >
            View all
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
        <div className="mt-4">
          <BookingsTable bookings={recent} />
        </div>
      </div>
    </div>
  );
}
