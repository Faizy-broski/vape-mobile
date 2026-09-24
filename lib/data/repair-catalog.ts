import "server-only";
import { createServerReadClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { RepairDevice } from "@/lib/supabase/types";

export type Catalog = {
  devices: RepairDevice[];
  brandsByDevice: Record<string, string[]>;
  issues: string[];
  stores: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getCatalog(): Promise<Catalog> {
  const supabase = createServerReadClient();

  const [devicesRes, brandsRes, issuesRes, storesRes] = await Promise.all([
    supabase.from("repair_devices").select("*").order("sort_order"),
    supabase
      .from("repair_device_brands")
      .select("device_id, name, repair_devices!inner(slug)")
      .order("sort_order"),
    supabase.from("repair_issues").select("name").order("sort_order"),
    supabase.from("repair_stores").select("name").order("sort_order"),
  ]);

  const devices = devicesRes.data ?? [];

  const brandsByDevice: Record<string, string[]> = {};
  for (const device of devices) brandsByDevice[device.slug] = [];
  for (const row of brandsRes.data ?? []) {
    const slug = (row as unknown as { repair_devices: { slug: string } }).repair_devices.slug;
    brandsByDevice[slug] = [...(brandsByDevice[slug] ?? []), row.name];
  }

  return {
    devices,
    brandsByDevice,
    issues: (issuesRes.data ?? []).map((i) => i.name),
    stores: (storesRes.data ?? []).map((s) => s.name),
  };
}

export async function getDeviceBySlug(slug: string | undefined): Promise<RepairDevice | null> {
  if (!slug) return null;
  const supabase = createServerReadClient();
  const { data } = await supabase
    .from("repair_devices")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

// --- Admin mutations (service-role client) ---

export async function addDevice(input: { name: string; image: string }) {
  const slug = slugify(input.name);
  if (!slug) return;
  const supabase = createAdminClient();
  await supabase
    .from("repair_devices")
    .insert({ slug, name: input.name, image: input.image, sort_order: 999 });
}

export async function removeDevice(slug: string) {
  const supabase = createAdminClient();
  await supabase.from("repair_devices").delete().eq("slug", slug);
}

export async function addBrand(deviceSlug: string, brand: string) {
  const trimmed = brand.trim();
  if (!trimmed) return;
  const supabase = createAdminClient();
  const { data: device } = await supabase
    .from("repair_devices")
    .select("id")
    .eq("slug", deviceSlug)
    .maybeSingle();
  if (!device) return;
  await supabase
    .from("repair_device_brands")
    .insert({ device_id: device.id, name: trimmed, sort_order: 999 });
}

export async function removeBrand(deviceSlug: string, brand: string) {
  const supabase = createAdminClient();
  const { data: device } = await supabase
    .from("repair_devices")
    .select("id")
    .eq("slug", deviceSlug)
    .maybeSingle();
  if (!device) return;
  await supabase
    .from("repair_device_brands")
    .delete()
    .eq("device_id", device.id)
    .eq("name", brand);
}

export async function addIssue(issue: string) {
  const trimmed = issue.trim();
  if (!trimmed) return;
  const supabase = createAdminClient();
  await supabase.from("repair_issues").insert({ name: trimmed, sort_order: 999 });
}

export async function removeIssue(issue: string) {
  const supabase = createAdminClient();
  await supabase.from("repair_issues").delete().eq("name", issue);
}
