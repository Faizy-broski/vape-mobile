import type { Metadata } from "next";
import { listOrders } from "@/lib/data/orders";
import type { OrderStatus } from "@/lib/data/orders";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice";
import { OrderFilters } from "@/components/admin/orders/order-filters";
import { OrdersTable } from "@/components/admin/orders/orders-table";

export const metadata: Metadata = { title: "Orders — Admin" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-black tracking-tight">Orders</h1>
        <SupabaseSetupNotice />
      </div>
    );
  }

  const params = await searchParams;
  const orders = await listOrders({
    status: params.status as OrderStatus | undefined,
    query: params.q,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-black tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      <OrderFilters />

      <OrdersTable orders={orders} />
    </div>
  );
}
