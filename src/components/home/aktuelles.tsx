import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { Reveal } from "@/components/ui/reveal";

/**
 * Aktuelles-Sektion auf pergament-Fläche. Noch keine echten News,
 * daher ein kurzer Hinweistext als Platzhalter. Sanft eingeblendet.
 */
export async function Aktuelles() {
  const t = await getTranslations("home");

  return (
    <Container variant="text">
      <Reveal className="flex flex-col items-start gap-5">
        <Kicker tone="light">{t("aktuelles.kicker")}</Kicker>

        <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
          {t("aktuelles.titel")}
        </h2>

        <GoldRule diamonds className="mx-0" />

        <p className="font-sans text-lg font-light leading-relaxed text-tinte/85">
          {t("aktuelles.intro")}
        </p>
      </Reveal>
    </Container>
  );
}
