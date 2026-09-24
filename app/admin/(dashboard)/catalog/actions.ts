"use server";

import { revalidatePath } from "next/cache";
import {
  addDevice,
  removeDevice,
  addBrand,
  removeBrand,
  addIssue,
  removeIssue,
} from "@/lib/data/repair-catalog";

function revalidateCatalog() {
  revalidatePath("/admin/catalog");
  revalidatePath("/repairs");
  revalidatePath("/repairs/book");
}

export async function addDeviceAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await addDevice({ name, image: "/tech/repairs/other-device.png" });
  revalidateCatalog();
}

export async function removeDeviceAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;
  await removeDevice(slug);
  revalidateCatalog();
}

export async function addBrandAction(formData: FormData) {
  const device = String(formData.get("device") ?? "");
  const brand = String(formData.get("brand") ?? "").trim();
  if (!device || !brand) return;
  await addBrand(device, brand);
  revalidateCatalog();
}

export async function removeBrandAction(formData: FormData) {
  const device = String(formData.get("device") ?? "");
  const brand = String(formData.get("brand") ?? "");
  if (!device || !brand) return;
  await removeBrand(device, brand);
  revalidateCatalog();
}

export async function addIssueAction(formData: FormData) {
  const issue = String(formData.get("issue") ?? "").trim();
  if (!issue) return;
  await addIssue(issue);
  revalidateCatalog();
}

export async function removeIssueAction(formData: FormData) {
  const issue = String(formData.get("issue") ?? "");
  if (!issue) return;
  await removeIssue(issue);
  revalidateCatalog();
}
