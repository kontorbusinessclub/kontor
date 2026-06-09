import { feedbackSchema } from "@/lib/forms/schemas";
import { handleFormRequest } from "@/lib/forms/handler";
import { getEventById, formatEventOption } from "@/lib/events";

export async function POST(req: Request) {
  return handleFormRequest(req, feedbackSchema, (data) => {
    const event = getEventById(data.eventId);
    const eventLabel = event ? formatEventOption(event) : data.eventId;

    return {
      subject: `Feedback (${data.bewertung}/5): ${eventLabel}`,
      title: "Neues Veranstaltungs-Feedback",
      replyTo: data.email,
      fields: [
        { label: "Veranstaltung", value: eventLabel },
        { label: "Name", value: data.name },
        { label: "E-Mail", value: data.email },
        { label: "Bewertung", value: `${data.bewertung} / 5` },
        { label: "Feedback", value: data.feedback },
        { label: "Was lief gut?", value: data.gutGelaufen || "-" },
        { label: "Was können wir verbessern?", value: data.verbessern || "-" },
      ],
    };
  });
}
