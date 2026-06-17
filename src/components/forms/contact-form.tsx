"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { contactSchema, type ContactInput } from "@/lib/forms/schemas";
import { postForm, honeypotProps, submitErrorKey } from "@/lib/forms/submit";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type Status = "idle" | "success" | "error";

/**
 * Kontaktformular (Iteration 5 § 6): Anrede, Titel, Vor-/Nachname,
 * optionaler Unternehmensblock, E-Mail (Pflicht), Telefon (optional),
 * Nachricht. Versand über /api/contact (Honeypot/Rate-Limit unverändert).
 */
export function ContactForm() {
  const t = useTranslations("common.form");
  const tcta = useTranslations("common.cta");
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState("fehler");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      anrede: "herr",
      titel: "",
      vorname: "",
      name: "",
      unternehmensname: "",
      position: "",
      email: "",
      telefon: "",
      nachricht: "",
      hp: "",
    },
  });

  async function onSubmit(values: ContactInput) {
    setStatus("idle");
    const result = await postForm("/api/contact", values);

    if (result.ok) {
      setStatus("success");
      reset();
      return;
    }

    setErrorKey(submitErrorKey(result.reason));
    setStatus("error");
    if (result.errors) {
      for (const [field, messages] of Object.entries(result.errors)) {
        if (field === "_form") continue;
        setError(field as keyof ContactInput, {
          type: "server",
          message: messages[0],
        });
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      <input {...honeypotProps} {...register("hp")} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label={t("anrede")} htmlFor="ct-anrede" required error={errors.anrede?.message}>
          <Select
            id="ct-anrede"
            invalid={Boolean(errors.anrede)}
            {...register("anrede")}
          >
            <option value="herr">{t("anredeHerr")}</option>
            <option value="frau">{t("anredeFrau")}</option>
          </Select>
        </Field>

        <Field label={t("titel")} htmlFor="ct-titel" error={errors.titel?.message}>
          <Input id="ct-titel" type="text" {...register("titel")} />
        </Field>

        <Field label={t("vorname")} htmlFor="ct-vorname" required error={errors.vorname?.message}>
          <Input
            id="ct-vorname"
            type="text"
            autoComplete="given-name"
            invalid={Boolean(errors.vorname)}
            {...register("vorname")}
          />
        </Field>

        <Field label={t("name")} htmlFor="ct-name" required error={errors.name?.message}>
          <Input
            id="ct-name"
            type="text"
            autoComplete="family-name"
            invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </Field>

        <Field label={t("unternehmensname")} htmlFor="ct-unternehmen" required error={errors.unternehmensname?.message}>
          <Input
            id="ct-unternehmen"
            type="text"
            autoComplete="organization"
            invalid={Boolean(errors.unternehmensname)}
            {...register("unternehmensname")}
          />
        </Field>

        <Field label={t("position")} htmlFor="ct-position" required error={errors.position?.message}>
          <Input id="ct-position" type="text" invalid={Boolean(errors.position)} {...register("position")} />
        </Field>

        <Field label={t("email")} htmlFor="ct-email" required error={errors.email?.message}>
          <Input
            id="ct-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>

        <Field label={t("telefon")} htmlFor="ct-telefon" error={errors.telefon?.message}>
          <Input
            id="ct-telefon"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...register("telefon")}
          />
        </Field>
      </div>

      <Field
        label={t("nachricht")}
        htmlFor="ct-nachricht"
        required
        error={errors.nachricht?.message}
      >
        <Textarea
          id="ct-nachricht"
          invalid={Boolean(errors.nachricht)}
          {...register("nachricht")}
        />
      </Field>

      {status === "success" ? (
        <p
          role="status"
          className="rounded-md border border-smaragd/40 bg-white px-4 py-3 font-sans text-base text-smaragd"
        >
          {t("erfolg")}
        </p>
      ) : null}

      {status === "error" ? (
        <p
          role="alert"
          className="rounded-md border border-smaragd/40 bg-white px-4 py-3 font-sans text-base text-smaragd"
        >
          {t(errorKey)}
        </p>
      ) : null}

      <div>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {tcta("absenden")}
        </Button>
      </div>
    </form>
  );
}
