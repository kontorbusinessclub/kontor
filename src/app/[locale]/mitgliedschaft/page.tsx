import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Reveal } from "@/components/ui/reveal";
import { MembershipWizard } from "@/components/forms/membership-wizard";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mitgliedschaft" });
  return { title: t("titel") };
}

/**
 * Reiter „Mitgliedschaft" als EINE Seite mit zwei Anker-Sektionen
 * (Iteration 4 § 8): #vorteile und #mitgliedsantrag (Wizard). Statt des
 * früheren Einleitungstextes steht prominent der Slogan. Alte Einzelrouten
 * (/mitgliedschaft/vorteile, /mitgliedschaft/antrag) leiten per 308 hierher.
 */
export default async function MitgliedschaftPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("mitgliedschaft");
  const tv = await getTranslations("mitgliedschaft.vorteile");
  const ta = await getTranslations("mitgliedschaft.antrag");
  const punkte = tv.raw("punkte") as string[];

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
        <h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-tight text-champagner sm:text-5xl">
          {t("titel")}
        </h1>
        <GoldRule className="mx-0 mt-6" />
      </ImageOverlay>

      {/* Slogan statt Einleitungstext (§ 8.1) */}
      <Section background="pergament">
        <Container variant="text">
          <Reveal className="text-center">
            <p className="font-serif text-2xl font-bold leading-snug text-koenigsblau sm:text-3xl">
              {t("slogan")}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Vorteile */}
      <Section id="vorteile" background="pergament">
        <Container variant="text">
          <Reveal className="flex flex-col gap-5">
            <Kicker tone="light" className="text-koenigsblau">
              {tv("kicker")}
            </Kicker>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
              {tv("titel")}
            </h2>
            <GoldRule className="mx-0" />
            <p className="font-sans text-xl font-light leading-relaxed text-tinte/85">
              {tv("intro")}
            </p>
          </Reveal>

          <ul className="mt-12 flex flex-col">
            {punkte.map((punkt, index) => (
              <li key={index} className="flex flex-col">
                {index > 0 ? <GoldRule className="mx-0 my-6 w-full" /> : null}
                <div className="group flex items-baseline gap-5 transition-colors duration-200 hover:bg-champagner/40">
                  <span
                    className="font-mono text-sm text-smaragd transition-colors duration-200 group-hover:text-gold"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="font-sans text-lg leading-relaxed text-tinte">
                    {punkt}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Mitgliedsantrag (Wizard) */}
      <Section id="mitgliedsantrag" background="pergament">
        <Container variant="text">
          <Reveal className="flex flex-col gap-4">
            <Kicker tone="light" className="text-koenigsblau">
              {ta("kicker")}
            </Kicker>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
              {ta("titel")}
            </h2>
            <GoldRule className="mx-0" />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <MembershipWizard />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
