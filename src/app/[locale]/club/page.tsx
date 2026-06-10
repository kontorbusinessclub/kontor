import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Reveal } from "@/components/ui/reveal";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "club" });
  return { title: t("titel") };
}

/**
 * Reiter „Club" als EINE Seite mit drei Anker-Sektionen (Aufgabe 10):
 * #clubleben, #philosophie, #charta. Smooth-Scroll-Sprünge aus der
 * Header-Navigation; alte Einzelrouten leiten per 308 hierher um.
 */
export default async function ClubPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("club");

  const clublebenAbsaetze = t.raw("clubleben.absaetze") as string[];
  const philosophieAbsaetze = t.raw("philosophie.absaetze") as string[];
  const chartaPunkte = t.raw("charta.punkte") as string[];

  return (
    <>
      <ImageOverlay
        src="/images/muenster-altstadt.jpg"
        alt="Atmosphärische Gasse in der Münsteraner Altstadt"
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
        <p className="mt-6 max-w-2xl font-sans text-lg font-light leading-relaxed text-champagner/85">
          {t("intro")}
        </p>
      </ImageOverlay>

      {/* Clubleben */}
      <Section id="clubleben" background="pergament">
        <Container variant="text">
          <Reveal className="flex flex-col gap-5">
            <Kicker tone="light">{t("clubleben.kicker")}</Kicker>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
              {t("clubleben.titel")}
            </h2>
            <GoldRule className="mx-0" />
            <p className="font-sans text-xl font-light leading-relaxed text-tinte/85">
              {t("clubleben.intro")}
            </p>
          </Reveal>
          <div className="mt-10 flex flex-col gap-6">
            {clublebenAbsaetze.map((absatz, index) => (
              <Reveal key={index} delay={index * 80}>
                <p className="font-sans text-lg leading-relaxed text-tinte/90">
                  {absatz}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Philosophie */}
      <Section id="philosophie" background="champagner">
        <Container variant="text">
          <Reveal className="flex flex-col gap-5">
            <Kicker tone="light">{t("philosophie.kicker")}</Kicker>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
              {t("philosophie.titel")}
            </h2>
            <GoldRule className="mx-0" />
            <p className="font-sans text-xl font-light leading-relaxed text-tinte/85">
              {t("philosophie.intro")}
            </p>
          </Reveal>
          <div className="mt-10 flex flex-col gap-6">
            {philosophieAbsaetze.map((absatz, index) => (
              <Reveal key={index} delay={index * 80}>
                <p className="font-sans text-lg leading-relaxed text-tinte/90">
                  {absatz}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Charta */}
      <Section id="charta" background="pergament">
        <Container variant="text">
          <Reveal className="flex flex-col gap-5">
            <Kicker tone="light">{t("charta.kicker")}</Kicker>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
              {t("charta.titel")}
            </h2>
            <GoldRule className="mx-0" />
            <p className="font-sans text-xl font-light leading-relaxed text-tinte/85">
              {t("charta.intro")}
            </p>
          </Reveal>
          <ol className="mt-10 flex flex-col">
            {chartaPunkte.map((punkt, index) => (
              <Reveal key={index} delay={index * 70}>
                <li className="group flex items-baseline gap-5 border-t border-gold/30 py-5 transition-colors duration-200 hover:bg-champagner/40">
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-sm tracking-[0.18em] text-koenigsblau/60 transition-colors duration-200 group-hover:text-gold"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-lg leading-relaxed text-tinte/90">
                    {punkt}
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  );
}
