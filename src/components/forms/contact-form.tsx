"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { contactSchema, type ContactInput } from "@/lib/forms/schemas";
import { postForm, honeypotProps } from "@/lib/forms/submit";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type Status = "idle" | "success" | "error";

/**
 * Kontaktformular. Telefon ist Pflicht (Rueckruf statt nur Mail).
 * Validierung clientseitig via Zod, Absenden ueber die Server Action
 * submitContact.
 */
export function ContactForm() {
  const t = useTranslations("common.form");
  const tcta = useTranslations("common.cta");
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      firma: "",
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
        <Field
          label={t("name")}
          htmlFor="ct-name"
          required
          error={errors.name?.message}
        >
          <Input
            id="ct-name"
            type="text"
            autoComplete="name"
            invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "ct-name-error" : undefined}
            {...register("name")}
          />
        </Field>

        <Field
          label={t("firma")}
          htmlFor="ct-firma"
          required
          error={errors.firma?.message}
        >
          <Input
            id="ct-firma"
            type="text"
            autoComplete="organization"
            invalid={Boolean(errors.firma)}
            aria-describedby={errors.firma ? "ct-firma-error" : undefined}
            {...register("firma")}
          />
        </Field>

        <Field
          label={t("email")}
          htmlFor="ct-email"
          required
          error={errors.email?.message}
        >
          <Input
            id="ct-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "ct-email-error" : undefined}
            {...register("email")}
          />
        </Field>

        <Field
          label={t("telefon")}
          htmlFor="ct-telefon"
          required
          error={errors.telefon?.message}
        >
          <Input
            id="ct-telefon"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            invalid={Boolean(errors.telefon)}
            aria-describedby={errors.telefon ? "ct-telefon-error" : undefined}
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
          aria-describedby={errors.nachricht ? "ct-nachricht-error" : undefined}
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
          {t("fehler")}
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
