"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  membershipApplicationSchema,
  type MembershipApplicationInput,
} from "@/lib/forms/schemas";
import { postForm, honeypotProps } from "@/lib/forms/submit";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type Status = "idle" | "success" | "error";

/**
 * Mitgliedsantrag-Formular. Telefon ist Pflicht (Rueckruf statt nur Mail),
 * Website optional. Validierung clientseitig via Zod, Absenden ueber die
 * Server Action submitMembershipApplication.
 */
export function MembershipApplicationForm() {
  const t = useTranslations("common.form");
  const tcta = useTranslations("common.cta");
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MembershipApplicationInput>({
    resolver: zodResolver(membershipApplicationSchema),
    defaultValues: {
      name: "",
      firma: "",
      branche: "",
      email: "",
      telefon: "",
      website: "",
      nachricht: "",
      hp: "",
    },
  });

  async function onSubmit(values: MembershipApplicationInput) {
    setStatus("idle");
    const result = await postForm("/api/membership-application", values);

    if (result.ok) {
      setStatus("success");
      reset();
      return;
    }

    setStatus("error");
    if (result.errors) {
      for (const [field, messages] of Object.entries(result.errors)) {
        if (field === "_form") continue;
        setError(field as keyof MembershipApplicationInput, {
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
          htmlFor="ma-name"
          required
          error={errors.name?.message}
        >
          <Input
            id="ma-name"
            type="text"
            autoComplete="name"
            invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "ma-name-error" : undefined}
            {...register("name")}
          />
        </Field>

        <Field
          label={t("firma")}
          htmlFor="ma-firma"
          required
          error={errors.firma?.message}
        >
          <Input
            id="ma-firma"
            type="text"
            autoComplete="organization"
            invalid={Boolean(errors.firma)}
            aria-describedby={errors.firma ? "ma-firma-error" : undefined}
            {...register("firma")}
          />
        </Field>

        <Field
          label={t("branche")}
          htmlFor="ma-branche"
          required
          error={errors.branche?.message}
        >
          <Input
            id="ma-branche"
            type="text"
            invalid={Boolean(errors.branche)}
            aria-describedby={errors.branche ? "ma-branche-error" : undefined}
            {...register("branche")}
          />
        </Field>

        <Field
          label={t("website")}
          htmlFor="ma-website"
          error={errors.website?.message}
        >
          <Input
            id="ma-website"
            type="url"
            inputMode="url"
            placeholder="https://"
            autoComplete="url"
            invalid={Boolean(errors.website)}
            aria-describedby={errors.website ? "ma-website-error" : undefined}
            {...register("website")}
          />
        </Field>

        <Field
          label={t("email")}
          htmlFor="ma-email"
          required
          error={errors.email?.message}
        >
          <Input
            id="ma-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "ma-email-error" : undefined}
            {...register("email")}
          />
        </Field>

        <Field
          label={t("telefon")}
          htmlFor="ma-telefon"
          required
          error={errors.telefon?.message}
        >
          <Input
            id="ma-telefon"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            invalid={Boolean(errors.telefon)}
            aria-describedby={errors.telefon ? "ma-telefon-error" : undefined}
            {...register("telefon")}
          />
        </Field>
      </div>

      <Field
        label={t("nachricht")}
        htmlFor="ma-nachricht"
        required
        error={errors.nachricht?.message}
      >
        <Textarea
          id="ma-nachricht"
          invalid={Boolean(errors.nachricht)}
          aria-describedby={errors.nachricht ? "ma-nachricht-error" : undefined}
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
