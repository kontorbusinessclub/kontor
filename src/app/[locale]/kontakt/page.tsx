import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { Card } from "@/components/ui/card";
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
      {/* Header-Bild ohne Schleier/Filter (Iteration 4 § 9). Festes
          Banner-Format; der Ausschnitt ist nach unten verschoben, sodass er
          unterhalb der goldenen Glocke beginnt (object-position). */}
      <div className="relative min-h-[42vh] w-full overflow-hidden">
        <Image
          src="/images/kontakt-header.png"
          alt="Kontaktbereich Kontor Business Club"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>

      {/* Beratung */}
      <Section id="beratung" background="pergament">
        <Container variant="text">
          <Reveal className="flex flex-col gap-5">
            <h1 className="font-serif text-4xl font-semibold leading-tight text-koenigsblau sm:text-5xl">
              {tb("titel")}
            </h1>
            <GoldRule className="mx-0" />
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
