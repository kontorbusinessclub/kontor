import { Resend } from "resend";

/**
 * E-Mail-Versand via Resend (Aufgabe 15 / Bugfix Mail-Domain).
 *
 * Absender, Empfänger und API-Key werden NICHT hier ermittelt, sondern
 * von der zentralen Mail-Config (`src/lib/mail-config.ts`) validiert und
 * explizit übergeben. So gibt es keine hartcodierten Domains/Adressen.
 */

const clients = new Map<string, Resend>();

function client(apiKey: string): Resend {
  let instance = clients.get(apiKey);
  if (!instance) {
    instance = new Resend(apiKey);
    clients.set(apiKey, instance);
  }
  return instance;
}

export interface SendMailInput {
  apiKey: string;
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  /** Plaintext-Fallback. */
  text?: string;
  replyTo?: string;
}

export type SendMailResult =
  | { ok: true; id: string | null }
  | { ok: false; error: string };

export async function sendMail({
  apiKey,
  from,
  to,
  subject,
  html,
  text,
  replyTo,
}: SendMailInput): Promise<SendMailResult> {
  const { data, error } = await client(apiKey).emails.send({
    from,
    to,
    subject,
    html,
    ...(text ? { text } : {}),
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    console.error("[resend] Versand fehlgeschlagen:", error);
    return { ok: false, error: error.message };
  }

  return { ok: true, id: data?.id ?? null };
}
