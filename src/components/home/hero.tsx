import { getTranslations } from "next-intl/server";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { Button } from "@/components/ui/button";

/**
 * Vollflächige Bild-Bühne: Münster bei Abend mit Königsblau-Schleier.
 * Kicker (gold), Wortmarke-Slogan in Lora/Champagner, Lead-Text und
 * zwei klar lesbare Call-to-Actions auf dunklem Grund.
 */
export async function Hero() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  return (
    <ImageOverlay
      src="/images/muenster-hero.jpg"
      alt="Münster bei Abend"
      priority
      overlay="medium"
      heightClassName="min-h-[78vh]"
      contentClassName="items-center text-center"
    >
      <Kicker tone="dark">{t("kicker")}</Kicker>

      <h1 className="mt-6 max-w-4xl font-serif text-[clamp(2.25rem,6vw,3.75rem)] font-semibold leading-tight text-champagner [text-shadow:0_2px_24px_rgba(20,24,31,0.45)]">
        {t("slogan")}
      </h1>

      <GoldRule diamonds className="mt-7" />

      <p className="mx-auto mt-7 max-w-2xl font-sans text-lg font-light leading-relaxed text-champagner/90">
        {t("intro")}
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button
          variant="gold"
          href="/events/eventkalender"
          className="bg-champagner text-koenigsblau shadow-lg hover:bg-gold hover:text-koenigsblau focus-visible:ring-offset-koenigsblau"
        >
          {t("nextEvent.cta")}
        </Button>
        <Button
          variant="outline"
          href="/mitgliedschaft/antrag"
          className="border-champagner text-champagner hover:bg-champagner hover:text-koenigsblau hover:border-champagner focus-visible:ring-offset-koenigsblau"
        >
          {tc("cta.zumAntrag")}
        </Button>
      </div>
    </ImageOverlay>
  );
}
