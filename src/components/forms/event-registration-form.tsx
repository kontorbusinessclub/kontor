"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  eventRegistrationSchema,
  type EventRegistrationInput,
} from "@/lib/forms/schemas";
import { postForm, honeypotProps, submitErrorKey } from "@/lib/forms/submit";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";

export type EventOption = { id: string; label: string };

type EventRegistrationFormProps = {
  /** Künftige Events als Auswahl (aus der zentralen events-Liste). */
  events: EventOption[];
  /** Vorausgewähltes Event (z.B. via Query-Param ?event= oder Karten-Klick). */
  defaultEventId?: string;
};

type Status = "idle" | "success" | "error";

const TEILNAHME = ["member", "vertretung", "gast"] as const;

/**
 * Anmeldeformular für eine Veranstaltung (Iteration 6 § 7–§ 9).
 * Teilnahmeart als Radio-Auswahl (Member / Vertretung / Gast); bei
 * „Vertretung" erscheint ein Pflicht-Eingabefeld. Versand über
 * /api/event-registration.
 */
export function EventRegistrationForm({
  events,
  defaultEventId,
}: EventRegistrationFormProps) {
  const t = useTranslations("events.anmeldung");
  const tf = useTranslations("common.form");
  const tc = useTranslations("common.cta");

  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState("fehler");

  const initialEventId =
    defaultEventId && events.some((e) => e.id === defaultEventId)
      ? defaultEventId
      : (events[0]?.id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventRegistrationInput>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      name: "",
      firma: "",
      email: "",
      telefon: "",
      nachricht: "",
      eventId: initialEventId,
      teilnahmeart: "member",
      vertretungFuer: "",
      hp: "",
    },
  });

  const teilnahmeart = watch("teilnahmeart");

  // Konditionales Feld leeren, sobald eine andere Option gewählt wird (§ 9.3).
  useEffect(() => {
    if (teilnahmeart !== "vertretung") setValue("vertretungFuer", "");
  }, [teilnahmeart, setValue]);

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
        teilnahmeart: "member",
        vertretungFuer: "",
        hp: "",
      });
      setStatus("success");
      return;
    }

    if (result.errors) {
      for (const [key, messages] of Object.entries(result.errors)) {
        if (key === "_form") continue;
        setError(key as keyof EventRegistrationInput, {
          type: "server",
          message: messages?.[0],
        });
      }
    }
    setErrorKey(submitErrorKey(result.reason));
    setStatus("error");
  }

  return (
    <div className="mx-auto w-full max-w-[var(--container-text)]">
      <div className="flex flex-col gap-4">
        <Kicker tone="light" className="text-koenigsblau">{t("kicker")}</Kicker>
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
          label={tf("event")}
          htmlFor="event-eventId"
          required
          error={errors.eventId?.message}
        >
          <Select
            id="event-eventId"
            invalid={Boolean(errors.eventId)}
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
          <Field label={tf("name")} htmlFor="event-name" required error={errors.name?.message}>
            <Input
              id="event-name"
              type="text"
              autoComplete="name"
              invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>

          <Field label={tf("unternehmen")} htmlFor="event-firma" required error={errors.firma?.message}>
            <Input
              id="event-firma"
              type="text"
              autoComplete="organization"
              invalid={Boolean(errors.firma)}
              {...register("firma")}
            />
          </Field>

          <Field label={tf("email")} htmlFor="event-email" required error={errors.email?.message}>
            <Input
              id="event-email"
              type="email"
              autoComplete="email"
              invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </Field>

          <Field label={tf("telefon")} htmlFor="event-telefon" required error={errors.telefon?.message}>
            <Input
              id="event-telefon"
              type="tel"
              autoComplete="tel"
              invalid={Boolean(errors.telefon)}
              {...register("telefon")}
            />
          </Field>
        </div>

        <Field
          label={tf("nachricht")}
          htmlFor="event-nachricht"
          required
          error={errors.nachricht?.message}
        >
          <Textarea
            id="event-nachricht"
            invalid={Boolean(errors.nachricht)}
            {...register("nachricht")}
          />
        </Field>

        {/* Teilnahmeart: Radio-Logik im Champagner-Kasten (§ 9) */}
        <fieldset className="flex flex-col gap-4 rounded-md border border-koenigsblau/20 bg-champagner p-5">
          {TEILNAHME.map((opt) => (
            <label
              key={opt}
              className="flex min-h-11 items-center gap-3 font-sans text-base text-tinte"
            >
              <input
                type="radio"
                value={opt}
                {...register("teilnahmeart")}
                className="size-5 shrink-0 border-koenigsblau/40 text-koenigsblau focus:outline-none focus-visible:ring-2 focus-visible:ring-kontorblau/40"
              />
              <span>{t(opt)}</span>
            </label>
          ))}

          {teilnahmeart === "vertretung" ? (
            <Field
              label={t("vertretungLabel")}
              htmlFor="event-vertretungFuer"
              required
              error={errors.vertretungFuer?.message}
            >
              <Input
                id="event-vertretungFuer"
                type="text"
                invalid={Boolean(errors.vertretungFuer)}
                {...register("vertretungFuer")}
              />
            </Field>
          ) : null}
        </fieldset>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? tc("senden") : tc("anmelden")}
          </Button>

          {status === "success" ? (
            <p id="event-form-status" role="status" className="font-sans text-base text-smaragd">
              {tf("erfolg")}
            </p>
          ) : null}

          {status === "error" ? (
            <p id="event-form-status" role="alert" className="font-sans text-base text-smaragd">
              {tf(errorKey)}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
