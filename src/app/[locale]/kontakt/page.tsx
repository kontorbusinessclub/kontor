import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { Card } from "@/components/ui/card";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/contact-form";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kontakt.beratung" });
  return { title: t("titel") };
}

/**
 * Reiter „Kontakt" als Seite mit Anker-Sektionen (Aufgabe 10):
 * #beratung (Einstieg + CTAs) und #formular (Kontaktformular).
 */
export default async function KontaktPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tb = await getTranslations("kontakt.beratung");
  const tfm = await getTranslations("kontakt.formular");
  const tcta = await getTranslations("common.cta");

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
        <h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-tight text-champagner sm:text-5xl">
          {tb("titel")}
        </h1>
        <GoldRule className="mx-0 mt-6" />
      </ImageOverlay>

      {/* Beratung */}
      <Section id="beratung" background="pergament">
        <Container variant="text">
          <Reveal>
            <p className="font-sans text-xl font-light leading-relaxed text-tinte/85">
              {tb("intro")}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="/kontakt#formular" variant="primary">
                {tcta("zumKontakt")}
              </Button>
              <Button href="/mitgliedschaft#mitgliedsantrag" variant="outline">
                {tcta("zumAntrag")}
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Kontaktformular */}
      <Section id="formular" background="pergament">
        <Container variant="text">
          <Reveal className="flex flex-col gap-4">
            <Kicker tone="light">{tfm("kicker")}</Kicker>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
              {tfm("titel")}
            </h2>
            <GoldRule className="mx-0" />
            <p className="font-sans text-lg font-light leading-relaxed text-tinte/85">
              {tfm("intro")}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Card className="mt-10">
              <ContactForm />
            </Card>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
