import { getTranslations } from "next-intl/server";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { GoldRule } from "@/components/ui/gold-rule";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/**
 * Abschließender Kontakt-Call-to-Action als atmosphärisches Bild-Band:
 * Münster-Promenade mit Königsblau-Schleier, Champagner-Text darüber.
 */
export async function KontaktCta() {
  const t = await getTranslations("home");

  return (
    <ImageOverlay
      src="/images/muenster-promenade.jpg"
      alt="Promenade in Münster"
      overlay="strong"
      heightClassName="min-h-[46vh]"
      contentClassName="items-center text-center"
    >
      <Reveal className="flex flex-col items-center">
        <h2 className="max-w-xl font-serif text-3xl font-semibold leading-tight text-champagner sm:text-4xl [text-shadow:0_2px_18px_rgba(20,24,31,0.4)]">
          {t("kontaktCta.titel")}
        </h2>

        <GoldRule diamonds className="mt-6" />

        <p className="mx-auto mt-6 max-w-xl font-sans text-lg font-light leading-relaxed text-champagner/90">
          {t("kontaktCta.text")}
        </p>

        <div className="mt-9">
          <Button
            variant="gold"
            href="/kontakt/formular"
            className="bg-champagner text-koenigsblau shadow-lg hover:bg-gold hover:text-koenigsblau focus-visible:ring-offset-koenigsblau"
          >
            {t("kontaktCta.cta")}
          </Button>
        </div>
      </Reveal>
    </ImageOverlay>
  );
}
