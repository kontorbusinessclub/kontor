import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { navItems } from "@/lib/navigation";
import { Wordmark } from "@/components/wordmark";

/**
 * Footer auf koenigsblau. Ausgewogenes Raster: links Markenblock
 * (Wortmarke + Slogan + Adresse), rechts drei aufgeräumte Link-Spalten
 * (Navigation, Rechtliches, Social). Darunter eine dezente Schlusszeile.
 */
export async function SiteFooter() {
  const tf = await getTranslations("footer");
  const tn = await getTranslations("nav");

  const heading =
    "font-mono text-[11px] uppercase tracking-[0.22em] text-gold";
  const link =
    "inline-block text-sm text-champagner/80 transition-colors hover:text-champagner focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

  return (
    <footer className="bg-koenigsblau text-champagner">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
          {/* Markenblock */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              aria-label="Kontor Business Club – Startseite"
            >
              <Wordmark tone="light" />
            </Link>

            <p className="mt-5 font-serif text-lg leading-snug text-champagner">
              {tf("slogan")}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer-Navigation">
            <h2 className={heading}>{tf("headings.navigation")}</h2>
            <ul className="mt-4 space-y-2.5">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className={link}>
                    {tn(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Rechtliches */}
          <div>
            <h2 className={heading}>{tf("headings.rechtliches")}</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/impressum" className={link}>
                  {tf("rechtliches.impressum")}
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className={link}>
                  {tf("rechtliches.datenschutz")}
                </Link>
              </li>
              <li>
                <Link href="/agb" className={link}>
                  {tf("rechtliches.agb")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h2 className={heading}>{tf("socialTitel")}</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Schlusszeile */}
        <div className="mt-14 h-px w-full bg-champagner/15" />
        <div className="mt-6 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
            {tf("copyright")}
          </p>
          <p className="font-serif text-sm text-gold">{tf("claim")}</p>
        </div>
      </Container>
    </footer>
  );
}
