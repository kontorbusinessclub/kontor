import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Reveal } from "@/components/ui/reveal";
import { EventRegistrationForm } from "@/components/forms/event-registration-form";
import { getUpcomingEvents, formatEventOption, formatEventDate } from "@/lib/events";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ event?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });
  return { title: t("intro.titel") };
}

/**
 * Reiter „Events" als EINE Seite mit Anker-Sektionen (Aufgabe 10):
 * #business-events, #social-events, #kalender (Terminliste + Anmeldung).
 */
export default async function EventsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { event: preselected } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("events");

  const upcoming = getUpcomingEvents();
  const eventOptions = upcoming.map((event) => ({
    id: event.id,
    label: formatEventOption(event, locale),
  }));

  return (
    <>
      <ImageOverlay
        src="/images/muenster-rathaus.jpg"
        alt="Historisches Rathaus von Münster am Abend"
        overlay="strong"
        priority
        heightClassName="min-h-[42vh]"
        align="end"
      >
        <Kicker tone="dark">{t("intro.kicker")}</Kicker>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-tight text-champagner sm:text-5xl">
          {t("intro.titel")}
        </h1>
        <GoldRule className="mx-0 mt-6" />
        <p className="mt-6 max-w-2xl font-sans text-lg font-light leading-relaxed text-champagner/85">
          {t("intro.text")}
        </p>
      </ImageOverlay>

      {/* Business Events */}
      <Section id="business-events" background="pergament">
        <Container variant="text" className="flex flex-col gap-5">
          <Kicker tone="light">{t("intro.kicker")}</Kicker>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
            {t("business.titel")}
          </h2>
          <GoldRule className="mx-0" />
          <p className="font-sans text-lg leading-relaxed text-tinte/90">
            {t("business.text")}
          </p>
        </Container>
      </Section>

      {/* Social Events */}
      <Section id="social-events" background="champagner">
        <Container variant="text" className="flex flex-col gap-5">
          <Kicker tone="light">{t("intro.kicker")}</Kicker>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
            {t("social.titel")}
          </h2>
          <GoldRule className="mx-0" />
          <p className="font-sans text-lg leading-relaxed text-tinte/90">
            {t("social.text")}
          </p>
        </Container>
      </Section>

      {/* Kalender + Anmeldung */}
      <Section id="kalender" background="koenigsblau">
        <Container variant="text">
          <Reveal className="flex flex-col gap-5">
            <Kicker tone="dark">{t("intro.kicker")}</Kicker>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-champagner sm:text-4xl">
              {t("kalender.titel")}
            </h2>
            <GoldRule className="mx-0" />
            <p className="font-sans text-lg font-light leading-relaxed text-champagner/85">
              {t("kalender.text")}
            </p>
          </Reveal>

          {upcoming.length > 0 ? (
            <ul className="mt-8 flex flex-col gap-3">
              {upcoming.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-col gap-1 border-l-2 border-gold pl-4 font-sans text-champagner/90 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="font-mono text-sm uppercase tracking-[0.14em] text-gold">
                    {formatEventDate(event, locale)} · {event.time}
                  </span>
                  <span className="font-serif text-lg text-champagner">
                    {event.title}
                  </span>
                  <span className="font-sans text-sm text-champagner/70">
                    {event.location.name}, {event.location.city}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 font-sans text-base leading-relaxed text-champagner/80">
              {t("kalender.leerHinweis")}
            </p>
          )}
        </Container>
      </Section>

      <Section background="pergament" aria-labelledby="event-anmeldung-titel">
        <Container variant="text">
          <span id="event-anmeldung-titel" className="sr-only">
            {t("anmeldung.titel")}
          </span>
          <EventRegistrationForm
            events={eventOptions}
            defaultEventId={preselected}
            vertreterHint={t("business.text")}
          />
        </Container>
      </Section>
    </>
  );
}
