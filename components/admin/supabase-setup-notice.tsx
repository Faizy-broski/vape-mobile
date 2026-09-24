import { DatabaseZap } from "lucide-react";

export function SupabaseSetupNotice() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <DatabaseZap className="size-6" />
      </span>
      <p className="font-heading text-lg font-bold">Supabase isn&apos;t connected yet</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Add <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
        <code className="rounded bg-muted px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
        <code className="rounded bg-muted px-1 py-0.5">.env.local</code>, then run the migrations
        in <code className="rounded bg-muted px-1 py-0.5">supabase/migrations</code>. See{" "}
        <code className="rounded bg-muted px-1 py-0.5">supabase/README.md</code> for step-by-step
        instructions.
      </p>
    </div>
  );
}
