import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { Card } from "@/components/ui/card";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Reveal } from "@/components/ui/reveal";
import { FeedbackForm } from "@/components/forms/feedback-form";
import { getPastEvents, formatEventOption } from "@/lib/events";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "feedback" });
  return { title: t("titel") };
}

/**
 * Feedback zur Veranstaltung (Aufgabe 12.3). Auswahl aus vergangenen
 * Events; Eingaben werden ausschließlich per E-Mail versendet.
 */
export default async function FeedbackPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("feedback");

  const past = getPastEvents();
  const eventOptions = past.map((event) => ({
    id: event.id,
    label: formatEventOption(event, locale),
  }));

  return (
    <>
      <ImageOverlay
        src="/images/muenster-aasee.jpg"
        alt="Abendstimmung am Aasee in Münster"
        overlay="strong"
        priority
        heightClassName="min-h-[42vh]"
        align="end"
      >
        <Kicker tone="dark">{t("kicker")}</Kicker>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-tight text-champagner sm:text-5xl">
          {t("titel")}
        </h1>
        <GoldRule className="mx-0 mt-6" />
      </ImageOverlay>

      <Section background="pergament">
        <Container variant="text">
          <Reveal>
            <p className="font-sans text-xl font-light leading-relaxed text-tinte/85">
              {t("intro")}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Card className="mt-10">
              <FeedbackForm events={eventOptions} />
            </Card>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
