import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { Card, CardKicker, CardTitle } from "@/components/ui/card";
import { GoldRule } from "@/components/ui/gold-rule";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Reveal } from "@/components/ui/reveal";
import { EventRegistrationForm } from "@/components/forms/event-registration-form";

/**
 * Eventkalender.
 * Zeigt das naechste Event prominent (Auftakt 18.06.2026, Muensterland)
 * und darunter das Anmeldeformular. Sind keine weiteren Termine
 * eingetragen, erscheint der Leer-Hinweis.
 */
export default async function EventkalenderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");
  const tn = await getTranslations("home.nextEvent");

  // Konkreter Eventname, der mit der Anmeldung mitgeschickt wird.
  const eventName = `${tn("titel")} ${tn("datumLabel")}`;

  return (
    <>
      <ImageOverlay
        src="/images/muenster-hero.jpg"
        alt="Stimmungsvoller Blick über Münster"
        overlay="strong"
        priority
        heightClassName="min-h-[42vh]"
        align="end"
      >
        <Kicker tone="dark">{t("intro.kicker")}</Kicker>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-tight text-champagner sm:text-5xl">
          {t("kalender.titel")}
        </h1>
        <GoldRule diamonds className="mx-0 mt-6" />
        <p className="mt-6 max-w-2xl font-sans text-lg font-light leading-relaxed text-champagner/85">
          {t("kalender.text")}
        </p>
      </ImageOverlay>

      <Section background="koenigsblau">
        <Container variant="text">
          <Reveal>
            <Card
              as="article"
              className="transition-colors duration-200 hover:border-gold/60"
            >
              <CardKicker>{tn("kicker")}</CardKicker>
              <CardTitle as="h2" className="mt-3">
                {tn("titel")}
              </CardTitle>

              <GoldRule className="mx-0 mt-5" />

              <p className="mt-6 font-mono text-sm uppercase tracking-[0.18em] text-koenigsblau">
                <span>{tn("datumLabel")}</span>
                <span aria-hidden="true" className="px-3 text-gold">
                  /
                </span>
                <span>{tn("ortLabel")}</span>
              </p>
            </Card>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-8 font-sans text-base leading-relaxed text-champagner/80">
              {t("kalender.leerHinweis")}
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section background="pergament" aria-labelledby="event-anmeldung-titel">
        <Container variant="text">
          <span id="event-anmeldung-titel" className="sr-only">
            {t("anmeldung.titel")}
          </span>
          <EventRegistrationForm eventName={eventName} />
        </Container>
      </Section>
    </>
  );
}
