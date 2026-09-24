import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl, getSupabaseServiceRoleKey } from "@/lib/supabase/env";

/**
 * Service-role client — bypasses RLS entirely. Only import this from Server
 * Actions / admin routes that have already checked the admin session. Never
 * expose this client (or the key it uses) to the browser.
 *
 * Not parameterized with a `Database` generic — see the note in server.ts.
 */
export function createAdminClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
