import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/**
 * Hinweis auf das nächste Event auf champagner-Fläche. Zweispaltig:
 * links das Event (Datum/Ort, CTA), rechts ein Münster-Bild mit
 * Königsblau-Schleier als atmosphärische, gerahmte Bühne.
 */
export async function NextEvent() {
  const t = await getTranslations("home");

  return (
    <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <Reveal className="flex flex-col gap-4">
        <Kicker tone="light">{t("nextEvent.kicker")}</Kicker>

        <h2 className="font-serif text-3xl font-semibold leading-snug text-koenigsblau sm:text-4xl">
          {t("nextEvent.titel")}
        </h2>

        <GoldRule className="mx-0 mt-1" />

        <p className="flex flex-col gap-1 font-mono text-sm uppercase tracking-[0.14em] text-tinte/80 sm:flex-row sm:items-center sm:gap-4">
          <span>{t("nextEvent.datumLabel")}</span>
          <span aria-hidden="true" className="hidden text-gold sm:inline">
            ·
          </span>
          <span>{t("nextEvent.ortLabel")}</span>
        </p>

        <div className="mt-4">
          <Button variant="primary" href="/events/eventkalender">
            {t("nextEvent.cta")}
          </Button>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <ImageOverlay
          src="/images/muenster-rathaus.jpg"
          alt="Historisches Rathaus in Münster"
          overlay="soft"
          heightClassName="min-h-[320px] sm:min-h-[380px]"
          align="end"
          className="rounded-lg border border-gold/30 shadow-xl"
          contentClassName="px-7 py-7"
        >
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-gold">
            {t("nextEvent.ortLabel")}
          </p>
          <p className="mt-2 font-serif text-2xl font-semibold leading-snug text-champagner">
            {t("nextEvent.datumLabel")}
          </p>
        </ImageOverlay>
      </Reveal>
    </Container>
  );
}
