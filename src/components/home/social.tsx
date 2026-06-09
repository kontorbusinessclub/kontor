import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { GoldRule } from "@/components/ui/gold-rule";
import { Reveal } from "@/components/ui/reveal";

/**
 * Social-Hinweis auf champagner-Fläche. Textlinks zu Instagram/LinkedIn,
 * keine Icons. Externe Links mit target _blank und rel noopener.
 * Sanft eingeblendet.
 */
const KANAELE = [
  { key: "instagram", href: "https://www.instagram.com/" },
  { key: "linkedin", href: "https://www.linkedin.com/" },
] as const;

export async function Social() {
  const t = await getTranslations("home");

  return (
    <Container variant="text">
      <Reveal className="flex flex-col items-start gap-5">
        <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
          {t("social.titel")}
        </h2>

        <GoldRule className="mx-0" />

        <p className="font-sans text-lg font-light leading-relaxed text-tinte/85">
          {t("social.text")}
        </p>

        <ul className="mt-2 flex flex-wrap gap-x-8 gap-y-3 font-sans text-base">
          {KANAELE.map(({ key, href }) => (
            <li key={key}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center font-semibold text-koenigsblau underline decoration-gold decoration-1 underline-offset-4 transition-colors hover:text-kontorblau hover:decoration-kontorblau focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kontorblau focus-visible:ring-offset-2 focus-visible:ring-offset-champagner"
              >
                {t(`social.${key}`)}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Container>
  );
}
