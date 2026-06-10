/**
 * Zentraler, validierter Zugriff auf die Mail-Umgebungsvariablen (Aufgabe 2).
 *
 * Einzige Quelle der Wahrheit für RESEND_API_KEY, MAIL_FROM und MAIL_TO.
 * Es werden KEINE Klartext-Defaults verwendet (siehe § 15 Hauptprompt:
 * „Schreibe keine Klartextwerte fest in den Code."). Fehlt eine Variable,
 * scheitert der Endpoint laut (HTTP 500), statt stumm einen falschen oder
 * unverifizierten Absender zu verwenden.
 */
export type MailConfig = {
  apiKey: string;
  /** Absender, z.B. "Kontor Business Club <no-reply@kontakt.…>" (aus MAIL_FROM). */
  from: string;
  /** Posteingang für Benachrichtigungen (aus MAIL_TO). */
  to: string;
};

export type MailConfigResult =
  | { ok: true; config: MailConfig }
  | { ok: false; missing: string[] };

export function loadMailConfig(): MailConfigResult {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.MAIL_FROM?.trim();
  const to = process.env.MAIL_TO?.trim();

  const missing: string[] = [];
  if (!apiKey) missing.push("RESEND_API_KEY");
  if (!from) missing.push("MAIL_FROM");
  if (!to) missing.push("MAIL_TO");

  if (missing.length > 0) {
    return { ok: false, missing };
  }
  return { ok: true, config: { apiKey: apiKey!, from: from!, to: to! } };
}
