import { eventRegistrationSchema } from "@/lib/forms/schemas";
import { handleFormRequest } from "@/lib/forms/handler";
import { escapeHtml } from "@/lib/email/format";
import { getEventById, formatEventOption } from "@/lib/events";

export async function POST(req: Request) {
  return handleFormRequest(req, eventRegistrationSchema, (data) => {
    const event = getEventById(data.eventId);
    const eventLabel = event ? formatEventOption(event) : data.eventId;
    const teilnahme: Record<string, string> = {
      member: "Bereits Kontor Business Club Member",
      vertretung: "Anmeldung als Vertretung",
      gast: "Anmeldung als Gast",
    };

    return {
      subject: `Anmeldung: ${eventLabel} – ${data.name}`,
      title: "Neue Veranstaltungs-Anmeldung",
      replyTo: data.email,
      fields: [
        { label: "Veranstaltung", value: eventLabel },
        { label: "Name", value: data.name },
        { label: "Unternehmen", value: data.firma },
        { label: "E-Mail", value: data.email },
        { label: "Telefon", value: data.telefon },
        { label: "Teilnahmeart", value: teilnahme[data.teilnahmeart] ?? data.teilnahmeart },
        ...(data.teilnahmeart === "vertretung"
          ? [{ label: "Vertretung für", value: data.vertretungFuer || "-" }]
          : []),
        { label: "Nachricht", value: data.nachricht },
      ],
      confirm: {
        to: data.email,
        subject: `Deine Anmeldung: ${eventLabel}`,
        html: `<p>Hallo ${escapeHtml(data.name)},</p>
          <p>deine Anmeldung für <b>${escapeHtml(
            eventLabel,
          )}</b> ist bei uns eingegangen. Wir freuen uns auf dich.</p>
          <p>Kontor Business Club</p>`,
        text: `Hallo ${data.name},\n\ndeine Anmeldung für ${eventLabel} ist bei uns eingegangen. Wir freuen uns auf dich.\n\nKontor Business Club`,
      },
    };
  });
}
