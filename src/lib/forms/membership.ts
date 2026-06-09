import { z } from "zod";
import { honeypot } from "./schemas";

/**
 * Schema + Konstanten für den mehrstufigen Mitgliedsantrag (Aufgabe 13).
 * Geteilt zwischen Wizard (Client) und /api/membership-application (Server).
 */

export const ZAHLUNGSINTERVALLE = [
  { value: "monatlich", betrag: "80,00 €" },
  { value: "vierteljaehrlich", betrag: "240,00 €" },
  { value: "halbjaehrlich", betrag: "480,00 €" },
  { value: "jaehrlich", betrag: "960,00 €" },
] as const;

export const UNTERNEHMENSGROESSEN = [
  "1",
  "2-5",
  "6-20",
  "21-50",
  "50+",
] as const;

export const KOMMUNIKATIONSKANAELE = ["email", "whatsapp", "app"] as const;

const pflicht = (msg: string) => z.string().trim().min(1, msg);
const optional = z.string().trim().optional().or(z.literal(""));

const requiredTrue = z
  .union([z.boolean(), z.string(), z.undefined(), z.null()])
  .transform((v) => v === true || v === "true" || v === "on" || v === "1");

const optionalBool = requiredTrue;

export const membershipWizardSchema = z
  .object({
    // Schritt 1 – Persönliche Angaben
    vorname: pflicht("Bitte gib deinen Vornamen an."),
    nachname: pflicht("Bitte gib deinen Nachnamen an."),
    titelFunktion: optional,
    geburtsdatum: optional,
    strasse: pflicht("Bitte gib Straße und Hausnummer an."),
    plzOrt: pflicht("Bitte gib PLZ und Ort an."),
    telefonMobil: z.string().trim().min(5, "Bitte gib eine Mobilnummer an."),
    telefonBuero: optional,
    emailPrivat: z.string().trim().email("Ungültige E-Mail.").optional().or(z.literal("")),
    emailGeschaeftlich: z.string().trim().email("Bitte gib eine gültige geschäftliche E-Mail an."),
    website: z.string().trim().url("Ungültige URL.").optional().or(z.literal("")),

    // Schritt 2 – Unternehmensdaten
    unternehmen: pflicht("Bitte gib den Unternehmensnamen an."),
    rechtsform: pflicht("Bitte gib die Rechtsform an."),
    registernummer: optional,
    unternehmensanschrift: pflicht("Bitte gib die Unternehmensanschrift an."),
    plzOrtUnternehmen: pflicht("Bitte gib PLZ und Ort des Unternehmens an."),
    branche: pflicht("Bitte nenn deine Branche."),
    fachgebiet: pflicht("Bitte nenn dein gewünschtes Fachgebiet."),
    erwerb: z.enum(["haupterwerb", "nebenerwerb"]),
    unternehmensgroesse: z.enum(UNTERNEHMENSGROESSEN),
    kurzbeschreibung: z.string().trim().min(100, "Mindestens 100 Zeichen."),
    kurzpraesentation: z.string().trim().min(200, "Mindestens 200 Zeichen."),

    // Schritt 3 – Vertretungsberechtigte Person
    istVertretungsberechtigt: z.enum(["ja", "nein"]),
    vbVorname: optional,
    vbNachname: optional,
    vbFunktion: optional,
    vbTelefon: optional,
    vbEmail: z.string().trim().email("Ungültige E-Mail.").optional().or(z.literal("")),

    // Schritt 4 – Mitgliedschaft & Laufzeit
    zahlungsintervall: z.enum([
      "monatlich",
      "vierteljaehrlich",
      "halbjaehrlich",
      "jaehrlich",
    ]),
    starttermin: pflicht("Bitte gib einen gewünschten Starttermin an."),
    empfohlenVon: optional,

    // Schritt 5 – Zahlungsinformation
    zahlungsmethode: z.enum(["sepa", "ueberweisung"]),
    kontoinhaber: optional,
    iban: optional,
    bic: optional,
    bank: optional,
    sepaMandat: optionalBool,

    // Schritt 6 – Kommunikation & Online-Präsenz
    profiltext: optional,
    referenzen: optional,
    kommunikation: z.array(z.enum(KOMMUNIKATIONSKANAELE)).optional().default([]),

    // Schritt 8 – Erklärungen & Einverständnisse
    agbAkzeptiert: requiredTrue,
    datenschutzAkzeptiert: requiredTrue,
    fotoEinverstaendnis: optionalBool,
    unternehmerBestaetigung: requiredTrue,

    hp: honeypot,
  })
  .superRefine((data, ctx) => {
    // Vertretungsberechtigte Person bei "nein" Pflichtangaben
    if (data.istVertretungsberechtigt === "nein") {
      for (const field of ["vbVorname", "vbNachname", "vbFunktion", "vbTelefon"] as const) {
        if (!data[field]) {
          ctx.addIssue({
            code: "custom",
            path: [field],
            message: "Pflichtangabe zur vertretungsberechtigten Person.",
          });
        }
      }
      if (!data.vbEmail) {
        ctx.addIssue({
          code: "custom",
          path: ["vbEmail"],
          message: "Pflichtangabe zur vertretungsberechtigten Person.",
        });
      }
    }

    // SEPA-Pflichtfelder, wenn SEPA gewählt
    if (data.zahlungsmethode === "sepa") {
      if (!data.kontoinhaber) {
        ctx.addIssue({ code: "custom", path: ["kontoinhaber"], message: "Bitte gib den Kontoinhaber an." });
      }
      if (!data.iban) {
        ctx.addIssue({ code: "custom", path: ["iban"], message: "Bitte gib die IBAN an." });
      }
      if (!data.sepaMandat) {
        ctx.addIssue({ code: "custom", path: ["sepaMandat"], message: "Bitte stimme dem SEPA-Mandat zu." });
      }
    }

    // Pflicht-Checkboxen
    for (const field of ["agbAkzeptiert", "datenschutzAkzeptiert", "unternehmerBestaetigung"] as const) {
      if (!data[field]) {
        ctx.addIssue({ code: "custom", path: [field], message: "Diese Bestätigung ist erforderlich." });
      }
    }
  });

export type MembershipWizardInput = z.input<typeof membershipWizardSchema>;
export type MembershipWizardData = z.output<typeof membershipWizardSchema>;
