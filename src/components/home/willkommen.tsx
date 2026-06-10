import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { GoldRule } from "@/components/ui/gold-rule";
import { Reveal } from "@/components/ui/reveal";

/**
 * „Herzlich willkommen"-Text auf der Startseite (Aufgabe 9, Position 2).
 * Ruhiger Einstiegsabsatz unter dem Hero.
 */
export async function Willkommen() {
  const t = await getTranslations("home.willkommen");

  return (
    <Container variant="text">
      <Reveal className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
          {t("titel")}
        </h2>
        <GoldRule />
        <p className="font-sans text-lg font-light leading-relaxed text-tinte/85">
          {t("text")}
        </p>
      </Reveal>
    </Container>
  );
}
