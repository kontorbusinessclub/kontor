import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { Card, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";

const SAEULEN = ["club", "veranstaltungen", "miteinander"] as const;

/**
 * Drei Säulen des Kontor als Karten auf pergament-Fläche.
 * Gestaffelt eingeblendet, mit dezentem Hover (Anheben, Schatten,
 * Gold-Linie oben).
 */
export async function Saeulen() {
  const t = await getTranslations("home");

  return (
    <Container>
      <header className="flex flex-col gap-5">
        <Kicker tone="light">{t("saeulen.kicker")}</Kicker>
        <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
          {t("saeulen.titel")}
        </h2>
        <GoldRule className="mx-0" />
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {SAEULEN.map((key, index) => (
          <Reveal key={key} delay={index * 120} className="h-full">
            <Card
              as="article"
              className="group relative h-full overflow-hidden border-gold/30 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none"
              />
              <div className="flex flex-col gap-4">
                <CardTitle>{t(`saeulen.${key}.titel`)}</CardTitle>
                <p className="font-sans text-base leading-relaxed text-tinte/85">
                  {t(`saeulen.${key}.text`)}
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
