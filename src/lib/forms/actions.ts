"use server";

import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getInbox, sendMail } from "@/lib/email/resend";
import {
  contactSchema,
  eventRegistrationSchema,
  membershipApplicationSchema,
  type ContactInput,
  type EventRegistrationInput,
  type MembershipApplicationInput,
} from "@/lib/forms/schemas";

/**
 * Server Actions fuer alle oeffentlichen Formulare.
 *
 * Ablauf je Action:
 *  1. Eingabe (FormData oder Objekt) gegen Zod validieren.
 *  2. Wenn Supabase konfiguriert: Insert in die passende Tabelle.
 *  3. Wenn Resend konfiguriert: Benachrichtigung an Inbox + Bestaetigung an Absender.
 *  4. Fehlt die Konfiguration, wird NICHT geworfen, sondern via console.info
 *     geloggt und {ok:true, note:"not_configured"} zurueckgegeben.
 */

export type ActionResult = {
  ok: boolean;
  errors?: Record<string, string[]>;
  note?: string;
};

type FormInput = FormData | Record<string, unknown>;

/** FormData oder Objekt zu einem einfachen Record normalisieren. */
function toPlainObject(input: FormInput): Record<string, unknown> {
  if (input instanceof FormData) {
    const obj: Record<string, unknown> = {};
    for (const [key, value] of input.entries()) {
      obj[key] = value;
    }
    return obj;
  }
  return input;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Schlichte HTML-Tabelle aus den eingereichten Feldern bauen. */
function fieldsToHtml(fields: Record<string, unknown>): string {
  const rows = Object.entries(fields)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:600;vertical-align:top">${escapeHtml(
          key,
        )}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${rows}</table>`;
}

/** Versucht Insert + Mails; loggt und meldet "not_configured", wenn nichts eingerichtet ist. */
async function persistAndNotify(opts: {
  table: string;
  row: Record<string, unknown>;
  notifySubject: string;
  notifyHtml: string;
  confirmTo: string;
  confirmSubject: string;
  confirmHtml: string;
  replyTo?: string;
}): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  let persisted = false;

  if (supabase) {
    const { error } = await supabase.from(opts.table).insert(opts.row);
    if (error) {
      console.error(`[forms] Insert in ${opts.table} fehlgeschlagen:`, error);
      return { ok: false, errors: { _form: ["Speichern fehlgeschlagen."] } };
    }
    persisted = true;
  }

  const notify = await sendMail({
    to: getInbox(),
    subject: opts.notifySubject,
    html: opts.notifyHtml,
    replyTo: opts.replyTo,
  });

  const confirm = await sendMail({
    to: opts.confirmTo,
    subject: opts.confirmSubject,
    html: opts.confirmHtml,
  });

  const mailed = !notify.skipped || !confirm.skipped;

  if (!persisted && !mailed) {
    console.info(
      `[forms] Nicht konfiguriert. Eingang fuer ${opts.table}:`,
      opts.row,
    );
    return { ok: true, note: "not_configured" };
  }

  return { ok: true };
}

function flattenZodErrors(
  error: z.ZodError,
): Record<string, string[]> {
  const flattened: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? String(issue.path[0]) : "_form";
    (flattened[key] ??= []).push(issue.message);
  }
  return flattened;
}

export async function submitContact(input: FormInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(toPlainObject(input));
  if (!parsed.success) {
    return { ok: false, errors: flattenZodErrors(parsed.error) };
  }

  const data: ContactInput = parsed.data;

  return persistAndNotify({
    table: "contact_submissions",
    row: {
      name: data.name,
      firma: data.firma,
      email: data.email,
      telefon: data.telefon,
      nachricht: data.nachricht,
    },
    notifySubject: `Neue Kontaktanfrage von ${data.name}`,
    notifyHtml: fieldsToHtml(data as unknown as Record<string, unknown>),
    confirmTo: data.email,
    confirmSubject: "Deine Anfrage beim Kontor Business Club",
    confirmHtml: `<p>Hallo ${escapeHtml(
      data.name,
    )},</p><p>danke fuer deine Nachricht. Wir melden uns bei dir.</p><p>Kontor Business Club</p>`,
    replyTo: data.email,
  });
}

export async function submitMembershipApplication(
  input: FormInput,
): Promise<ActionResult> {
  const parsed = membershipApplicationSchema.safeParse(toPlainObject(input));
  if (!parsed.success) {
    return { ok: false, errors: flattenZodErrors(parsed.error) };
  }

  const data: MembershipApplicationInput = parsed.data;

  return persistAndNotify({
    table: "applications",
    row: {
      name: data.name,
      firma: data.firma,
      email: data.email,
      telefon: data.telefon,
      nachricht: data.nachricht,
      branche: data.branche,
      website: data.website || null,
    },
    notifySubject: `Neue Mitgliedsanfrage von ${data.firma}`,
    notifyHtml: fieldsToHtml(data as unknown as Record<string, unknown>),
    confirmTo: data.email,
    confirmSubject: "Deine Mitgliedsanfrage beim Kontor Business Club",
    confirmHtml: `<p>Hallo ${escapeHtml(
      data.name,
    )},</p><p>danke fuer dein Interesse an einer Mitgliedschaft. Wir pruefen deine Anfrage und melden uns.</p><p>Kontor Business Club</p>`,
    replyTo: data.email,
  });
}

export async function submitEventRegistration(
  input: FormInput,
): Promise<ActionResult> {
  const parsed = eventRegistrationSchema.safeParse(toPlainObject(input));
  if (!parsed.success) {
    return { ok: false, errors: flattenZodErrors(parsed.error) };
  }

  const data: EventRegistrationInput = parsed.data;

  return persistAndNotify({
    table: "event_registrations",
    row: {
      name: data.name,
      firma: data.firma,
      email: data.email,
      telefon: data.telefon,
      nachricht: data.nachricht,
      event_name: data.eventName,
      anzahl_gaeste: data.anzahlGaeste,
      vertreter: data.vertreter,
      ist_mitglied: data.istMitglied,
    },
    notifySubject: `Neue Anmeldung fuer ${data.eventName} von ${data.name}`,
    notifyHtml: fieldsToHtml(data as unknown as Record<string, unknown>),
    confirmTo: data.email,
    confirmSubject: `Deine Anmeldung fuer ${data.eventName}`,
    confirmHtml: `<p>Hallo ${escapeHtml(
      data.name,
    )},</p><p>deine Anmeldung fuer ${escapeHtml(
      data.eventName,
    )} ist eingegangen. Wir freuen uns auf dich.</p><p>Kontor Business Club</p>`,
    replyTo: data.email,
  });
}
