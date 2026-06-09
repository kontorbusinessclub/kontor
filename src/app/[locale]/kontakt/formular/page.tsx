import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { Card } from "@/components/ui/card";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/forms/contact-form";

/**
 * Kontakt / Kontaktformular.
 * Bild-Buehne plus das Kontaktformular in einer Champagner-Karte.
 */
export default async function KontaktFormularPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kontakt.formular");

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
            <Card className="mt-12">
              <ContactForm />
            </Card>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
