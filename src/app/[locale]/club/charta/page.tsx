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
  const t = await getTranslations({ locale, namespace: "club.charta" });
  return { title: t("titel") };
}

export default async function ChartaPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("club.charta");

  const punkte = t.raw("punkte") as string[];

  return (
    <>
      <ImageOverlay
        src="/images/muenster-dom.jpg"
        alt="St.-Paulus-Dom über den Dächern von Münster"
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

          <ol className="mt-10 flex flex-col">
            {punkte.map((punkt, index) => (
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
