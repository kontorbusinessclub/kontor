import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
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
 * #clubleben, #philosophie, #charta. Hero zeigt nur das Bild; Überschrift
 * und Kontor-Einleitungstext stehen in der ersten Sektion darunter
 * (Iteration 5 § 4).
 */
export default async function ClubPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("club");

  const introAbsaetze = t.raw("introAbsaetze") as string[];
  const clublebenAbsaetze = t.raw("clubleben.absaetze") as string[];
  const philosophieAbsaetze = t.raw("philosophie.absaetze") as string[];
  const chartaPunkte = t.raw("charta.punkte") as string[];

  return (
    <>
      {/* Hero: nur Bild, ohne Filter (Iteration 7 § 6) */}
      <div className="relative min-h-[42vh] w-full overflow-hidden">
        <Image
          src="/images/Club_ohne_Wasserzeichen.png"
          alt="Clubbereich Kontor Business Club"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Einleitung „Unser Kontor" + Kontor-Geschichtstext.
          Typografie identisch zum Welcome-Text der Startseite
          (text-lg, font-bold, leading-relaxed, text-tinte/85). */}
      <Section background="pergament" className="pb-10 sm:pb-16">
        <Container variant="text">
          <Reveal className="flex flex-col gap-5">
            <h1 className="font-serif text-4xl font-semibold leading-tight text-koenigsblau sm:text-5xl">
              {t("titel")}
            </h1>
            <GoldRule className="mx-0" />
            {introAbsaetze.map((absatz, index) => (
              <p
                key={index}
                className="font-sans text-lg font-bold leading-relaxed text-tinte/85"
              >
                {absatz}
              </p>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* Clubleben */}
      <Section id="clubleben" background="pergament" className="pt-10 pb-10 sm:pt-16 sm:pb-16">
        <Container variant="text">
          <Reveal className="flex flex-col gap-5">
            <Kicker tone="light" className="text-koenigsblau">{t("clubleben.kicker")}</Kicker>
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
      <Section id="philosophie" background="pergament" className="pt-10 pb-10 sm:pt-16 sm:pb-16">
        <Container variant="text">
          <Reveal className="flex flex-col gap-5">
            <Kicker tone="light" className="text-koenigsblau">{t("philosophie.kicker")}</Kicker>
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
      <Section id="charta" background="pergament" className="pt-10 sm:pt-16">
        <Container variant="text">
          <Reveal className="flex flex-col gap-5">
            <Kicker tone="light" className="text-koenigsblau">{t("charta.kicker")}</Kicker>
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
