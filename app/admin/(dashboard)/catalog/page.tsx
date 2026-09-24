import type { Metadata } from "next";
import Image from "next/image";
import { X } from "lucide-react";
import { getCatalog } from "@/lib/data/repair-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice";
import { Input } from "@/components/ui/input";
import {
  addDeviceAction,
  removeDeviceAction,
  addBrandAction,
  removeBrandAction,
  addIssueAction,
  removeIssueAction,
} from "@/app/admin/(dashboard)/catalog/actions";

export const metadata: Metadata = { title: "Catalog — Admin" };

function Chip({
  label,
  removeAction,
  hiddenFields,
}: {
  label: string;
  removeAction: (formData: FormData) => void;
  hiddenFields: Record<string, string>;
}) {
  return (
    <form action={removeAction} className="inline-flex">
      {Object.entries(hiddenFields).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <button
        type="submit"
        className="group inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        {label}
        <X className="size-3 opacity-50 group-hover:opacity-100" />
      </button>
    </form>
  );
}

export default async function AdminCatalogPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="font-heading text-2xl font-black tracking-tight">Catalog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the devices, brands and issue types customers pick from when
            booking a repair.
          </p>
        </div>
        <SupabaseSetupNotice />
      </div>
    );
  }

  const { devices, brandsByDevice, issues } = await getCatalog();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-heading text-2xl font-black tracking-tight">Catalog</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the devices, brands and issue types customers pick from when
          booking a repair.
        </p>
      </div>

      <section>
        <h2 className="font-heading text-lg font-bold tracking-tight">Devices</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {devices.map((device) => (
            <div
              key={device.slug}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <span className="relative size-10 shrink-0">
                <Image src={device.image} alt="" fill sizes="40px" className="object-contain" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{device.name}</p>
                <p className="truncate text-xs text-muted-foreground">{device.slug}</p>
              </div>
              <form action={removeDeviceAction}>
                <input type="hidden" name="slug" value={device.slug} />
                <button
                  type="submit"
                  aria-label={`Remove ${device.name}`}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              </form>
            </div>
          ))}
        </div>

        <form action={addDeviceAction} className="mt-4 flex max-w-sm gap-2">
          <Input
            name="name"
            placeholder="New device name, e.g. Smartwatch"
            required
            className="h-10 rounded-full"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Add
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-heading text-lg font-bold tracking-tight">
          Brands per Device
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          {devices.map((device) => (
            <div
              key={device.slug}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <p className="text-sm font-semibold">{device.name}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(brandsByDevice[device.slug] ?? []).map((brand) => (
                  <Chip
                    key={brand}
                    label={brand}
                    removeAction={removeBrandAction}
                    hiddenFields={{ device: device.slug, brand }}
                  />
                ))}
                {(brandsByDevice[device.slug] ?? []).length === 0 && (
                  <p className="text-xs text-muted-foreground">No brands yet.</p>
                )}
              </div>
              <form action={addBrandAction} className="mt-3 flex max-w-xs gap-2">
                <input type="hidden" name="device" value={device.slug} />
                <Input
                  name="brand"
                  placeholder="Add a brand"
                  required
                  className="h-9 rounded-full text-sm"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-secondary px-3 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  Add
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-lg font-bold tracking-tight">Issue Types</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {issues.map((issue) => (
            <Chip
              key={issue}
              label={issue}
              removeAction={removeIssueAction}
              hiddenFields={{ issue }}
            />
          ))}
        </div>
        <form action={addIssueAction} className="mt-4 flex max-w-sm gap-2">
          <Input
            name="issue"
            placeholder="New issue type, e.g. Speaker Repair"
            required
            className="h-10 rounded-full"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Add
          </button>
        </form>
      </section>
    </div>
  );
}
