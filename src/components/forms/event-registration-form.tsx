"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import type { z } from "zod";
import {
  eventRegistrationSchema,
  type EventRegistrationInput,
} from "@/lib/forms/schemas";

/**
 * Eingabe-Typ (vor zod-Transform): Checkboxen kommen als String/Boolean
 * aus dem DOM, das Schema coerced sie zum Ausgabe-Typ.
 */
type EventFormValues = z.input<typeof eventRegistrationSchema>;
import { postForm, honeypotProps } from "@/lib/forms/submit";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";

export type EventOption = { id: string; label: string };

type EventRegistrationFormProps = {
  /** Künftige Events als Auswahl (aus der zentralen events-Liste). */
  events: EventOption[];
  /** Vorausgewähltes Event (z.B. via Query-Param ?event= oder Karten-Klick). */
  defaultEventId?: string;
  /** Hinweistext zur Vertreter-Regel (Business Events). */
  vertreterHint: string;
};

type Status = "idle" | "success" | "error";

/**
 * Anmeldeformular für eine Veranstaltung (Aufgabe 12).
 *
 * „Anzahl Gäste" entfällt (12.1). Stattdessen Pflicht-Auswahl der
 * Veranstaltung aus der zentralen events-Liste (12.2), vorausgewählt
 * ist die nächste anstehende bzw. die per ?event= übergebene.
 * Versand über /api/event-registration.
 */
export function EventRegistrationForm({
  events,
  defaultEventId,
  vertreterHint,
}: EventRegistrationFormProps) {
  const t = useTranslations("events.anmeldung");
  const tf = useTranslations("common.form");
  const tc = useTranslations("common.cta");

  const [status, setStatus] = useState<Status>("idle");

  const initialEventId =
    defaultEventId && events.some((e) => e.id === defaultEventId)
      ? defaultEventId
      : (events[0]?.id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues, unknown, EventRegistrationInput>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      name: "",
      firma: "",
      email: "",
      telefon: "",
      nachricht: "",
      eventId: initialEventId,
      vertreter: false,
      istMitglied: false,
      hp: "",
    },
  });

  async function onSubmit(values: EventRegistrationInput) {
    setStatus("idle");
    const result = await postForm("/api/event-registration", values);

    if (result.ok) {
      reset({
        name: "",
        firma: "",
        email: "",
        telefon: "",
        nachricht: "",
        eventId: initialEventId,
        vertreter: false,
        istMitglied: false,
        hp: "",
      });
      setStatus("success");
      return;
    }

    if (result.errors) {
      for (const [key, messages] of Object.entries(result.errors)) {
        if (key === "_form") continue;
        setError(key as keyof EventFormValues, {
          type: "server",
          message: messages?.[0],
        });
      }
    }
    setStatus("error");
  }

  return (
    <div className="mx-auto w-full max-w-[var(--container-text)]">
      <div className="flex flex-col gap-4">
        <Kicker tone="light">{tf("veranstaltung")}</Kicker>
        <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau">
          {t("titel")}
        </h2>
        <p className="font-sans text-lg font-light leading-relaxed text-tinte/85">
          {t("intro")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-10 flex flex-col gap-6"
        aria-describedby={status !== "idle" ? "event-form-status" : undefined}
      >
        <input {...honeypotProps} {...register("hp")} />

        <Field
          label={tf("veranstaltung")}
          htmlFor="event-eventId"
          required
          error={errors.eventId?.message}
        >
          <Select
            id="event-eventId"
            invalid={Boolean(errors.eventId)}
            aria-describedby={errors.eventId ? "event-eventId-error" : undefined}
            {...register("eventId")}
          >
            {events.length === 0 ? (
              <option value="">—</option>
            ) : (
              events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.label}
                </option>
              ))
            )}
          </Select>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={tf("name")}
            htmlFor="event-name"
            required
            error={errors.name?.message}
          >
            <Input
              id="event-name"
              type="text"
              autoComplete="name"
              invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "event-name-error" : undefined}
              {...register("name")}
            />
          </Field>

          <Field
            label={tf("firma")}
            htmlFor="event-firma"
            required
            error={errors.firma?.message}
          >
            <Input
              id="event-firma"
              type="text"
              autoComplete="organization"
              invalid={Boolean(errors.firma)}
              aria-describedby={errors.firma ? "event-firma-error" : undefined}
              {...register("firma")}
            />
          </Field>

          <Field
            label={tf("email")}
            htmlFor="event-email"
            required
            error={errors.email?.message}
          >
            <Input
              id="event-email"
              type="email"
              autoComplete="email"
              invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "event-email-error" : undefined}
              {...register("email")}
            />
          </Field>

          <Field
            label={tf("telefon")}
            htmlFor="event-telefon"
            required
            error={errors.telefon?.message}
          >
            <Input
              id="event-telefon"
              type="tel"
              autoComplete="tel"
              invalid={Boolean(errors.telefon)}
              aria-describedby={errors.telefon ? "event-telefon-error" : undefined}
              {...register("telefon")}
            />
          </Field>
        </div>

        <Field
          label={tf("nachricht")}
          htmlFor="event-nachricht"
          error={errors.nachricht?.message}
        >
          <Textarea
            id="event-nachricht"
            invalid={Boolean(errors.nachricht)}
            aria-describedby={
              errors.nachricht ? "event-nachricht-error" : undefined
            }
            {...register("nachricht")}
          />
        </Field>

        <div className="flex flex-col gap-4 rounded-md border border-koenigsblau/20 bg-white/60 p-5">
          <label
            htmlFor="event-istMitglied"
            className="flex min-h-11 items-center gap-3 font-sans text-base text-tinte"
          >
            <input
              id="event-istMitglied"
              type="checkbox"
              className="size-5 shrink-0 rounded border-koenigsblau/40 text-koenigsblau focus:outline-none focus-visible:ring-2 focus-visible:ring-kontorblau/40"
              {...register("istMitglied")}
            />
            <span>{tf("istMitglied")}</span>
          </label>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="event-vertreter"
              className="flex min-h-11 items-center gap-3 font-sans text-base text-tinte"
            >
              <input
                id="event-vertreter"
                type="checkbox"
                className="size-5 shrink-0 rounded border-koenigsblau/40 text-koenigsblau focus:outline-none focus-visible:ring-2 focus-visible:ring-kontorblau/40"
                aria-describedby="event-vertreter-hint"
                {...register("vertreter")}
              />
              <span>{tf("vertreter")}</span>
            </label>
            <p
              id="event-vertreter-hint"
              className="pl-8 font-sans text-sm text-tinte/70"
            >
              {vertreterHint}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? tc("senden") : tc("anmelden")}
          </Button>

          {status === "success" ? (
            <p
              id="event-form-status"
              role="status"
              className="font-sans text-base text-smaragd"
            >
              {tf("erfolg")}
            </p>
          ) : null}

          {status === "error" ? (
            <p
              id="event-form-status"
              role="alert"
              className="font-sans text-base text-smaragd"
            >
              {tf("fehler")}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
