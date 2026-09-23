"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronLeft, ChevronRight, CircleCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  submitRepairBooking,
  initialBookingState,
} from "@/app/repairs/book/actions";
import {
  BRANDS_BY_DEVICE,
  DEVICES,
  ISSUES,
  STORES,
} from "@/components/repairs/booking/booking-data";

const STEP_LABELS = ["Device", "Brand", "Issue", "Your Details", "Review"];

export function RepairBookingWizard({ initialDevice }: { initialDevice: string }) {
  const [step, setStep] = useState(0);
  const [device, setDevice] = useState(initialDevice);
  const [brand, setBrand] = useState("");
  const [issue, setIssue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [store, setStore] = useState(STORES[0]);
  const [notes, setNotes] = useState("");

  const [state, formAction, pending] = useActionState(
    submitRepairBooking,
    initialBookingState,
  );

  const brandOptions = useMemo(
    () => BRANDS_BY_DEVICE[device] ?? [],
    [device],
  );
  const selectedDeviceName =
    DEVICES.find((d) => d.slug === device)?.name ?? device;

  const canContinue =
    (step === 0 && !!device) ||
    (step === 1 && !!brand) ||
    (step === 2 && !!issue) ||
    (step === 3 && !!name && !!email && !!phone);

  function goNext() {
    if (step === 1 && brandOptions.length === 0) setBrand("Not Listed");
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CircleCheck className="size-9" strokeWidth={1.5} />
        </span>
        <h3 className="mt-5 font-heading text-2xl font-black tracking-tight uppercase">
          Request Sent
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {state.message}
        </p>
        <Link
          href="/repairs"
          className="mt-6 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Back to Repairs
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="device" value={selectedDeviceName} />
      <input type="hidden" name="brand" value={brand} />
      <input type="hidden" name="issue" value={issue} />
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="phone" value={phone} />
      <input type="hidden" name="store" value={store} />
      <input type="hidden" name="notes" value={notes} />

      <ol className="flex items-center gap-2 overflow-x-auto">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-xs font-medium whitespace-nowrap uppercase",
                i === step ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < STEP_LABELS.length - 1 && (
              <span className="mx-1 h-px w-6 shrink-0 bg-border sm:w-10" />
            )}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {step === 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DEVICES.map((d) => (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => setDevice(d.slug)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-colors",
                    device === d.slug
                      ? "border-primary bg-primary/5"
                      : "border-border bg-white hover:border-primary/40",
                  )}
                >
                  <span className="relative size-12 shrink-0">
                    <Image src={d.image} alt="" fill sizes="48px" className="object-contain" />
                  </span>
                  <span className="text-xs font-semibold sm:text-sm">{d.name}</span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                Which brand is your {selectedDeviceName.toLowerCase()}?
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {brandOptions.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className={cn(
                      "flex h-12 items-center justify-between rounded-full border px-5 text-sm font-medium transition-colors",
                      brand === b
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-foreground hover:border-primary/40",
                    )}
                  >
                    {b}
                    {brand === b && <Check className="size-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                What&apos;s wrong with it?
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ISSUES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setIssue(item)}
                    className={cn(
                      "flex h-12 items-center justify-between rounded-full border px-5 text-sm font-medium transition-colors",
                      issue === item
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-foreground hover:border-primary/40",
                    )}
                  >
                    {item}
                    {issue === item && <Check className="size-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 rounded-full border-border bg-white px-5"
                />
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-12 rounded-full border-border bg-white px-5"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-full border-border bg-white px-5"
                />
                <Select value={store} onValueChange={(value) => setStore(value ?? STORES[0])}>
                  <SelectTrigger className="h-12 w-full rounded-full border-border bg-white px-5">
                    <SelectValue placeholder="Preferred store" />
                  </SelectTrigger>
                  <SelectContent>
                    {STORES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Tell us a little more (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-24 rounded-2xl border-border bg-white px-5 py-4"
              />
            </div>
          )}

          {step === 4 && (
            <div className="rounded-2xl border border-border bg-white p-6">
              <dl className="grid grid-cols-1 gap-4 xs:grid-cols-2">
                {[
                  ["Device", selectedDeviceName],
                  ["Brand", brand],
                  ["Issue", issue],
                  ["Name", name],
                  ["Email", email],
                  ["Phone", phone],
                  ["Preferred store", store],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {label}
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium text-foreground">
                      {value || "—"}
                    </dd>
                  </div>
                ))}
                {notes && (
                  <div className="xs:col-span-2">
                    <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Notes
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium text-foreground">
                      {notes}
                    </dd>
                  </div>
                )}
              </dl>

              {state.status === "error" && (
                <p className="mt-5 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {state.message}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronLeft className="size-4" />
          Back
        </button>

        {step < STEP_LABELS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue}
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            Continue
            <ChevronRight className="size-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
          >
            {pending ? "Sending…" : "Request Repair"}
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>
    </form>
  );
}
