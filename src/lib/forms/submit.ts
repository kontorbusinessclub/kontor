/**
 * Client-Helfer: postet ein Formular als JSON an einen /api-Endpunkt
 * (Aufgabe 15) und normalisiert die Antwort für react-hook-form.
 */

/** Fehlerklasse für differenzierte UI-Meldungen (Bugfix Aufgabe 3). */
export type SubmitReason = "validation" | "rate_limit" | "server" | "network";

export type SubmitResult = {
  ok: boolean;
  errors?: Record<string, string[]>;
  reason?: SubmitReason;
};

export async function postForm(
  endpoint: string,
  payload: unknown,
): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // fetch wirft nur bei Netzwerk-/Verbindungsproblemen.
    return { ok: false, reason: "network" };
  }

  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    errors?: Record<string, string[]>;
  };

  if (res.ok && data?.ok !== false) {
    return { ok: true };
  }

  let reason: SubmitReason = "server";
  if (res.status === 400 || res.status === 422) reason = "validation";
  else if (res.status === 429) reason = "rate_limit";
  else if (res.status >= 500) reason = "server";

  return { ok: false, errors: data?.errors, reason };
}

/**
 * Übersetzungs-Key (Namespace common.form) zur differenzierten
 * Fehlermeldung anhand der Fehlerklasse.
 */
export function submitErrorKey(reason?: SubmitReason): string {
  switch (reason) {
    case "validation":
      return "fehlerValidierung";
    case "rate_limit":
      return "fehlerRateLimit";
    case "network":
      return "fehlerNetzwerk";
    default:
      return "fehlerServer";
  }
}

/** Verstecktes Honeypot-Feld (gegen Spam-Bots). Inline-Style hält es aus dem Flow. */
export const honeypotProps = {
  type: "text" as const,
  tabIndex: -1,
  autoComplete: "off",
  "aria-hidden": true,
  style: { position: "absolute" as const, left: "-9999px", height: 0, width: 0, opacity: 0 },
};
