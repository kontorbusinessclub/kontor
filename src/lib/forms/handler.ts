import type { ZodType } from "zod";
import { getInbox, sendMail } from "@/lib/email/resend";
import { fieldsToHtml, fieldsToText, type MailField } from "@/lib/email/format";

/**
 * Gemeinsame Logik der /api-Form-Endpunkte (Aufgabe 15):
 *  - nur POST
 *  - JSON-Body lesen
 *  - Honeypot prüfen (still verwerfen)
 *  - Zod-Validierung
 *  - einfaches IP-Rate-Limiting (best effort, in-memory)
 *  - Benachrichtigung an MAIL_TO + optionale Bestätigung an Absender
 *  - Antwort { ok: true } / { ok: false, error }
 */

type ConfirmMail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type BuiltMail = {
  /** Betreff der Benachrichtigung an den Posteingang. */
  subject: string;
  /** Überschrift im Mail-Body. */
  title: string;
  /** Label/Wert-Paare für Tabelle + Plaintext. */
  fields: MailField[];
  /** Reply-To für die Benachrichtigung (i.d.R. die Absender-Mail). */
  replyTo?: string;
  /** Optionale Bestätigungs-Mail an den Absender. */
  confirm?: ConfirmMail;
};

// --- Sehr einfaches In-Memory-Rate-Limiting (pro Server-Instanz) ---
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleFormRequest<T>(
  req: Request,
  schema: ZodType<T>,
  build: (data: T) => BuiltMail,
): Promise<Response> {
  if (req.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405);
  }

  if (rateLimited(clientIp(req))) {
    return json({ ok: false, error: "rate_limited" }, 429);
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  // Honeypot: ist das versteckte Feld befüllt, stammt der Request von
  // einem Bot. Wir antworten 200 ok, verarbeiten aber nichts.
  const hp = (payload as { hp?: unknown })?.hp;
  if (typeof hp === "string" && hp.length > 0) {
    return json({ ok: true });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.length ? String(issue.path[0]) : "_form";
      (errors[key] ??= []).push(issue.message);
    }
    return json({ ok: false, error: "invalid", errors }, 400);
  }

  const mail = build(parsed.data);

  const notify = await sendMail({
    to: getInbox(),
    subject: mail.subject,
    html: fieldsToHtml(mail.title, mail.fields),
    text: fieldsToText(mail.title, mail.fields),
    replyTo: mail.replyTo,
  });

  if (!notify.skipped && "error" in notify) {
    return json({ ok: false, error: "send_failed" }, 502);
  }

  if (mail.confirm) {
    await sendMail({
      to: mail.confirm.to,
      subject: mail.confirm.subject,
      html: mail.confirm.html,
      text: mail.confirm.text,
    });
  }

  // Ohne RESEND_API_KEY läuft die App weiter (Mail wird übersprungen).
  if (notify.skipped) {
    console.info("[forms] Resend nicht konfiguriert. Eingang:", mail.title);
    return json({ ok: true, note: "not_configured" });
  }

  return json({ ok: true });
}
