"use server";

import { revalidatePath } from "next/cache";
import { updateBookingStatus } from "@/lib/data/bookings";
import type { BookingStatus } from "@/lib/supabase/types";

export async function updateStatusAction(id: string, status: BookingStatus) {
  await updateBookingStatus(id, status);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}
