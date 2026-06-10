import { contactSchema } from "@/lib/forms/schemas";
import { handleFormRequest } from "@/lib/forms/handler";

export async function POST(req: Request) {
  return handleFormRequest(req, contactSchema, (data) => ({
    subject: `Kontaktanfrage von ${data.name}`,
    title: "Neue Kontaktanfrage",
    replyTo: data.email,
    fields: [
      { label: "Name", value: data.name },
      { label: "Firma", value: data.firma },
      { label: "E-Mail", value: data.email },
      { label: "Telefon", value: data.telefon },
      { label: "Nachricht", value: data.nachricht },
    ],
  }));
}
