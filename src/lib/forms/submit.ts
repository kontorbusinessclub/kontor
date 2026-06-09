/**
 * Client-Helfer: postet ein Formular als JSON an einen /api-Endpunkt
 * (Aufgabe 15) und normalisiert die Antwort für react-hook-form.
 */
export type SubmitResult = {
  ok: boolean;
  errors?: Record<string, string[]>;
};

export async function postForm(
  endpoint: string,
  payload: unknown,
): Promise<SubmitResult> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      errors?: Record<string, string[]>;
    };
    return { ok: res.ok && data?.ok !== false, errors: data?.errors };
  } catch {
    return { ok: false };
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
