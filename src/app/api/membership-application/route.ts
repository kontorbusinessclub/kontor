import { membershipApplicationSchema } from "@/lib/forms/schemas";
import { handleFormRequest } from "@/lib/forms/handler";
import { escapeHtml } from "@/lib/email/format";

export async function POST(req: Request) {
  return handleFormRequest(req, membershipApplicationSchema, (data) => ({
    subject: `Mitgliedsantrag von ${data.firma}`,
    title: "Neuer Mitgliedsantrag",
    replyTo: data.email,
    fields: [
      { label: "Name", value: data.name },
      { label: "Firma", value: data.firma },
      { label: "Branche", value: data.branche },
      { label: "E-Mail", value: data.email },
      { label: "Telefon", value: data.telefon },
      { label: "Website", value: data.website || "-" },
      { label: "Nachricht", value: data.nachricht },
    ],
    confirm: {
      to: data.email,
      subject: "Dein Mitgliedsantrag beim Kontor Business Club",
      html: `<p>Hallo ${escapeHtml(data.name)},</p>
        <p>danke für deinen Antrag. Das Kuratorium prüft deine Angaben und
        meldet sich innerhalb von 7 Werktagen bei dir.</p>
        <p>Kontor Business Club</p>`,
      text: `Hallo ${data.name},\n\ndanke für deinen Antrag. Das Kuratorium prüft deine Angaben und meldet sich innerhalb von 7 Werktagen bei dir.\n\nKontor Business Club`,
    },
  }));
}
