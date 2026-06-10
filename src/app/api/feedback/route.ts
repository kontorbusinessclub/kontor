import { feedbackSchema } from "@/lib/forms/schemas";
import { handleFormRequest } from "@/lib/forms/handler";
import { getEventById, formatEventOption, FEEDBACK_TEST_EVENT_ID } from "@/lib/events";

export async function POST(req: Request) {
  return handleFormRequest(req, feedbackSchema, (data) => {
    // Test-/Vorschau-Event (Aufgabe 4): erkennbar an der festen id, Betreff
    // mit [TEST]-Prefix, damit echte und Test-Mails klar trennbar sind.
    const isTest = data.eventId === FEEDBACK_TEST_EVENT_ID;
    const event = getEventById(data.eventId);
    const eventLabel = isTest
      ? "Testveranstaltung – nur Vorschau"
      : event
        ? formatEventOption(event)
        : data.eventId;

    return {
      subject: `${isTest ? "[TEST] " : ""}Feedback (${data.bewertung}/5): ${eventLabel}`,
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
