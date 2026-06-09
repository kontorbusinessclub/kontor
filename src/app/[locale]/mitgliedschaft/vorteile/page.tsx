import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Reveal } from "@/components/ui/reveal";

/**
 * Mitgliedschaft / Vorteile.
 * Bild-Buehne plus die Vorteils-Punkte als gold-getrennte Liste,
 * jeder Punkt durchnummeriert mit feiner Gold-Meta. Keine Icons.
 */
export default async function VorteilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("mitgliedschaft.vorteile");
  const punkte = t.raw("punkte") as string[];

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

          <ul className="mt-12 flex flex-col">
            {punkte.map((punkt, index) => (
              <Reveal key={index} delay={index * 70}>
                <li className="flex flex-col">
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
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
