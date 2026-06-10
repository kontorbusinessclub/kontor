/**
 * Hilfsfunktionen, um Formulardaten als HTML-Tabelle und als
 * Plaintext-Fallback für die Benachrichtigungs-Mails aufzubereiten.
 */

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type MailField = { label: string; value: unknown };

/** Schlichte, mailclient-sichere HTML-Tabelle aus Label/Wert-Paaren. */
export function fieldsToHtml(title: string, fields: MailField[]): string {
  const rows = fields
    .map(
      ({ label, value }) =>
        `<tr><td style="padding:6px 16px 6px 0;font-weight:600;vertical-align:top;color:#1a2f6e">${escapeHtml(
          label,
        )}</td><td style="padding:6px 0;white-space:pre-line">${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#14181f">
    <h2 style="color:#1a2f6e;font-family:Georgia,serif">${escapeHtml(title)}</h2>
    <table style="border-collapse:collapse">${rows}</table>
  </div>`;
}

/** Plaintext-Variante derselben Felder. */
export function fieldsToText(title: string, fields: MailField[]): string {
  const lines = fields.map(
    ({ label, value }) => `${label}: ${String(value ?? "-")}`,
  );
  return `${title}\n\n${lines.join("\n")}`;
}
