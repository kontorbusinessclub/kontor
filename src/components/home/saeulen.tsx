import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SAEULEN = ["club", "veranstaltungen", "miteinander"] as const;

/**
 * Ziel je Säule für „Mehr erfahren" (Iteration 3 § 5).
 * Unpräfixierte Pfade; der next-intl-Link ergänzt das Locale-Prefix
 * automatisch (z.B. /de/club bzw. /en/club) – daher keine Domain-Hardcodes.
 */
const SAEULEN_HREFS: Record<(typeof SAEULEN)[number], string> = {
  club: "/club",
  veranstaltungen: "/events",
  miteinander: "/club#charta",
};

/**
 * Eigene Markenfarbe je Kasten (Iteration 4 § 2):
 * Der Club = Königsblau, Die Veranstaltungen = Champagner, Das Miteinander = Smaragd.
 */
const SAEULEN_STYLE: Record<
  (typeof SAEULEN)[number],
  { box: string; title: string; text: string; border: string }
> = {
  club: {
    box: "bg-koenigsblau",
    title: "text-champagner",
    text: "text-champagner/85",
    border: "border-champagner/20",
  },
  veranstaltungen: {
    box: "bg-champagner",
    title: "text-koenigsblau",
    text: "text-tinte/85",
    border: "border-koenigsblau/15",
  },
  miteinander: {
    box: "bg-smaragd",
    title: "text-champagner",
    text: "text-champagner/85",
    border: "border-champagner/20",
  },
};

/**
 * Drei Säulen des Kontor als farbige Karten auf pergament-Fläche.
 * Jede Karte schließt mit einem „Mehr erfahren"-CTA in Pergament mit
 * Königsblau-Schrift und -Umrandung (Iteration 4 § 2).
 */
export async function Saeulen() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common.cta");

  return (
    <Container>
      <header className="flex flex-col gap-5">
        <Kicker tone="light" className="text-koenigsblau">{t("saeulen.kicker")}</Kicker>
        <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
          {t("saeulen.titel")}
        </h2>
        <GoldRule className="mx-0" />
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {SAEULEN.map((key, index) => {
          const style = SAEULEN_STYLE[key];
          return (
            <Reveal key={key} delay={index * 120} className="h-full">
              <article
                className={cn(
                  "group relative h-full overflow-hidden rounded-lg border p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none",
                  style.box,
                  style.border,
                )}
              >
                <div className="flex h-full flex-col gap-4">
                  <h3
                    className={cn(
                      "font-serif text-xl font-semibold leading-snug",
                      style.title,
                    )}
                  >
                    {t(`saeulen.${key}.titel`)}
                  </h3>
                  <p className={cn("font-sans text-base leading-relaxed", style.text)}>
                    {t(`saeulen.${key}.text`)}
                  </p>
                  <div className="mt-auto pt-4">
                    <Button
                      href={SAEULEN_HREFS[key]}
                      size="sm"
                      className="border border-koenigsblau bg-pergament text-koenigsblau hover:border-koenigsblau hover:bg-koenigsblau hover:text-champagner"
                    >
                      {tc("mehr")}
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Container>
  );
}
