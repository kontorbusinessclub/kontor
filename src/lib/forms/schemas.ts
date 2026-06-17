import { z } from "zod";

/**
 * Zod-Schemas für alle Formulare. Geteilt zwischen Frontend
 * (react-hook-form) und den /api-Route-Handlern (Aufgabe 15).
 *
 * Telefon ist Pflicht (Rückruf statt nur Mail). Fehlertexte in Du-Form.
 */

const name = z.string().trim().min(2, "Bitte gib deinen Namen an.");
const firma = z.string().trim().min(2, "Bitte gib deine Firma an.");
const email = z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse an.");
const telefon = z.string().trim().min(5, "Bitte gib eine Telefonnummer an.");
const nachricht = z.string().trim().min(10, "Bitte schreib uns ein paar Zeilen.");

/**
 * Honeypot gegen Spam-Bots (Aufgabe 15). Echte Nutzer sehen das Feld
 * nie und lassen es leer; Bots füllen es aus. Server verwirft befüllte.
 */
export const honeypot = z.string().max(0).optional().or(z.literal(""));

/**
 * Kontaktformular (Iteration 5 § 6 / Iteration 6 § 10). Unternehmensname
 * und Position im Unternehmen sind jetzt Pflichtfelder.
 */
export const contactSchema = z.object({
  anrede: z.enum(["herr", "frau"]),
  titel: z.string().trim().optional().or(z.literal("")),
  vorname: z.string().trim().min(2, "Bitte gib deinen Vornamen an."),
  name: z.string().trim().min(2, "Bitte gib deinen Namen an."),
  unternehmensname: z.string().trim().min(2, "Bitte gib den Unternehmensnamen an."),
  position: z.string().trim().min(2, "Bitte gib deine Position im Unternehmen an."),
  email,
  telefon: z.string().trim().optional().or(z.literal("")),
  nachricht,
  hp: honeypot,
});

/**
 * Event-Anmeldung (Iteration 6 § 8/§ 9): „Firma"→„Unternehmen" (UI),
 * Nachricht ist Pflicht, und die Teilnahmeart wird per Radio gewählt
 * (Member / Vertretung / Gast). Bei „Vertretung" ist das Feld
 * „vertretungFuer" Pflicht.
 */
export const eventRegistrationSchema = z
  .object({
    name,
    firma,
    email,
    telefon,
    nachricht,
    eventId: z.string().trim().min(1, "Bitte wähle eine Veranstaltung."),
    teilnahmeart: z.enum(["member", "vertretung", "gast"]),
    vertretungFuer: z.string().trim().optional().or(z.literal("")),
    hp: honeypot,
  })
  .superRefine((data, ctx) => {
    if (data.teilnahmeart === "vertretung" && !data.vertretungFuer) {
      ctx.addIssue({
        code: "custom",
        path: ["vertretungFuer"],
        message: "Bitte gib an, wen du vertrittst.",
      });
    }
  });

/**
 * Veranstaltungs-Feedback (Aufgabe 12.3). E-Mail ist Pflicht
 * (kein anonymes Feedback). Bewertung 1–5 Sterne.
 */
export const feedbackSchema = z.object({
  name,
  email,
  eventId: z.string().trim().min(1, "Bitte wähle eine Veranstaltung."),
  bewertung: z.coerce
    .number()
    .int()
    .min(1, "Bitte gib eine Bewertung von 1 bis 5 ab.")
    .max(5, "Bitte gib eine Bewertung von 1 bis 5 ab."),
  feedback: z
    .string()
    .trim()
    .min(20, "Bitte schreib uns mindestens 20 Zeichen."),
  gutGelaufen: z.string().trim().optional().or(z.literal("")),
  verbessern: z.string().trim().optional().or(z.literal("")),
  hp: honeypot,
});

export type ContactInput = z.infer<typeof contactSchema>;
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
