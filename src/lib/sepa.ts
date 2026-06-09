/**
 * SEPA-Lastschrift-Schalter (Aufgabe 13, Schritt 5 / § 18.4).
 *
 * Solange die Gläubiger-Identifikationsnummer nicht vorliegt, bleibt die
 * SEPA-Option im Mitgliedsantrag deaktiviert („bald verfügbar"). Die Felder
 * (IBAN, BIC, Mandatstext) sind im Code vollständig vorbereitet.
 *
 * AKTIVIERUNG: Sobald die Gläubiger-ID nachgereicht ist, genügt es,
 *   NEXT_PUBLIC_SEPA_ENABLED=true
 * als Umgebungsvariable zu setzen (Vercel: Production/Preview/Development)
 * UND in `SEPA_MANDAT_TEXT` (src/content/legal.ts) die Platzhalterzeile der
 * Gläubiger-ID zu ersetzen. NEXT_PUBLIC_ ist nötig, weil der Wizard ein
 * Client-Component ist.
 */
export const SEPA_ENABLED = process.env.NEXT_PUBLIC_SEPA_ENABLED === "true";
