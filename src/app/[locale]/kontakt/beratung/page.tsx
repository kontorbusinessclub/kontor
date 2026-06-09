import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

/**
 * Kontakt / Beratung.
 * Bild-Buehne plus CTA-Buttons zum Kontaktformular und zum Aufnahmeantrag.
 */
export default async function BeratungPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kontakt.beratung");
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
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Button href="/kontakt/formular" variant="primary">
                {tcta("zumKontakt")}
              </Button>
              <Button href="/mitgliedschaft/antrag" variant="outline">
                {tcta("zumAntrag")}
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
