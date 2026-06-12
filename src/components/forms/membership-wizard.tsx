"use client";

import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  membershipWizardSchema,
  type MembershipWizardInput,
  type MembershipWizardData,
  ZAHLUNGSINTERVALLE,
  UNTERNEHMENSGROESSEN,
} from "@/lib/forms/membership";
import { SEPA_ENABLED } from "@/lib/sepa";
import { SEPA_MANDAT_TEXT } from "@/content/legal";
import { postForm, honeypotProps, submitErrorKey } from "@/lib/forms/submit";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type Values = MembershipWizardInput;

const TOTAL = 6;

/** Pflicht-/relevante Felder je Schritt (für die schrittweise Validierung). */
const STEP_FIELDS: FieldPath<Values>[][] = [
  ["titel", "vorname", "nachname", "berufsbezeichnung", "position", "geburtsdatum", "strasse", "plzOrt", "telefonMobil", "telefonGeschaeftlich", "emailPrivat", "emailGeschaeftlich", "personenbeschreibung"],
  ["unternehmen", "rechtsform", "handelsregisternummer", "unternehmensanschrift", "plzOrtUnternehmen", "branche", "fachgebiet", "erwerb", "unternehmensgroesse", "website", "unternehmensbeschreibung"],
  ["istVertreterGewuenscht", "vbVorname", "vbNachname", "vbBerufsbezeichnung", "vbPosition", "vbTelefon", "vbEmail"],
  ["aufnahmedatum", "empfohlenVon", "zahlungsintervall", "zahlungsmethode", "kontoinhaber", "iban", "sepaMandat"],
  ["agbAkzeptiert", "datenschutzAkzeptiert", "unternehmerBestaetigung"],
  [],
];

export function MembershipWizard() {
  const t = useTranslations("antrag");
  const tf = useTranslations("antrag.fields");
  const tc = useTranslations("common.form");
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorKey, setErrorKey] = useState("fehler");

  const form = useForm<Values, unknown, MembershipWizardData>({
    resolver: zodResolver(membershipWizardSchema),
    mode: "onTouched",
    defaultValues: {
      titel: "", vorname: "", nachname: "", berufsbezeichnung: "", position: "",
      geburtsdatum: "", strasse: "", plzOrt: "", telefonMobil: "", telefonGeschaeftlich: "",
      emailPrivat: "", emailGeschaeftlich: "", personenbeschreibung: "",
      unternehmen: "", rechtsform: "", handelsregisternummer: "",
      unternehmensanschrift: "", plzOrtUnternehmen: "", branche: "", fachgebiet: "",
      erwerb: "haupttaetigkeit", unternehmensgroesse: "1", website: "",
      unternehmensbeschreibung: "",
      istVertreterGewuenscht: "nein",
      vbTitel: "", vbVorname: "", vbNachname: "", vbBerufsbezeichnung: "", vbPosition: "",
      vbTelefon: "", vbEmail: "",
      aufnahmedatum: "", empfohlenVon: "",
      zahlungsintervall: "monatlich", zahlungsmethode: "ueberweisung",
      kontoinhaber: "", iban: "", bic: "", bank: "", sepaMandat: false,
      agbAkzeptiert: false, datenschutzAkzeptiert: false,
      unternehmerBestaetigung: false, fotoEinverstaendnis: false,
      hp: "",
    },
  });

  const { register, handleSubmit, trigger, watch, getValues, formState: { isSubmitting } } = form;

  const vertreterJa = watch("istVertreterGewuenscht") === "ja";
  const istSepa = watch("zahlungsmethode") === "sepa";

  async function next() {
    const ok = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (ok) setStep((s) => Math.min(s + 1, TOTAL - 1));
  }

  async function onSubmit(values: MembershipWizardData) {
    setStatus("idle");
    const result = await postForm("/api/membership-application", values);
    if (result.ok) {
      setStatus("success");
      return;
    }
    setErrorKey(submitErrorKey(result.reason));
    setStatus("error");
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-smaragd/40 bg-white p-8 text-center">
        <h2 className="font-serif text-2xl font-semibold text-koenigsblau">{t("erfolgTitel")}</h2>
        <p className="mt-4 font-sans text-lg text-tinte/85">{t("erfolgText1")}</p>
        <p className="mt-1 font-sans text-lg text-tinte/85">{t("erfolgText2")}</p>
        <div className="mt-8">
          <Button href="/">{t("erfolgCta")}</Button>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / TOTAL) * 100;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      <input {...honeypotProps} {...register("hp")} />

      {/* Fortschrittsanzeige */}
      <div>
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-koenigsblau">
          <span>{t("schrittLabel", { n: step + 1, total: TOTAL })}</span>
          <span>{t(`steps.${step + 1}`)}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-koenigsblau/15">
          <div className="h-full rounded-full bg-gold transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Schritt 1 – Persönliche Angaben */}
      {step === 0 ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="titel" label={tf("titel")} form={form} />
            <span className="hidden sm:block" aria-hidden="true" />
            <TextField name="vorname" label={tf("vorname")} required form={form} />
            <TextField name="nachname" label={tf("nachname")} required form={form} />
            <TextField name="berufsbezeichnung" label={tf("berufsbezeichnung")} required form={form} />
            <TextField name="position" label={tf("position")} required form={form} />
            <TextField name="geburtsdatum" label={tf("geburtsdatum")} type="date" form={form} />
            <TextField name="strasse" label={tf("strasse")} required form={form} />
            <TextField name="plzOrt" label={tf("plzOrt")} required form={form} />
            <span className="hidden sm:block" aria-hidden="true" />
            <TextField name="telefonMobil" label={tf("telefonMobil")} type="tel" required form={form} />
            <TextField name="telefonGeschaeftlich" label={tf("telefonGeschaeftlich")} type="tel" form={form} />
            <TextField name="emailPrivat" label={tf("emailPrivat")} type="email" form={form} />
            <TextField name="emailGeschaeftlich" label={tf("emailGeschaeftlich")} type="email" required form={form} />
          </div>
          <Field label={tf("personenbeschreibung")} htmlFor="mw-personenbeschreibung" required error={fieldError(form, "personenbeschreibung")}>
            <Textarea id="mw-personenbeschreibung" {...register("personenbeschreibung")} />
          </Field>
        </div>
      ) : null}

      {/* Schritt 2 – Unternehmensdaten */}
      {step === 1 ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="unternehmen" label={tf("unternehmen")} required form={form} />
            <TextField name="rechtsform" label={tf("rechtsform")} required form={form} />
            <TextField name="handelsregisternummer" label={tf("handelsregisternummer")} form={form} />
            <TextField name="website" label={tf("website")} type="url" form={form} />
            <TextField name="unternehmensanschrift" label={tf("unternehmensanschrift")} required form={form} />
            <TextField name="plzOrtUnternehmen" label={tf("plzOrtUnternehmen")} required form={form} />
            <TextField name="branche" label={tf("branche")} required form={form} />
            <TextField name="fachgebiet" label={tf("fachgebiet")} required form={form} />
          </div>

          <RadioGroup
            name="erwerb"
            label={tf("erwerb")}
            form={form}
            options={(["haupttaetigkeit", "nebentaetigkeit"] as const).map((v) => ({ value: v, label: t(`erwerbOpt.${v}`) }))}
          />

          <Field label={tf("unternehmensgroesse")} htmlFor="mw-groesse" required error={fieldError(form, "unternehmensgroesse")}>
            <Select id="mw-groesse" {...register("unternehmensgroesse")}>
              {UNTERNEHMENSGROESSEN.map((g) => (
                <option key={g} value={g}>{t(`groessen.${g}`)}</option>
              ))}
            </Select>
          </Field>

          <Field label={tf("unternehmensbeschreibung")} htmlFor="mw-unternehmensbeschreibung" required error={fieldError(form, "unternehmensbeschreibung")}>
            <Textarea id="mw-unternehmensbeschreibung" {...register("unternehmensbeschreibung")} />
          </Field>
        </div>
      ) : null}

      {/* Schritt 3 – Vertretungsberechtigung */}
      {step === 2 ? (
        <div className="flex flex-col gap-6">
          <RadioGroup
            name="istVertreterGewuenscht"
            label={tf("istVertreterGewuenscht")}
            form={form}
            options={[
              { value: "ja", label: t("ja") },
              { value: "nein", label: t("nein") },
            ]}
          />
          {vertreterJa ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField name="vbTitel" label={tf("vbTitel")} form={form} />
              <span className="hidden sm:block" aria-hidden="true" />
              <TextField name="vbVorname" label={tf("vbVorname")} required form={form} />
              <TextField name="vbNachname" label={tf("vbNachname")} required form={form} />
              <TextField name="vbBerufsbezeichnung" label={tf("vbBerufsbezeichnung")} required form={form} />
              <TextField name="vbPosition" label={tf("vbPosition")} required form={form} />
              <TextField name="vbTelefon" label={tf("vbTelefon")} type="tel" required form={form} />
              <TextField name="vbEmail" label={tf("vbEmail")} type="email" required form={form} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Schritt 4 – Mitgliedschaft & Zahlungsinformationen */}
      {step === 3 ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="aufnahmedatum" label={tf("aufnahmedatum")} type="date" required form={form} />
            <TextField name="empfohlenVon" label={tf("empfohlenVon")} form={form} />
          </div>

          <RadioGroup
            name="zahlungsintervall"
            label={tf("zahlungsintervall")}
            form={form}
            options={ZAHLUNGSINTERVALLE.map((v) => ({ value: v, label: t(`intervalle.${v}`) }))}
          />
          <p className="font-sans text-sm text-tinte/70">{t("aufnahmegebuehr")}</p>

          {/* Zahlungsmethode (§ 10.6) */}
          <fieldset>
            <legend className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-koenigsblau">
              {tf("zahlungsmethode")}<span className="text-smaragd"> *</span>
            </legend>
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <label
                  className={`flex items-center gap-3 font-sans text-base ${SEPA_ENABLED ? "text-tinte" : "text-tinte/40"}`}
                  title={!SEPA_ENABLED ? t("sepaBald") : undefined}
                >
                  <input type="radio" value="sepa" disabled={!SEPA_ENABLED} {...register("zahlungsmethode")} className="size-5" />
                  <span>{t("methoden.sepa")}</span>
                </label>
                <span className="font-sans text-sm text-smaragd">{t("sepaBald")}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-3 font-sans text-base text-tinte">
                  <input type="radio" value="ueberweisung" {...register("zahlungsmethode")} className="size-5" />
                  <span>{t("methoden.ueberweisung")}</span>
                </label>
                <span className="rounded-lg border border-smaragd px-3 py-1 font-sans text-sm text-smaragd">
                  {t("ueberweisungInfo")}
                </span>
              </div>
            </div>
            {fieldError(form, "zahlungsmethode") ? (
              <p role="alert" className="mt-1 font-sans text-sm text-smaragd">{fieldError(form, "zahlungsmethode")}</p>
            ) : null}
          </fieldset>

          {istSepa ? (
            <div className="flex flex-col gap-6 rounded-md border border-koenigsblau/20 p-5">
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField name="kontoinhaber" label={tf("kontoinhaber")} required form={form} />
                <TextField name="iban" label={tf("iban")} required form={form} />
                <TextField name="bic" label={tf("bic")} form={form} />
                <TextField name="bank" label={tf("bank")} form={form} />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-koenigsblau">{t("sepaMandatTitel")}</p>
                <p className="mt-2 whitespace-pre-line font-sans text-sm text-tinte/80">{SEPA_MANDAT_TEXT}</p>
              </div>
              <Checkbox name="sepaMandat" form={form}>{t("sepaMandatCheckbox")}</Checkbox>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Schritt 5 – Einverständniserklärungen */}
      {step === 4 ? (
        <div className="flex flex-col gap-4">
          <Checkbox name="agbAkzeptiert" form={form} required>
            {t("einverstaendnis.agb")}{" ("}
            <Link href="/agb" target="_blank" className="text-koenigsblau underline decoration-gold underline-offset-2">
              {t("agbLink")}
            </Link>
            {")"}
          </Checkbox>
          <Checkbox name="datenschutzAkzeptiert" form={form} required>
            {t("einverstaendnis.datenschutz")}{" ("}
            <Link href="/datenschutz" target="_blank" className="text-koenigsblau underline decoration-gold underline-offset-2">
              {t("datenschutzLink")}
            </Link>
            {")"}
          </Checkbox>
          <Checkbox name="unternehmerBestaetigung" form={form} required>
            {t("einverstaendnis.unternehmer")}
          </Checkbox>
          <Checkbox name="fotoEinverstaendnis" form={form}>
            {t("einverstaendnis.foto")}
          </Checkbox>
        </div>
      ) : null}

      {/* Schritt 6 – Zusammenfassung */}
      {step === 5 ? (
        <div className="flex flex-col gap-6">
          <h3 className="font-serif text-xl font-semibold text-koenigsblau">{t("reviewTitel")}</h3>
          {reviewGroups(getValues(), t, tf, vertreterJa).map((group) => (
            <div key={group.step} className="rounded-md border border-koenigsblau/20 bg-champagner/40 p-5">
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-koenigsblau">
                  {group.title}
                </h4>
                <button
                  type="button"
                  onClick={() => setStep(group.step)}
                  className="font-sans text-sm text-koenigsblau underline decoration-gold underline-offset-2 hover:text-kontorblau"
                >
                  {t("bearbeiten")}
                </button>
              </div>
              <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {group.rows.map(([label, value]) => (
                  <div key={label} className="flex flex-col">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-tinte/60">{label}</dt>
                    <dd className="whitespace-pre-line font-sans text-sm text-tinte/90">{value || "–"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
          {status === "error" ? (
            <p role="alert" className="font-sans text-base text-smaragd">{tc(errorKey)}</p>
          ) : null}
        </div>
      ) : null}

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-gold/30 pt-6">
        <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
          {t("zurueck")}
        </Button>
        {step < TOTAL - 1 ? (
          <Button type="button" onClick={next}>{t("weiter")}</Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("senden") : t("absenden")}
          </Button>
        )}
      </div>
    </form>
  );
}

// --- kleine Feld-Helfer, um Wiederholung zu vermeiden ---

type FormType = ReturnType<typeof useForm<Values, unknown, MembershipWizardData>>;

function fieldError(form: FormType, name: FieldPath<Values>): string | undefined {
  return form.getFieldState(name, form.formState).error?.message;
}

function TextField({
  name, label, type = "text", required, form,
}: {
  name: FieldPath<Values>;
  label: string;
  type?: string;
  required?: boolean;
  form: FormType;
}) {
  const error = fieldError(form, name);
  return (
    <Field label={label} htmlFor={`mw-${name}`} required={required} error={error}>
      <Input id={`mw-${name}`} type={type} invalid={Boolean(error)} {...form.register(name)} />
    </Field>
  );
}

function RadioGroup({
  name, label, options, form,
}: {
  name: FieldPath<Values>;
  label: string;
  options: { value: string; label: string }[];
  form: FormType;
}) {
  const error = fieldError(form, name);
  return (
    <fieldset>
      <legend className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-koenigsblau">
        {label}<span className="text-smaragd"> *</span>
      </legend>
      <div className="mt-3 flex flex-col gap-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-3 font-sans text-base text-tinte">
            <input type="radio" value={opt.value} {...form.register(name)} className="size-5" />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      {error ? <p role="alert" className="mt-1 font-sans text-sm text-smaragd">{error}</p> : null}
    </fieldset>
  );
}

function Checkbox({
  name, form, required, children,
}: {
  name: FieldPath<Values>;
  form: FormType;
  required?: boolean;
  children: React.ReactNode;
}) {
  const error = fieldError(form, name);
  return (
    <div>
      <label className="flex items-start gap-3 font-sans text-sm leading-relaxed text-tinte">
        <input type="checkbox" {...form.register(name)} className="mt-1 size-5 shrink-0" />
        <span>
          {children}
          {required ? <span className="text-smaragd"> *</span> : null}
        </span>
      </label>
      {error ? <p role="alert" className="mt-1 pl-8 font-sans text-sm text-smaragd">{error}</p> : null}
    </div>
  );
}

type ReviewGroup = { step: number; title: string; rows: [string, string][] };

/** Gruppierte Zusammenfassung für den Review-Schritt (§ 10.11). */
function reviewGroups(
  v: Values,
  t: (k: string) => string,
  tf: (k: string) => string,
  vertreterJa: boolean,
): ReviewGroup[] {
  const groups: ReviewGroup[] = [
    {
      step: 0,
      title: t("steps.1"),
      rows: [
        [tf("vorname"), [v.titel, v.vorname, v.nachname].filter(Boolean).join(" ")],
        [tf("berufsbezeichnung"), v.berufsbezeichnung ?? ""],
        [tf("position"), v.position ?? ""],
        [tf("strasse"), [v.strasse, v.plzOrt].filter(Boolean).join(", ")],
        [tf("telefonMobil"), v.telefonMobil ?? ""],
        [tf("emailGeschaeftlich"), v.emailGeschaeftlich ?? ""],
        [tf("personenbeschreibung"), v.personenbeschreibung ?? ""],
      ],
    },
    {
      step: 1,
      title: t("steps.2"),
      rows: [
        [tf("unternehmen"), v.unternehmen ?? ""],
        [tf("rechtsform"), v.rechtsform ?? ""],
        [tf("branche"), v.branche ?? ""],
        [tf("fachgebiet"), v.fachgebiet ?? ""],
        [tf("erwerb"), v.erwerb ? t(`erwerbOpt.${v.erwerb}`) : ""],
        [tf("unternehmensgroesse"), v.unternehmensgroesse ? t(`groessen.${v.unternehmensgroesse}`) : ""],
        [tf("unternehmensbeschreibung"), v.unternehmensbeschreibung ?? ""],
      ],
    },
    {
      step: 2,
      title: t("steps.3"),
      rows: vertreterJa
        ? [
            [tf("istVertreterGewuenscht"), t("ja")],
            [tf("vbVorname"), [v.vbTitel, v.vbVorname, v.vbNachname].filter(Boolean).join(" ")],
            [tf("vbBerufsbezeichnung"), v.vbBerufsbezeichnung ?? ""],
            [tf("vbPosition"), v.vbPosition ?? ""],
            [tf("vbTelefon"), v.vbTelefon ?? ""],
            [tf("vbEmail"), v.vbEmail ?? ""],
          ]
        : [[tf("istVertreterGewuenscht"), t("nein")]],
    },
    {
      step: 3,
      title: t("steps.4"),
      rows: [
        [tf("aufnahmedatum"), v.aufnahmedatum ?? ""],
        [tf("empfohlenVon"), v.empfohlenVon ?? ""],
        [tf("zahlungsintervall"), v.zahlungsintervall ? t(`intervalle.${v.zahlungsintervall}`) : ""],
        [tf("zahlungsmethode"), v.zahlungsmethode ? t(`methoden.${v.zahlungsmethode}`) : ""],
      ],
    },
    {
      step: 4,
      title: t("steps.5"),
      rows: [
        [t("agbLink"), boolLabel(t, v.agbAkzeptiert)],
        [t("datenschutzLink"), boolLabel(t, v.datenschutzAkzeptiert)],
      ],
    },
  ];
  return groups;
}

function boolLabel(t: (k: string) => string, value: unknown): string {
  const truthy = value === true || value === "true" || value === "on" || value === "1";
  return truthy ? t("ja") : t("nein");
}
