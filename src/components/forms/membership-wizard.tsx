"use client";

import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as Accordion from "@radix-ui/react-accordion";
import { Link } from "@/i18n/navigation";
import {
  membershipWizardSchema,
  type MembershipWizardInput,
  type MembershipWizardData,
  ZAHLUNGSINTERVALLE,
  UNTERNEHMENSGROESSEN,
  KOMMUNIKATIONSKANAELE,
} from "@/lib/forms/membership";
import { SEPA_ENABLED } from "@/lib/sepa";
import { SEPA_MANDAT_TEXT } from "@/content/legal";
import { postForm, honeypotProps } from "@/lib/forms/submit";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type Values = MembershipWizardInput;

/** Pflicht-/relevante Felder je Schritt (für die schrittweise Validierung). */
const STEP_FIELDS: FieldPath<Values>[][] = [
  ["vorname", "nachname", "strasse", "plzOrt", "telefonMobil", "emailGeschaeftlich", "emailPrivat", "website"],
  ["unternehmen", "rechtsform", "unternehmensanschrift", "plzOrtUnternehmen", "branche", "fachgebiet", "erwerb", "unternehmensgroesse", "kurzbeschreibung", "kurzpraesentation"],
  ["istVertretungsberechtigt", "vbVorname", "vbNachname", "vbFunktion", "vbTelefon", "vbEmail"],
  ["zahlungsintervall", "starttermin"],
  ["zahlungsmethode", "kontoinhaber", "iban", "sepaMandat"],
  [],
  [],
  ["agbAkzeptiert", "datenschutzAkzeptiert", "unternehmerBestaetigung"],
  [],
];

const TOTAL = 9;

export function MembershipWizard() {
  const t = useTranslations("antrag");
  const tf = useTranslations("antrag.fields");
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<Values, unknown, MembershipWizardData>({
    resolver: zodResolver(membershipWizardSchema),
    mode: "onTouched",
    defaultValues: {
      vorname: "", nachname: "", titelFunktion: "", geburtsdatum: "",
      strasse: "", plzOrt: "", telefonMobil: "", telefonBuero: "",
      emailPrivat: "", emailGeschaeftlich: "", website: "",
      unternehmen: "", rechtsform: "", registernummer: "",
      unternehmensanschrift: "", plzOrtUnternehmen: "", branche: "", fachgebiet: "",
      erwerb: "haupterwerb", unternehmensgroesse: "1",
      kurzbeschreibung: "", kurzpraesentation: "",
      istVertretungsberechtigt: "ja",
      vbVorname: "", vbNachname: "", vbFunktion: "", vbTelefon: "", vbEmail: "",
      zahlungsintervall: "monatlich", starttermin: "", empfohlenVon: "",
      zahlungsmethode: "ueberweisung",
      kontoinhaber: "", iban: "", bic: "", bank: "", sepaMandat: false,
      profiltext: "", referenzen: "", kommunikation: [],
      agbAkzeptiert: false, datenschutzAkzeptiert: false,
      fotoEinverstaendnis: false, unternehmerBestaetigung: false,
      hp: "",
    },
  });

  const { register, handleSubmit, trigger, watch, getValues, formState: { errors, isSubmitting } } = form;

  const vbNein = watch("istVertretungsberechtigt") === "nein";
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
    setStatus("error");
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-smaragd/40 bg-white p-8 text-center">
        <h2 className="font-serif text-2xl font-semibold text-koenigsblau">{t("erfolgTitel")}</h2>
        <p className="mt-4 font-sans text-lg text-tinte/85">{t("erfolgText")}</p>
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

      {/* Schritt 1 */}
      {step === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField name="vorname" label={tf("vorname")} required form={form} />
          <TextField name="nachname" label={tf("nachname")} required form={form} />
          <TextField name="titelFunktion" label={tf("titelFunktion")} form={form} />
          <TextField name="geburtsdatum" label={tf("geburtsdatum")} type="date" form={form} />
          <TextField name="strasse" label={tf("strasse")} required form={form} />
          <TextField name="plzOrt" label={tf("plzOrt")} required form={form} />
          <TextField name="telefonMobil" label={tf("telefonMobil")} type="tel" required form={form} />
          <TextField name="telefonBuero" label={tf("telefonBuero")} type="tel" form={form} />
          <TextField name="emailPrivat" label={tf("emailPrivat")} type="email" form={form} />
          <TextField name="emailGeschaeftlich" label={tf("emailGeschaeftlich")} type="email" required form={form} />
          <TextField name="website" label={tf("website")} type="url" form={form} />
        </div>
      ) : null}

      {/* Schritt 2 */}
      {step === 1 ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="unternehmen" label={tf("unternehmen")} required form={form} />
            <TextField name="rechtsform" label={tf("rechtsform")} required form={form} />
            <TextField name="registernummer" label={tf("registernummer")} form={form} />
            <TextField name="unternehmensanschrift" label={tf("unternehmensanschrift")} required form={form} />
            <TextField name="plzOrtUnternehmen" label={tf("plzOrtUnternehmen")} required form={form} />
            <TextField name="branche" label={tf("branche")} required form={form} />
            <TextField name="fachgebiet" label={tf("fachgebiet")} required form={form} />
          </div>

          <RadioGroup
            name="erwerb"
            label={tf("erwerb")}
            form={form}
            options={(["haupterwerb", "nebenerwerb"] as const).map((v) => ({ value: v, label: t(`erwerbOpt.${v}`) }))}
          />

          <Field label={tf("unternehmensgroesse")} htmlFor="mw-groesse" required error={errors.unternehmensgroesse?.message}>
            <Select id="mw-groesse" {...register("unternehmensgroesse")}>
              {UNTERNEHMENSGROESSEN.map((g) => (
                <option key={g} value={g}>{t(`groessen.${g}`)}</option>
              ))}
            </Select>
          </Field>

          <Field label={tf("kurzbeschreibung")} htmlFor="mw-kurzb" required hint="min. 100 Zeichen" error={errors.kurzbeschreibung?.message}>
            <Textarea id="mw-kurzb" {...register("kurzbeschreibung")} />
          </Field>
          <Field label={tf("kurzpraesentation")} htmlFor="mw-kurzp" required hint="min. 200 Zeichen" error={errors.kurzpraesentation?.message}>
            <Textarea id="mw-kurzp" {...register("kurzpraesentation")} />
          </Field>
        </div>
      ) : null}

      {/* Schritt 3 */}
      {step === 2 ? (
        <div className="flex flex-col gap-6">
          <RadioGroup
            name="istVertretungsberechtigt"
            label={tf("istVertretungsberechtigt")}
            form={form}
            options={[
              { value: "ja", label: t("ja") },
              { value: "nein", label: t("nein") },
            ]}
          />
          {vbNein ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField name="vbVorname" label={tf("vbVorname")} required form={form} />
              <TextField name="vbNachname" label={tf("vbNachname")} required form={form} />
              <TextField name="vbFunktion" label={tf("vbFunktion")} required form={form} />
              <TextField name="vbTelefon" label={tf("vbTelefon")} type="tel" required form={form} />
              <TextField name="vbEmail" label={tf("vbEmail")} type="email" required form={form} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Schritt 4 */}
      {step === 3 ? (
        <div className="flex flex-col gap-6">
          <p className="rounded-md border border-koenigsblau/20 bg-champagner/50 p-4 font-sans text-sm text-tinte/90">
            {t("laufzeitInfo")}
          </p>
          <RadioGroup
            name="zahlungsintervall"
            label={tf("zahlungsintervall")}
            form={form}
            options={ZAHLUNGSINTERVALLE.map((i) => ({
              value: i.value,
              label: `${t(`intervalle.${i.value}`)} · ${i.betrag}`,
            }))}
          />
          <p className="font-sans text-sm text-tinte/70">{t("aufnahmegebuehr")}</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="starttermin" label={tf("starttermin")} type="date" required form={form} />
            <TextField name="empfohlenVon" label={tf("empfohlenVon")} form={form} />
          </div>
        </div>
      ) : null}

      {/* Schritt 5 */}
      {step === 4 ? (
        <div className="flex flex-col gap-6">
          <fieldset>
            <legend className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-koenigsblau">
              {tf("zahlungsmethode")}<span className="text-smaragd"> *</span>
            </legend>
            <div className="mt-3 flex flex-col gap-3">
              <label className={`flex items-center gap-3 font-sans text-base ${SEPA_ENABLED ? "text-tinte" : "text-tinte/40"}`} title={!SEPA_ENABLED ? t("sepaBald") : undefined}>
                <input type="radio" value="sepa" disabled={!SEPA_ENABLED} {...register("zahlungsmethode")} className="size-5" />
                <span>{t("methoden.sepa")}</span>
                {!SEPA_ENABLED ? (
                  <span className="rounded-full border border-gold/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gold">
                    {t("sepaBald")}
                  </span>
                ) : null}
              </label>
              <label className="flex items-center gap-3 font-sans text-base text-tinte">
                <input type="radio" value="ueberweisung" {...register("zahlungsmethode")} className="size-5" />
                <span>{t("methoden.ueberweisung")}</span>
              </label>
            </div>
            {errors.zahlungsmethode ? (
              <p role="alert" className="mt-1 font-sans text-sm text-smaragd">{errors.zahlungsmethode.message}</p>
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
              <label className="flex items-start gap-3 font-sans text-sm text-tinte">
                <input type="checkbox" {...register("sepaMandat")} className="mt-1 size-5 shrink-0" />
                <span>{t("sepaMandatCheckbox")}</span>
              </label>
              {errors.sepaMandat ? (
                <p role="alert" className="font-sans text-sm text-smaragd">{errors.sepaMandat.message}</p>
              ) : null}
            </div>
          ) : (
            <p className="rounded-md border border-koenigsblau/20 bg-champagner/50 p-4 font-sans text-sm text-tinte/90">
              {t("ueberweisungInfo")}
            </p>
          )}
        </div>
      ) : null}

      {/* Schritt 6 */}
      {step === 5 ? (
        <div className="flex flex-col gap-6">
          <Field label={tf("profiltext")} htmlFor="mw-profil">
            <Textarea id="mw-profil" rows={3} {...register("profiltext")} />
          </Field>
          <Field label={tf("referenzen")} htmlFor="mw-ref">
            <Textarea id="mw-ref" rows={3} {...register("referenzen")} />
          </Field>
          <fieldset>
            <legend className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-koenigsblau">{tf("kommunikation")}</legend>
            <div className="mt-3 flex flex-wrap gap-4">
              {KOMMUNIKATIONSKANAELE.map((k) => (
                <label key={k} className="flex items-center gap-2 font-sans text-base text-tinte">
                  <input type="checkbox" value={k} {...register("kommunikation")} className="size-5" />
                  <span>{t(`kanaele.${k}`)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      ) : null}

      {/* Schritt 7 – FAQs */}
      {step === 6 ? (
        <div>
          <h3 className="font-serif text-xl font-semibold text-koenigsblau">{t("faqTitel")}</h3>
          <Accordion.Root type="single" collapsible className="mt-4 flex flex-col">
            {(t.raw("faq.items") as { frage: string; antwort: string }[]).map((item, i) => (
              <Accordion.Item key={i} value={`faq-${i}`} className="border-b border-gold/30">
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-center justify-between gap-4 py-4 text-left font-sans text-base font-semibold text-koenigsblau">
                    {item.frage}
                    <span aria-hidden="true" className="inline-block h-2 w-2 rotate-45 border-b border-r border-gold" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="pb-4 font-sans text-base leading-relaxed text-tinte/85">
                  {item.antwort}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      ) : null}

      {/* Schritt 8 – Einverständnisse */}
      {step === 7 ? (
        <div className="flex flex-col gap-4">
          <Checkbox name="agbAkzeptiert" form={form}>
            {t("einverstaendnis.agb")}{" "}
            <Link href="/agb" target="_blank" className="text-koenigsblau underline decoration-gold underline-offset-2">
              ({t("agbLink")})
            </Link>
          </Checkbox>
          <Checkbox name="datenschutzAkzeptiert" form={form}>
            {t("einverstaendnis.datenschutz")}{" "}
            <Link href="/datenschutz" target="_blank" className="text-koenigsblau underline decoration-gold underline-offset-2">
              ({t("datenschutzLink")})
            </Link>
          </Checkbox>
          <Checkbox name="fotoEinverstaendnis" form={form}>
            {t("einverstaendnis.foto")}
          </Checkbox>
          <Checkbox name="unternehmerBestaetigung" form={form}>
            {t("einverstaendnis.unternehmer")}
          </Checkbox>
        </div>
      ) : null}

      {/* Schritt 9 – Review */}
      {step === 8 ? (
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-xl font-semibold text-koenigsblau">{t("reviewTitel")}</h3>
          <dl className="grid gap-x-6 gap-y-2 rounded-md border border-koenigsblau/20 bg-champagner/40 p-5 sm:grid-cols-2">
            {reviewRows(getValues(), tf).map(([label, value]) => (
              <div key={label} className="flex flex-col">
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-tinte/60">{label}</dt>
                <dd className="font-sans text-sm text-tinte/90">{value || "–"}</dd>
              </div>
            ))}
          </dl>
          {status === "error" ? (
            <p role="alert" className="font-sans text-base text-smaragd">{t("fehler")}</p>
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

function TextField({
  name, label, type = "text", required, form,
}: {
  name: FieldPath<Values>;
  label: string;
  type?: string;
  required?: boolean;
  form: FormType;
}) {
  const error = form.getFieldState(name, form.formState).error?.message;
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
  const error = form.getFieldState(name, form.formState).error?.message;
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
  name, form, children,
}: {
  name: FieldPath<Values>;
  form: FormType;
  children: React.ReactNode;
}) {
  const error = form.getFieldState(name, form.formState).error?.message;
  return (
    <div>
      <label className="flex items-start gap-3 font-sans text-sm leading-relaxed text-tinte">
        <input type="checkbox" {...form.register(name)} className="mt-1 size-5 shrink-0" />
        <span>{children}</span>
      </label>
      {error ? <p role="alert" className="mt-1 pl-8 font-sans text-sm text-smaragd">{error}</p> : null}
    </div>
  );
}

/** Zusammenfassung für den Review-Schritt. */
function reviewRows(
  v: Values,
  tf: (k: string) => string,
): [string, string][] {
  return [
    [tf("vorname"), `${v.vorname} ${v.nachname}`],
    [tf("emailGeschaeftlich"), v.emailGeschaeftlich],
    [tf("telefonMobil"), v.telefonMobil],
    [tf("unternehmen"), v.unternehmen],
    [tf("branche"), v.branche],
    [tf("fachgebiet"), v.fachgebiet],
    [tf("zahlungsintervall"), v.zahlungsintervall],
    [tf("zahlungsmethode"), v.zahlungsmethode],
    [tf("starttermin"), v.starttermin ?? ""],
  ];
}
