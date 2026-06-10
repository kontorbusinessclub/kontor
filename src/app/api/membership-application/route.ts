import { membershipWizardSchema } from "@/lib/forms/membership";
import { handleFormRequest } from "@/lib/forms/handler";
import { escapeHtml } from "@/lib/email/format";
import { SEPA_ENABLED } from "@/lib/sepa";

export async function POST(req: Request) {
  // SEPA darf erst akzeptiert werden, wenn die Gläubiger-ID vorliegt (§13/§18.4).
  // Vorab-Check, bevor die generische Verarbeitung greift.
  try {
    const clone = req.clone();
    const body = (await clone.json()) as { zahlungsmethode?: string };
    if (body?.zahlungsmethode === "sepa" && !SEPA_ENABLED) {
      return new Response(
        JSON.stringify({ ok: false, error: "sepa_disabled" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch {
    // Body wird in handleFormRequest erneut/eigentlich gelesen.
  }

  return handleFormRequest(req, membershipWizardSchema, (data) => ({
    subject: `Mitgliedsantrag: ${data.unternehmen} (${data.vorname} ${data.nachname})`,
    title: "Neuer Mitgliedsantrag",
    replyTo: data.emailGeschaeftlich,
    fields: [
      { label: "Name", value: `${data.vorname} ${data.nachname}` },
      { label: "Titel / Funktion", value: data.titelFunktion || "-" },
      { label: "Geburtsdatum", value: data.geburtsdatum || "-" },
      { label: "Adresse", value: `${data.strasse}, ${data.plzOrt}` },
      { label: "Telefon mobil", value: data.telefonMobil },
      { label: "Telefon Büro", value: data.telefonBuero || "-" },
      { label: "E-Mail geschäftlich", value: data.emailGeschaeftlich },
      { label: "E-Mail privat", value: data.emailPrivat || "-" },
      { label: "Website", value: data.website || "-" },
      { label: "Unternehmen", value: data.unternehmen },
      { label: "Rechtsform", value: data.rechtsform },
      { label: "Registernummer", value: data.registernummer || "-" },
      {
        label: "Unternehmensanschrift",
        value: `${data.unternehmensanschrift}, ${data.plzOrtUnternehmen}`,
      },
      { label: "Branche", value: data.branche },
      { label: "Gewünschtes Fachgebiet", value: data.fachgebiet },
      { label: "Erwerb", value: data.erwerb },
      { label: "Unternehmensgröße", value: data.unternehmensgroesse },
      { label: "Kurzbeschreibung", value: data.kurzbeschreibung },
      { label: "Kurzpräsentation", value: data.kurzpraesentation },
      {
        label: "Vertretungsberechtigt = Antragsteller",
        value: data.istVertretungsberechtigt === "ja" ? "Ja" : "Nein",
      },
      ...(data.istVertretungsberechtigt === "nein"
        ? [
            {
              label: "Vertretungsberechtigte Person",
              value: `${data.vbVorname} ${data.vbNachname}, ${data.vbFunktion}, ${data.vbTelefon}, ${data.vbEmail}`,
            },
          ]
        : []),
      { label: "Zahlungsintervall", value: data.zahlungsintervall },
      { label: "Gewünschter Start", value: data.starttermin },
      { label: "Empfohlen durch", value: data.empfohlenVon || "-" },
      { label: "Zahlungsmethode", value: data.zahlungsmethode },
      ...(data.zahlungsmethode === "sepa"
        ? [
            { label: "Kontoinhaber", value: data.kontoinhaber || "-" },
            { label: "IBAN", value: data.iban || "-" },
            { label: "BIC", value: data.bic || "-" },
            { label: "Bank", value: data.bank || "-" },
            { label: "SEPA-Mandat erteilt", value: data.sepaMandat ? "Ja" : "Nein" },
          ]
        : []),
      { label: "Profiltext", value: data.profiltext || "-" },
      { label: "Referenzleistungen", value: data.referenzen || "-" },
      { label: "Kommunikationskanäle", value: data.kommunikation.join(", ") || "-" },
      { label: "Foto-/Video-Einverständnis", value: data.fotoEinverstaendnis ? "Ja" : "Nein" },
    ],
    confirm: {
      to: data.emailGeschaeftlich,
      subject: "Dein Mitgliedsantrag beim Kontor Business Club",
      html: `<p>Hallo ${escapeHtml(data.vorname)} ${escapeHtml(data.nachname)},</p>
        <p>vielen Dank, dein Antrag ist bei uns eingegangen. Das Kuratorium
        meldet sich innerhalb von 7 Werktagen bei dir.</p>
        <p>Kontor Business Club</p>`,
      text: `Hallo ${data.vorname} ${data.nachname},\n\nvielen Dank, dein Antrag ist bei uns eingegangen. Das Kuratorium meldet sich innerhalb von 7 Werktagen bei dir.\n\nKontor Business Club`,
    },
  }));
}
