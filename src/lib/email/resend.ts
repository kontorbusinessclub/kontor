import { Resend } from "resend";

/**
 * E-Mail-Versand via Resend.
 *
 * Lazy initialisiert. Fehlt RESEND_API_KEY, wird nicht geworfen,
 * sondern eine Warnung geloggt und {skipped:true} zurueckgegeben,
 * damit die App auch ohne Konfiguration laeuft.
 */

const DEFAULT_FROM = "Kontor Business Club <noreply@kontor-businessclub.de>";

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

/** Inbox fuer eingehende Benachrichtigungen (Fallback info@...). */
export function getInbox(): string {
  return process.env.KONTOR_INBOX || "info@kontor-businessclub.de";
}

export interface SendMailInput {
  to: string | string[];
  subject: string;
  html: string;
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
  replyTo,
}: SendMailInput): Promise<SendMailResult> {
  const resend = getResend();

  if (!resend) {
    console.warn(
      "[resend] RESEND_API_KEY fehlt. E-Mail wird nicht versendet.",
    );
    return { skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from: DEFAULT_FROM,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    console.error("[resend] Versand fehlgeschlagen:", error);
    return { skipped: false, error: error.message };
  }

  return { skipped: false, id: data?.id ?? null };
}
