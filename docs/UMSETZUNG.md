# Umsetzung Website-Optimierung – Übersicht

Diese Notiz fasst die Änderungen gemäß dem Auftrags-Prompt zusammen
(Nummerierung = Aufgabenblöcke des Prompts) und dient als PR-Beschreibung.

## § 1.3 Bestandsanalyse – was die Formulare vorher taten

Vor dem Umbau liefen alle Formulare (Kontakt, Event-Anmeldung, Mitgliedsantrag)
über **Next.js-Server-Actions** in `src/lib/forms/actions.ts`. Beim Absenden
wurde die Eingabe per Zod validiert, optional in **Supabase** geschrieben
(`contact_submissions`, `applications`, `event_registrations`) und – sofern
`RESEND_API_KEY` gesetzt war – per Resend eine Benachrichtigung an
`KONTOR_INBOX` plus eine Bestätigungsmail an den Absender verschickt. War weder
Supabase noch Resend konfiguriert, wurde **nicht** versendet, sondern nur
`console.info(...)` geloggt und `{ ok: true, note: "not_configured" }`
zurückgegeben (die App lief also auch ohne Konfiguration durch).

## Erledigte Aufgabenblöcke

- **2 – Marken/Typografie:** Farben liegen bereits als CSS-Tokens (`@theme` in
  `globals.css`), Komponenten nutzen `bg-koenigsblau` o.ä.; keine hartcodierten
  Hex außer den Token-Definitionen. **Schriften sind self-hosted:** `next/font`
  (Lora, Source Sans 3) lädt die Fonts zur Build-Zeit herunter und liefert sie
  von der eigenen Domain – es gibt **keinen** Runtime-Aufruf an
  `fonts.googleapis.com`. Die DSGVO-Anforderung ist damit erfüllt; ein manuelles
  `@font-face`/`public/fonts`-Setup ist nicht nötig.
- **3 – Wortmarke:** zweizeilig „KONTOR / Business Club", mittig, Goldlinie
  dazwischen (`src/components/wordmark.tsx`), identisch in Header, Footer, Mobile-Nav.
- **4 – „Münsterland":** vollständig entfernt (Texte, Metadaten, Kommentare);
  legitime Stadt „Münster" bleibt.
- **5 – Bilder:** keine Farbfilter über Bildern (Königsblau-Hero-Schleier bleibt
  als Designvorgabe). `provinzial-zentrale.avif` umbenannt und in den Event-Karten
  sichtbar (Alt-Text gesetzt).
- **6 – Sprachumschalter:** Dropdown mit Inline-SVG-Flaggen (DE/Union Jack),
  Code + Chevron, Outside-Click/Escape, Tastaturbedienung
  (`src/components/language-switcher.tsx`).
- **7 – Trennelemente:** Rauten aus `GoldRule` entfernt, nur die Linie bleibt.
- **8 – „Vertretene Unternehmen":** Komponente, CSS und i18n entfernt.
- **9 – Homepage-Reihenfolge:** Einspieler → Herzlich willkommen → Drei Säulen
  (mit „Mehr erfahren"-Ankern) → Events → Was Mitglieder sagen → FAQs →
  „Passt der Club zu dir?" (zwei Buttons). „Bleib auf dem Laufenden" entfernt.
- **10 – Navigation:** je Reiter **eine** Seite mit Anker-Sektionen
  (`/club`, `/events`, `/mitgliedschaft`, `/kontakt`); alte Einzelrouten als
  **308-Redirects** (`next.config.ts`). Smooth-Scroll + Header-Offset via
  `scroll-padding-top`. (Slugs beibehalten – so abgestimmt.)
- **11 – Events-Vorschau:** drei nächste Events als Karten-Karussell mit
  Chevron-/Tastatur-Navigation, terminlich nächste zuerst.
- **12 – Eventkalender/Anmeldung:** „Anzahl Gäste" entfernt; Pflicht-Auswahl der
  Veranstaltung (vorbelegt, `?event=`-Parameter); **Feedback-Formular** unter
  `/feedback` (E-Mail Pflicht – kein anonymes Feedback, so abgestimmt).
- **13 – Mitgliedsantrag:** 9-stufiger Wizard mit Fortschrittsanzeige, allen
  Feldern, Pflichtfeld-Validierung, SEPA als „bald verfügbar", FAQ-Accordion,
  Review-Schritt, Bestätigungsseite (`src/components/forms/membership-wizard.tsx`).
- **14 – Eventdaten:** zentrale Quelle `src/lib/events.ts` (Homepage, Events-Seite,
  Anmelde- und Feedback-Formular nutzen sie gemeinsam).
- **15 – Mailversand:** Route-Handler unter `src/app/api/{contact,event-registration,
  membership-application,feedback}/route.ts` mit Resend + Zod, Honeypot und
  einfachem In-Memory-Rate-Limiting. Bestätigungsmails bei Antrag und
  Eventanmeldung. Konfiguration über `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO`.
  Test-Checkliste: `docs/MAILVERSAND-TESTS.md`.
- **16 – Footer:** „Folgen" → „Vernetzen"; Claim „Kontor – Viele Branchen, ein
  Ziel." ergänzt.
- **17 – Englisch:** alle neuen/überarbeiteten Inhalte in `messages/en.json`;
  rechtliche Seiten zeigen in EN nur den Verweis auf die deutsche Fassung.
- **18 – Recht:** Impressum (§ 5/§ 7/§§ 8–10 **DDG**), AGB-Volltext (`/agb`),
  DSGVO-Datenschutzerklärung (IONOS-Hosting, Resend-Auftragsverarbeitung,
  self-hosted Fonts), SEPA-Mandatstext (`src/content/legal.ts`), Cookie-Hinweis
  (`src/components/cookie-banner.tsx`).

## SEPA-Aktivierungspfad

Sobald die Gläubiger-Identifikationsnummer vorliegt:
1. In Vercel `NEXT_PUBLIC_SEPA_ENABLED=true` setzen (Production/Preview/Development).
2. In `src/content/legal.ts` (`SEPA_MANDAT_TEXT`) die Platzhalterzeile der
   Gläubiger-ID ersetzen.

Bis dahin ist die SEPA-Option im Wizard ausgegraut („bald verfügbar"), die Felder
(IBAN, BIC, Mandatstext) sind vorbereitet, und `/api/membership-application` weist
`zahlungsmethode=sepa` serverseitig ab.

## Offene Punkte (vom Auftraggeber zu erledigen)

- Impressum-Daten: Geschäftsadresse, Geschäftsführer, HRB-Nummer, ggf. USt-IdNr.
- Eventbeschreibungen der drei nächsten Veranstaltungen (`src/lib/events.ts`, „TODO").
- Gläubiger-Identifikationsnummer für SEPA → Aktivierungsflag (siehe oben).
- Bankverbindung des Clubs (Wizard Schritt 5 „Überweisung").
- Manuelle Mailversand-Tests gemäß `docs/MAILVERSAND-TESTS.md`.
- Rechtstexte vor Live-Schaltung anwaltlich prüfen lassen.
- Anwaltlich/DSGVO prüfen, ob Resend DPF-zertifiziert ist; sonst EU-Alternative
  (z.B. Postmark/Mailgun EU) erwägen.

## Migrationsnotiz (Env-Variablen)

Neu/relevant: `MAIL_FROM`, `MAIL_TO`, `NEXT_PUBLIC_SEPA_ENABLED` (siehe
`.env.example`). `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` sind laut Auftraggeber
in Vercel bereits gesetzt. Supabase-Code bleibt im Repo, wird vom Mailversand
aber nicht mehr aufgerufen.
