import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { Wordmark } from "@/components/wordmark";

/**
 * Sticky Header. Zentrierte Wortmarke "Kontor [Gold-Kreis K] Business Club"
 * (reiner Text/CSS, kein Icon). Darunter Desktop-Nav (hidden lg:flex) aus
 * navItems mit CSS-Dropdowns (group-hover + focus-within) für die Kapitel.
 * Rechts der Sprach-Umschalter, mobil ein Hamburger der die Off-Canvas-Nav öffnet.
 */
export async function SiteHeader() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-gold/30 bg-pergament/95 backdrop-blur">
      <div className="mx-auto max-w-[var(--container-wide)] px-5">
        {/* Obere Zeile: links Spacer, Mitte Wortmarke, rechts Sprache + Hamburger */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-4">
          <div className="hidden lg:block" aria-hidden="true" />

          <Link
            href="/"
            className="flex items-center justify-center transition-colors hover:text-kontorblau focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            aria-label="Kontor Business Club – Startseite"
          >
            <Wordmark tone="dark" size="header" />
          </Link>

          <div className="flex items-center justify-end gap-2">
            <LanguageSwitcher tone="dark" className="hidden sm:block" />
            <MobileNav />
          </div>
        </div>

        {/* Desktop-Navigation mit CSS-Dropdowns */}
        <nav
          aria-label="Hauptnavigation"
          className="hidden justify-center pb-2 lg:flex"
        >
          <ul className="flex items-center gap-8 text-sm uppercase tracking-[0.12em]">
            {navItems.map((item) => {
              const hasChildren = Boolean(item.children?.length);

              return (
                <li key={item.key} className="group relative">
                  <Link
                    href={item.href}
                    aria-haspopup={hasChildren ? "menu" : undefined}
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-koenigsblau transition-colors hover:text-kontorblau focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {t(item.key)}
                    {hasChildren ? (
                      <span
                        aria-hidden="true"
                        className="block h-1.5 w-1.5 rotate-45 border-b border-r border-gold transition-transform group-hover:translate-y-0.5"
                      />
                    ) : null}
                  </Link>

                  {hasChildren ? (
                    <ul
                      role="menu"
                      aria-label={t(item.key)}
                      className="invisible absolute left-1/2 top-full z-50 min-w-[14rem] -translate-x-1/2 translate-y-1 border border-gold/30 bg-pergament py-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                    >
                      {item.children!.map((child) => (
                        <li key={child.key} role="none">
                          <Link
                            href={child.href}
                            role="menuitem"
                            className="block min-h-[44px] px-5 py-2.5 font-sans text-[0.8rem] normal-case tracking-normal text-tinte transition-colors hover:bg-champagner hover:text-koenigsblau focus-visible:bg-champagner focus-visible:text-koenigsblau focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold"
                          >
                            {t("kapitel." + child.key)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
