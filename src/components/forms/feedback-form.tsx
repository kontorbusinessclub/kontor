"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import type { z } from "zod";
import { feedbackSchema, type FeedbackInput } from "@/lib/forms/schemas";
import { postForm, honeypotProps } from "@/lib/forms/submit";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

type FeedbackFormValues = z.input<typeof feedbackSchema>;

export type FeedbackEventOption = { id: string; label: string };

type FeedbackFormProps = {
  /** Vergangene Veranstaltungen als Auswahl. */
  events: FeedbackEventOption[];
};

type Status = "idle" | "success" | "error";

/**
 * Feedback-Formular zu vergangenen Veranstaltungen (Aufgabe 12.3).
 * E-Mail ist Pflicht (kein anonymes Feedback). Sterne-Bewertung 1–5.
 * Versand über /api/feedback (keine DB-Speicherung).
 */
export function FeedbackForm({ events }: FeedbackFormProps) {
  const t = useTranslations("feedback");
  const tf = useTranslations("common.form");
  const tcta = useTranslations("common.cta");
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues, unknown, FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      eventId: events[0]?.id ?? "",
      bewertung: 0,
      feedback: "",
      gutGelaufen: "",
      verbessern: "",
      hp: "",
    },
  });

  const bewertung = Number(watch("bewertung")) || 0;

  async function onSubmit(values: FeedbackInput) {
    setStatus("idle");
    const result = await postForm("/api/feedback", values);
    if (result.ok) {
      reset();
      setStatus("success");
      return;
    }
    if (result.errors) {
      for (const [key, messages] of Object.entries(result.errors)) {
        if (key === "_form") continue;
        setError(key as keyof FeedbackFormValues, {
          type: "server",
          message: messages?.[0],
        });
      }
    }
    setStatus("error");
  }

  if (events.length === 0) {
    return (
      <p className="font-sans text-base leading-relaxed text-tinte/80">
        {t("leer")}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      <input {...honeypotProps} {...register("hp")} />

      <Field
        label={tf("veranstaltung")}
        htmlFor="fb-eventId"
        required
        error={errors.eventId?.message}
      >
        <Select
          id="fb-eventId"
          invalid={Boolean(errors.eventId)}
          {...register("eventId")}
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={tf("name")} htmlFor="fb-name" required error={errors.name?.message}>
          <Input
            id="fb-name"
            type="text"
            autoComplete="name"
            invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </Field>
        <Field label={tf("email")} htmlFor="fb-email" required error={errors.email?.message}>
          <Input
            id="fb-email"
            type="email"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>
      </div>

      {/* Sterne-Bewertung */}
      <fieldset>
        <legend className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-koenigsblau">
          {t("bewertung")}
          <span className="text-smaragd" aria-hidden="true">{" *"}</span>
        </legend>
        <div className="mt-2 flex gap-1" role="radiogroup" aria-label={t("bewertung")}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={bewertung === star}
              aria-label={t("sterneLabel", { n: star })}
              onClick={() =>
                setValue("bewertung", star, { shouldValidate: true })
              }
              className="rounded-sm p-1 text-2xl leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <span className={star <= bewertung ? "text-gold" : "text-koenigsblau/25"}>
                ★
              </span>
            </button>
          ))}
        </div>
        <input type="hidden" {...register("bewertung")} />
        {errors.bewertung ? (
          <p role="alert" className="mt-1 font-sans text-sm text-smaragd">
            {errors.bewertung.message}
          </p>
        ) : null}
      </fieldset>

      <Field
        label={t("feedbackLabel")}
        htmlFor="fb-feedback"
        required
        error={errors.feedback?.message}
      >
        <Textarea
          id="fb-feedback"
          invalid={Boolean(errors.feedback)}
          {...register("feedback")}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t("gutGelaufen")} htmlFor="fb-gut" error={errors.gutGelaufen?.message}>
          <Textarea id="fb-gut" rows={3} {...register("gutGelaufen")} />
        </Field>
        <Field label={t("verbessern")} htmlFor="fb-verbessern" error={errors.verbessern?.message}>
          <Textarea id="fb-verbessern" rows={3} {...register("verbessern")} />
        </Field>
      </div>

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
