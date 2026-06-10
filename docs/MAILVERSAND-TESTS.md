# Mailversand – manuelle Funktionstests (Phase 3)

> Diese Tests führt **der Auftraggeber nach dem Deployment manuell** durch.
> Voraussetzung: Die Vercel-Umgebungsvariablen `RESEND_API_KEY`, `MAIL_FROM`
> und `MAIL_TO` sind gesetzt und die Versand-Domain
> `kontakt.kontor-businessclub.com` ist bei Resend verifiziert.

Alle Formulare senden eine Benachrichtigung an **`info@kontor-businessclub.com`**
(`MAIL_TO`). Bei Mitgliedsantrag und Veranstaltungs-Anmeldung erhält der
Absender zusätzlich eine Bestätigungs-Mail.

## Allgemeine Hinweise zur Fehlersuche

- **Resend-Logs:** https://resend.com → Logs (Status, Empfänger, Fehlercode).
- **Vercel-Logs:** Projekt → Deployments → Functions → Runtime Logs
  (Einträge `[resend]` / `[forms]`).
- **Spam-Ordner** des Empfängers prüfen, falls keine Mail ankommt.
- Honeypot: Wird das versteckte Feld `hp` befüllt, antwortet die API mit
  `{ ok: true }`, **versendet aber nichts** (Bot-Schutz).
- **Strict-Check:** Fehlt eine der Variablen `RESEND_API_KEY`, `MAIL_FROM` oder
  `MAIL_TO`, antwortet die Route mit **HTTP 500** und loggt z.B.
  `[config] Mail-Umgebungsvariablen fehlen: MAIL_FROM`. Es wird dann nichts
  versendet (lautes Scheitern statt stummem Fehlversand).
- **Verifizierte Domain:** `MAIL_FROM` muss auf der bei Resend verifizierten
  Subdomain **`kontakt.kontor-businessclub.com`** liegen. Liegt der Absender auf
  einer nicht verifizierten Domain (z.B. `mail.…`), lehnt Resend mit **403
  „domain is not verified"** ab – im UI erscheint dann die Server-Fehlermeldung.

---

## 1. Kontaktformular – `/api/contact`

- **Seite:** `/kontakt#formular`
- **Schritte:** Name, Firma, E-Mail, Telefon, Nachricht ausfüllen, absenden.
- **Erwartet:** Erfolgsmeldung im UI; Mail „Kontaktanfrage von …" an
  `info@kontor-businessclub.com`, Reply-To = angegebene E-Mail.
- **Bestätigungs-Mail an Absender:** nein.

## 2. Veranstaltungs-Anmeldung – `/api/event-registration`

- **Seite:** `/events#kalender`
- **Schritte:** Veranstaltung im Dropdown wählen, Pflichtfelder ausfüllen,
  ggf. „bereits Mitglied" / „Vertreter" setzen, absenden.
- **Erwartet:** Mail „Anmeldung: <Datum · Uhrzeit · Titel> – <Name>" an
  `info@kontor-businessclub.com`.
- **Bestätigungs-Mail an Absender:** ja („Deine Anmeldung: …").
- **Zusatz:** Aufruf mit `?event=<id>` (z.B. aus den Homepage-Eventkarten)
  muss die Veranstaltung vorauswählen.

## 3. Mitgliedsantrag – `/api/membership-application`

- **Seite:** `/mitgliedschaft/antrag`
- **Schritte:** Antrag ausfüllen, absenden.
- **Erwartet:** Mail „Mitgliedsantrag von <Firma>" an
  `info@kontor-businessclub.com`.
- **Bestätigungs-Mail an Absender:** ja (Hinweis: Kuratorium meldet sich
  innerhalb von 7 Werktagen).

## 4. Veranstaltungs-Feedback – `/api/feedback`

- **Seite:** `/feedback`
- **Schritte:** vergangene Veranstaltung wählen, Name, E-Mail, Sterne (1–5),
  Freitext (≥ 20 Zeichen) ausfüllen, absenden.
- **Erwartet:** Mail „Feedback (n/5): <Veranstaltung>" an
  `info@kontor-businessclub.com`, Reply-To = angegebene E-Mail.
- **Bestätigungs-Mail an Absender:** nein.
- **Hinweis:** Das Dropdown ist nur befüllt, wenn bereits Veranstaltungen in
  der Vergangenheit liegen (siehe `src/lib/events.ts`).

### Test-Modus für das Feedback-Formular (vor dem ersten echten Event)

Da alle drei Events (18.06./16.07./20.08.2026) in der Zukunft liegen, ist das
Feedback-Dropdown bis zum ersten vergangenen Event leer. Zum Vorab-Testen:

1. Im **Preview-Deployment** die Umgebungsvariable
   `NEXT_PUBLIC_FEEDBACK_TEST_MODE=true` setzen und neu deployen.
2. Im Feedback-Formular erscheint dann zusätzlich die Option
   **„Testveranstaltung – nur Vorschau"**. Das Formular funktioniert normal und
   verschickt eine echte Mail an `info@kontor-businessclub.com` – der Betreff
   trägt das Präfix **`[TEST]`**.
3. In **Production** bleibt die Variable ungesetzt (`false`) → der Test-Eintrag
   erscheint nicht.
