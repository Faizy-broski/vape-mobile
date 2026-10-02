import type { Order } from "@/lib/data/orders";
import { OrderStatusSelect } from "@/components/admin/orders/order-status-select";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="text-sm font-medium text-foreground">No orders found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters, or check back once orders come in.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-220 text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-3">Received</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Items</th>
            <th className="px-4 py-3">Subtotal</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {formatDate(order.created_at)}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{order.name}</p>
                <p className="text-xs text-muted-foreground">
                  {order.email} · {order.phone}
                </p>
              </td>
              <td className="px-4 py-3">
                <ul className="space-y-0.5">
                  {order.items.map((item) => (
                    <li key={item.id} className="text-xs whitespace-nowrap">
                      {item.quantity}× {item.name}
                      {item.variantName && (
                        <span className="text-muted-foreground"> — {item.variantName}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-3 font-semibold whitespace-nowrap">
                £{order.subtotal.toFixed(2)}
              </td>
              <td className="max-w-50 px-4 py-3 truncate" title={order.address}>
                {order.address}
              </td>
              <td className="px-4 py-3">
                <OrderStatusSelect id={order.id} status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
