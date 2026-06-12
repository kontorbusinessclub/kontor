import { membershipWizardSchema } from "@/lib/forms/membership";
import { handleFormRequest } from "@/lib/forms/handler";
import { escapeHtml } from "@/lib/email/format";
import { SEPA_ENABLED } from "@/lib/sepa";

export async function POST(req: Request) {
  // SEPA darf erst akzeptiert werden, wenn die Gläubiger-ID vorliegt (§18.4).
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
      { label: "Name", value: [data.titel, data.vorname, data.nachname].filter(Boolean).join(" ") },
      { label: "Berufsbezeichnung", value: data.berufsbezeichnung },
      { label: "Position", value: data.position },
      { label: "Geburtsdatum", value: data.geburtsdatum || "-" },
      { label: "Adresse", value: `${data.strasse}, ${data.plzOrt}` },
      { label: "Telefon (Mobil)", value: data.telefonMobil },
      { label: "Telefon (Geschäftlich)", value: data.telefonGeschaeftlich || "-" },
      { label: "E-Mail (Geschäftlich)", value: data.emailGeschaeftlich },
      { label: "E-Mail (Privat)", value: data.emailPrivat || "-" },
      { label: "Kurzbeschreibung Person & Tätigkeit", value: data.personenbeschreibung },
      { label: "Unternehmen", value: data.unternehmen },
      { label: "Rechtsform", value: data.rechtsform },
      { label: "Handelsregisternummer", value: data.handelsregisternummer || "-" },
      { label: "Website", value: data.website || "-" },
      {
        label: "Unternehmensanschrift",
        value: `${data.unternehmensanschrift}, ${data.plzOrtUnternehmen}`,
      },
      { label: "Branche", value: data.branche },
      { label: "Gewünschtes Fachgebiet", value: data.fachgebiet },
      { label: "Erwerbstätigkeit", value: data.erwerb },
      { label: "Unternehmensgröße", value: data.unternehmensgroesse },
      { label: "Kurzbeschreibung Unternehmen", value: data.unternehmensbeschreibung },
      {
        label: "Berechtigte Person für Events gewünscht",
        value: data.istVertreterGewuenscht === "ja" ? "Ja" : "Nein",
      },
      ...(data.istVertreterGewuenscht === "ja"
        ? [
            {
              label: "Berechtigte Person",
              value: `${[data.vbTitel, data.vbVorname, data.vbNachname].filter(Boolean).join(" ")}, ${data.vbBerufsbezeichnung}, ${data.vbPosition}, ${data.vbTelefon}, ${data.vbEmail}`,
            },
          ]
        : []),
      { label: "Gewünschtes Aufnahmedatum", value: data.aufnahmedatum },
      { label: "Empfohlen durch Mitglied", value: data.empfohlenVon || "-" },
      { label: "Zahlungsintervall", value: data.zahlungsintervall },
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
      { label: "Foto-/Video-Einverständnis", value: data.fotoEinverstaendnis ? "Ja" : "Nein" },
    ],
    confirm: {
      to: data.emailGeschaeftlich,
      subject: "Ihr Mitgliedsantrag beim Kontor Business Club",
      html: `<p>Hallo ${escapeHtml(data.vorname)} ${escapeHtml(data.nachname)},</p>
        <p>Ihr Mitgliedsantrag ist bei uns eingegangen. Das Kuratorium wird sich
        zeitnah mit Ihnen in Verbindung setzen.</p>
        <p>Kontor Business Club</p>`,
      text: `Hallo ${data.vorname} ${data.nachname},\n\nIhr Mitgliedsantrag ist bei uns eingegangen. Das Kuratorium wird sich zeitnah mit Ihnen in Verbindung setzen.\n\nKontor Business Club`,
    },
  }));
}
