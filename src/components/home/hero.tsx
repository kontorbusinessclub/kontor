import { getTranslations } from "next-intl/server";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Button } from "@/components/ui/button";

/**
 * Vollflächige Bild-Bühne mit Königsblau-Schleier (Iteration 2, § 4).
 * Zwei Textebenen: kleiner Vorlauf „Willkommen im Club" über der großen
 * Hauptzeile. Keine Goldlinie, kein Untertitel, kein Ortskicker.
 */
export async function Hero() {
  const t = await getTranslations("home");

  return (
    <ImageOverlay
      src="/images/muenster-hero.jpg"
      alt="Abendliche Stadtsilhouette"
      priority
      overlay="medium"
      heightClassName="min-h-[78vh]"
      contentClassName="items-center text-center"
    >
      <p className="font-serif text-[clamp(1.05rem,2.4vw,1.6rem)] font-semibold uppercase tracking-[0.2em] text-champagner/90 [text-shadow:0_2px_18px_rgba(20,24,31,0.45)]">
        {t("hero.vorlauf")}
      </p>

      <h1 className="mt-4 max-w-4xl font-serif text-[clamp(2.25rem,6vw,3.75rem)] font-semibold leading-tight text-champagner [text-shadow:0_2px_24px_rgba(20,24,31,0.45)]">
        {t("hero.titel")}
      </h1>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button
          variant="gold"
          href="/events#kalender"
          className="bg-champagner text-koenigsblau shadow-lg hover:bg-gold hover:text-koenigsblau focus-visible:ring-offset-koenigsblau"
        >
          {t("kontaktCta.ctaEvent")}
        </Button>
        <Button
          variant="outline"
          href="/mitgliedschaft/antrag"
          className="border-champagner text-champagner hover:border-champagner hover:bg-champagner hover:text-koenigsblau focus-visible:ring-offset-koenigsblau"
        >
          {t("kontaktCta.ctaMitglied")}
        </Button>
      </div>
    </ImageOverlay>
  );
}
