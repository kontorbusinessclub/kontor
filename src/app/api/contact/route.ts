import { contactSchema } from "@/lib/forms/schemas";
import { handleFormRequest } from "@/lib/forms/handler";

const ANREDE: Record<string, string> = { herr: "Herr", frau: "Frau" };

export async function POST(req: Request) {
  return handleFormRequest(req, contactSchema, (data) => ({
    subject: `Kontaktanfrage von ${data.vorname} ${data.name}`,
    title: "Neue Kontaktanfrage",
    replyTo: data.email,
    fields: [
      { label: "Anrede", value: ANREDE[data.anrede] ?? data.anrede },
      { label: "Titel", value: data.titel || "-" },
      { label: "Vorname", value: data.vorname },
      { label: "Name", value: data.name },
      { label: "Unternehmensname", value: data.unternehmensname || "-" },
      { label: "Position im Unternehmen", value: data.position || "-" },
      { label: "E-Mail", value: data.email },
      { label: "Telefon", value: data.telefon || "-" },
      { label: "Nachricht", value: data.nachricht },
    ],
  }));
}
