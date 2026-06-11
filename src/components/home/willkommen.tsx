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
  const absaetze = t.raw("absaetze") as string[];

  return (
    <Container variant="text">
      <Reveal className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
          {t("titel")}
        </h2>
        <GoldRule />
        <div className="flex flex-col gap-5">
          {absaetze.map((absatz, index) => (
            <p
              key={index}
              className="font-sans text-lg font-bold leading-relaxed text-tinte/85"
            >
              {absatz}
            </p>
          ))}
        </div>
      </Reveal>
    </Container>
  );
}
