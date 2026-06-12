import { z } from "zod";
import { honeypot } from "./schemas";

/**
 * Schema + Konstanten für den Mitgliedsantrag-Wizard (Iteration 4 § 10).
 * 6 Schritte. Geteilt zwischen Wizard (Client) und
 * /api/membership-application (Server).
 */

export const ZAHLUNGSINTERVALLE = [
  "monatlich",
  "vierteljaehrlich",
  "halbjaehrlich",
  "jaehrlich",
] as const;

/** Unternehmensgrößen (Iteration 4 § 10.3). */
export const UNTERNEHMENSGROESSEN = [
  "1",
  "le10",
  "le50",
  "le250",
  "ge250",
] as const;

const pflicht = (msg: string) => z.string().trim().min(1, msg);
const optional = z.string().trim().optional().or(z.literal(""));

const requiredTrue = z
  .union([z.boolean(), z.string(), z.undefined(), z.null()])
  .transform((v) => v === true || v === "true" || v === "on" || v === "1");

const optionalBool = requiredTrue;

export const membershipWizardSchema = z
  .object({
    // Schritt 1 – Persönliche Angaben
    titel: optional,
    vorname: pflicht("Bitte gib deinen Vornamen an."),
    nachname: pflicht("Bitte gib deinen Nachnamen an."),
    berufsbezeichnung: pflicht("Bitte gib deine Berufsbezeichnung an."),
    position: pflicht("Bitte gib deine Position an."),
    geburtsdatum: optional,
    strasse: pflicht("Bitte gib Straße und Hausnummer an."),
    plzOrt: pflicht("Bitte gib PLZ und Ort an."),
    telefonMobil: z.string().trim().min(5, "Bitte gib eine Mobilnummer an."),
    telefonGeschaeftlich: optional,
    emailPrivat: z.string().trim().email("Ungültige E-Mail.").optional().or(z.literal("")),
    emailGeschaeftlich: z.string().trim().email("Bitte gib eine gültige geschäftliche E-Mail an."),
    personenbeschreibung: pflicht("Bitte beschreibe kurz dich und deine Tätigkeit."),

    // Schritt 2 – Unternehmensdaten
    unternehmen: pflicht("Bitte gib den Unternehmensnamen an."),
    rechtsform: pflicht("Bitte gib die Rechtsform an."),
    handelsregisternummer: optional,
    unternehmensanschrift: pflicht("Bitte gib die Unternehmensanschrift an."),
    plzOrtUnternehmen: pflicht("Bitte gib PLZ und Ort des Unternehmens an."),
    branche: pflicht("Bitte nenn deine Branche."),
    fachgebiet: pflicht("Bitte nenn dein gewünschtes Fachgebiet."),
    erwerb: z.enum(["haupttaetigkeit", "nebentaetigkeit"]),
    unternehmensgroesse: z.enum(UNTERNEHMENSGROESSEN),
    website: z.string().trim().url("Ungültige URL.").optional().or(z.literal("")),
    unternehmensbeschreibung: pflicht("Bitte beschreibe kurz dein Unternehmen."),

    // Schritt 3 – Vertretungsberechtigung (Event-Vertretung)
    istVertreterGewuenscht: z.enum(["ja", "nein"]),
    vbTitel: optional,
    vbVorname: optional,
    vbNachname: optional,
    vbBerufsbezeichnung: optional,
    vbPosition: optional,
    vbTelefon: optional,
    vbEmail: z.string().trim().email("Ungültige E-Mail.").optional().or(z.literal("")),

    // Schritt 4 – Mitgliedschaft & Zahlungsinformationen
    aufnahmedatum: pflicht("Bitte gib ein gewünschtes Aufnahmedatum an."),
    empfohlenVon: optional,
    zahlungsintervall: z.enum(ZAHLUNGSINTERVALLE),
    zahlungsmethode: z.enum(["sepa", "ueberweisung"]),
    kontoinhaber: optional,
    iban: optional,
    bic: optional,
    bank: optional,
    sepaMandat: optionalBool,

    // Schritt 5 – Einverständniserklärungen
    agbAkzeptiert: requiredTrue,
    datenschutzAkzeptiert: requiredTrue,
    unternehmerBestaetigung: requiredTrue,
    fotoEinverstaendnis: optionalBool,

    hp: honeypot,
  })
  .superRefine((data, ctx) => {
    // Felder zur berechtigten Person nur Pflicht, wenn gewünscht (§ 10.4).
    if (data.istVertreterGewuenscht === "ja") {
      for (const field of [
        "vbVorname",
        "vbNachname",
        "vbBerufsbezeichnung",
        "vbPosition",
        "vbTelefon",
      ] as const) {
        if (!data[field]) {
          ctx.addIssue({
            code: "custom",
            path: [field],
            message: "Bitte ausfüllen.",
          });
        }
      }
      if (!data.vbEmail) {
        ctx.addIssue({
          code: "custom",
          path: ["vbEmail"],
          message: "Bitte ausfüllen.",
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
