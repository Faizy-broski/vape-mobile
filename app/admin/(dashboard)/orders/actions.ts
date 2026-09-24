"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "@/lib/data/orders";
import type { OrderStatus } from "@/lib/data/orders";

export async function updateOrderStatusAction(id: string, status: OrderStatus) {
  await updateOrderStatus(id, status);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
