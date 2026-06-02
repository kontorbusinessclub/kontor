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
 * Eingabe-Typ (vor zod-Transform): anzahlGaeste/Checkboxen kommen als
 * String aus dem DOM. Das Schema coerced sie zum Ausgabe-Typ
 * (EventRegistrationInput) mit number/boolean.
 */
type EventFormValues = z.input<typeof eventRegistrationSchema>;
import { submitEventRegistration } from "@/lib/forms/actions";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";

type EventRegistrationFormProps = {
  /** Name des Events, fuer das angemeldet wird (vorbelegt, nicht editierbar). */
  eventName: string;
};

type Status = "idle" | "success" | "error";

/**
 * Anmeldeformular fuer ein konkretes Event.
 *
 * Telefon ist Pflicht (Rueckruf statt nur Mail). Der eventName wird
 * aussen reingereicht und mit den Formulardaten an die Server Action
 * uebergeben. Sichtbare Texte kommen aus den Uebersetzungen.
 */
export function EventRegistrationForm({ eventName }: EventRegistrationFormProps) {
  const t = useTranslations("events.anmeldung");
  const te = useTranslations("events");
  const tf = useTranslations("common.form");
  const tc = useTranslations("common.cta");

  const [status, setStatus] = useState<Status>("idle");

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
      eventName,
      anzahlGaeste: 0,
      vertreter: false,
      istMitglied: false,
    },
  });

  async function onSubmit(data: EventRegistrationInput) {
    setStatus("idle");
    const result = await submitEventRegistration({ ...data, eventName });

    if (result.ok) {
      reset({
        name: "",
        firma: "",
        email: "",
        telefon: "",
        nachricht: "",
        eventName,
        anzahlGaeste: 0,
        vertreter: false,
        istMitglied: false,
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
        <Kicker tone="light">{eventName}</Kicker>
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
        <input type="hidden" value={eventName} {...register("eventName")} />

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

          <Field
            label={tf("anzahlGaeste")}
            htmlFor="event-gaeste"
            error={errors.anzahlGaeste?.message}
          >
            <Input
              id="event-gaeste"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              invalid={Boolean(errors.anzahlGaeste)}
              aria-describedby={
                errors.anzahlGaeste ? "event-gaeste-error" : undefined
              }
              {...register("anzahlGaeste")}
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
              {te("business.text")}
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
