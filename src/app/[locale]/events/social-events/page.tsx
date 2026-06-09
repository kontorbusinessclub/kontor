import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

/**
 * Kapitelseite Social Events.
 * Persoenliches Format ohne Agenda. Keine Vertretung: man kommt selbst.
 */
export default async function SocialEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");
  const tc = await getTranslations("common.cta");

  return (
    <>
      <ImageOverlay
        src="/images/muenster-promenade.jpg"
        alt="Baumbestandene Promenade rund um die Altstadt von Münster"
        overlay="strong"
        priority
        heightClassName="min-h-[42vh]"
        align="end"
      >
        <Kicker tone="dark">{t("intro.kicker")}</Kicker>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-tight text-champagner sm:text-5xl">
          {t("social.titel")}
        </h1>
        <GoldRule className="mx-0 mt-6" />
        <p className="mt-6 max-w-2xl font-sans text-lg font-light leading-relaxed text-champagner/85">
          {t("social.text")}
        </p>
      </ImageOverlay>

      <Section background="pergament">
        <Container variant="text" className="flex flex-col gap-8">
          <Reveal>
            <p className="font-sans text-lg font-light leading-relaxed text-tinte/85">
              {t("intro.text")}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <GoldRule className="mx-0" />
          </Reveal>

          <Reveal delay={160}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button href="/events/eventkalender">{tc("anmelden")}</Button>
              <Button href="/events/business-events" variant="outline">
                {tc("mehr")}
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
