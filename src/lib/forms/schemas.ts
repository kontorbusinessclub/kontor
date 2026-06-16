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
 * Form-sichere Boolean-Konvertierung. z.coerce.boolean() nutzt reine
 * JS-Truthiness, womit der String "false" zu true würde. Checkboxen
 * senden je nach Form "on", "true", "1" oder gar nichts.
 */
const formBoolean = z
  .union([z.boolean(), z.string(), z.undefined(), z.null()])
  .transform((value) => {
    if (typeof value === "boolean") return value;
    if (value == null) return false;
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "on" || normalized === "1";
  });

/**
 * Kontaktformular (Iteration 5 § 6). Neue Feldliste mit Anrede, getrenntem
 * Vor-/Nachnamen und optionalem Unternehmensblock. Telefon ist optional.
 */
export const contactSchema = z.object({
  anrede: z.enum(["herr", "frau"]),
  titel: z.string().trim().optional().or(z.literal("")),
  vorname: z.string().trim().min(2, "Bitte gib deinen Vornamen an."),
  name: z.string().trim().min(2, "Bitte gib deinen Namen an."),
  unternehmensname: z.string().trim().optional().or(z.literal("")),
  position: z.string().trim().optional().or(z.literal("")),
  email,
  telefon: z.string().trim().optional().or(z.literal("")),
  nachricht,
  hp: honeypot,
});

/**
 * Event-Anmeldung (Aufgabe 12): „Anzahl Gäste" entfernt, stattdessen
 * Pflicht-Auswahl der Veranstaltung über die id aus der zentralen Liste.
 */
export const eventRegistrationSchema = z.object({
  name,
  firma,
  email,
  telefon,
  nachricht: z.string().trim().optional().or(z.literal("")),
  eventId: z.string().trim().min(1, "Bitte wähle eine Veranstaltung."),
  vertreter: formBoolean,
  istMitglied: formBoolean,
  hp: honeypot,
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
