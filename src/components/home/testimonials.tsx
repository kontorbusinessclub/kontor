import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { Reveal } from "@/components/ui/reveal";

type Testimonial = {
  zitat: string;
  name: string;
  rolle: string;
};

/**
 * Mitglieder-Stimmen als Zitatkarten auf koenigsblau-Fläche.
 * Gestaffelt eingeblendet, große Gold-Anführung als CSS-Zeichen
 * (kein Icon). Dezenter Hover.
 */
export async function Testimonials() {
  const t = await getTranslations("home");
  const items = t.raw("testimonials.items") as Testimonial[];

  return (
    <Container className="flex flex-col">
      <header className="flex flex-col gap-5">
        <Kicker tone="dark">{t("testimonials.kicker")}</Kicker>
        <h2 className="font-serif text-3xl font-semibold leading-tight text-champagner sm:text-4xl">
          {t("testimonials.titel")}
        </h2>
        <GoldRule diamonds className="mx-0" />
      </header>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <li key={index} className="h-full">
            <Reveal delay={index * 120} className="h-full">
              <figure className="group relative flex h-full flex-col gap-6 overflow-hidden rounded-lg border border-champagner/20 bg-koenigsblau p-7 pt-12 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-5 top-1 select-none font-serif text-7xl leading-none text-gold/70"
                >
                  &ldquo;
                </span>

                <blockquote className="flex-1 font-serif text-lg font-medium leading-relaxed text-champagner">
                  {item.zitat}
                </blockquote>

                <span className="h-px w-12 bg-gold" aria-hidden="true" />

                <figcaption className="font-mono text-xs uppercase tracking-[0.16em] text-champagner/70">
                  <span className="block text-champagner">{item.name}</span>
                  <span className="mt-1 block">{item.rolle}</span>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </Container>
  );
}
