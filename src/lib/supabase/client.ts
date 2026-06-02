import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-Supabase-Client (anon key).
 *
 * Lazy initialisiert. Fehlen die Env-Vars, gibt die Funktion null
 * zurueck (kein throw), damit die App auch ohne Konfiguration laeuft.
 */

let cached: SupabaseClient | null | undefined;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (cached !== undefined) {
    return cached;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    cached = null;
    return null;
  }

  cached = createClient(url, anonKey);

  return cached;
}
