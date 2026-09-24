import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl, getSupabaseAnonKey } from "@/lib/supabase/env";

/**
 * Server-side, anon-key client for reads in Server Components. Respects RLS
 * exactly like a public browser request would (see supabase/migrations for
 * the read policies), so it's safe for public catalog/product queries.
 *
 * Not parameterized with a `Database` generic — supabase-js's generic
 * constraints are fussy to satisfy by hand without `supabase gen types`, so
 * query results are typed explicitly at each call site (see
 * lib/supabase/types.ts) instead.
 */
export function createServerReadClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false },
  });
}
