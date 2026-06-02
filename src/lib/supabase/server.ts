import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase Admin Client.
 *
 * Nutzt den Service-Role-Key und umgeht damit RLS. NIE im Browser
 * importieren. Lazy initialisiert, damit die App auch ohne gesetzte
 * Env-Vars baut und laeuft. Fehlen die Vars, gibt die Funktion null
 * zurueck (kein throw).
 */

let cached: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) {
    return cached;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    cached = null;
    return null;
  }

  cached = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cached;
}
