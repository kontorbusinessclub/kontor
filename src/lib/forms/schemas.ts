import { z } from "zod";

/**
 * Zod-Schemas fuer alle Formulare.
 *
 * Telefon ist in allen drei Formularen Pflicht (Jean-Vorgabe:
 * Rueckruf statt nur Mail). Fehlertexte in Du-Form, ohne Floskeln.
 */

const name = z.string().trim().min(2, "Bitte gib deinen Namen an.");
const firma = z.string().trim().min(2, "Bitte gib deine Firma an.");
const email = z.string().trim().email("Bitte gib eine gueltige E-Mail-Adresse an.");
const telefon = z.string().trim().min(5, "Bitte gib eine Telefonnummer an.");
const nachricht = z.string().trim().min(10, "Bitte schreib uns ein paar Zeilen.");

/**
 * Form-sichere Boolean-Konvertierung. z.coerce.boolean() nutzt reine
 * JS-Truthiness, womit der String "false" zu true wuerde. Checkboxen
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

/** Basis-Felder, die alle Formulare teilen. */
const baseFields = {
  name,
  firma,
  email,
  telefon,
  nachricht,
};

export const contactSchema = z.object({
  ...baseFields,
});

export const membershipApplicationSchema = z.object({
  ...baseFields,
  branche: z.string().trim().min(2, "Bitte nenn deine Branche."),
  website: z
    .string()
    .trim()
    .url("Bitte gib eine gueltige URL an.")
    .optional()
    .or(z.literal("")),
});

export const eventRegistrationSchema = z.object({
  ...baseFields,
  eventName: z.string().trim().min(1, "Bitte gib das Event an."),
  anzahlGaeste: z.coerce
    .number()
    .min(0, "Die Anzahl darf nicht negativ sein."),
  vertreter: formBoolean,
  istMitglied: formBoolean,
});

export type ContactInput = z.infer<typeof contactSchema>;
export type MembershipApplicationInput = z.infer<
  typeof membershipApplicationSchema
>;
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
