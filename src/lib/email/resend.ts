import { Resend } from "resend";

/**
 * E-Mail-Versand via Resend (Aufgabe 15).
 *
 * Lazy initialisiert. Fehlt RESEND_API_KEY, wird nicht geworfen, sondern
 * eine Warnung geloggt und {skipped:true} zurückgegeben, damit die App
 * auch ohne Konfiguration läuft (lokal/CI).
 *
 * Konfiguration ausschließlich über Environment-Variablen (keine
 * Klartextwerte im Code):
 *   RESEND_API_KEY – API-Key (nur serverseitig)
 *   MAIL_FROM      – verifizierte Absenderadresse (kontakt.kontor-businessclub.com)
 *   MAIL_TO        – Posteingang (info@kontor-businessclub.com)
 */

let cached: Resend | null | undefined;

function getResend(): Resend | null {
  if (cached !== undefined) {
    return cached;
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    cached = null;
    return null;
  }
  cached = new Resend(apiKey);
  return cached;
}

/** Absenderadresse (verifizierte Subdomain). */
export function getFrom(): string {
  return (
    process.env.MAIL_FROM ||
    "Kontor Business Club <no-reply@kontakt.kontor-businessclub.com>"
  );
}

/** Posteingang für eingehende Benachrichtigungen. */
export function getInbox(): string {
  return (
    process.env.MAIL_TO ||
    process.env.KONTOR_INBOX ||
    "info@kontor-businessclub.com"
  );
}

export interface SendMailInput {
  to: string | string[];
  subject: string;
  html: string;
  /** Plaintext-Fallback (Aufgabe 15: HTML + Text). */
  text?: string;
  replyTo?: string;
}

export type SendMailResult =
  | { skipped: true }
  | { skipped: false; id: string | null }
  | { skipped: false; error: string };

export async function sendMail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendMailInput): Promise<SendMailResult> {
  const resend = getResend();

  if (!resend) {
    console.warn("[resend] RESEND_API_KEY fehlt. E-Mail wird nicht versendet.");
    return { skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from: getFrom(),
    to,
    subject,
    html,
    ...(text ? { text } : {}),
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    console.error("[resend] Versand fehlgeschlagen:", error);
    return { skipped: false, error: error.message };
  }

  return { skipped: false, id: data?.id ?? null };
}
