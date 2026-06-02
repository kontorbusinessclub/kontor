"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "@/lib/navigation";

/**
 * Abschluss-Band am Ende einer Kapitelseite: kurze Frage + CTA zum
 * Aufnahmeantrag und ein Link zum nächsten Kapitel des Bereichs.
 * Verhindert die "Sackgasse" am Seitenende.
 */
export function ChapterOutro({ groupKey }: { groupKey: string }) {
  const pathname = usePathname();
  const t = useTranslations("chapterOutro");
  const tc = useTranslations("common");
  const tn = useTranslations("nav");

  const group = navItems.find((item) => item.key === groupKey);
  const children = group?.children ?? [];
  const idx = children.findIndex((c) => c.href === pathname);
  const next =
    idx >= 0 && children.length > 1
      ? children[(idx + 1) % children.length]
      : undefined;

  // Auf der Antragsseite selbst keinen Antrags-CTA (wäre zirkulär).
  const showCta = pathname !== "/mitgliedschaft/antrag";

  return (
    <section className="bg-koenigsblau text-champagner">
      <div className="mx-auto max-w-[var(--container-text)] px-5 py-16 text-center">
        <p className="font-serif text-2xl text-champagner sm:text-3xl">
          {t("frage")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row">
          {showCta ? (
            <Link
              href="/mitgliedschaft/antrag"
              className="inline-flex min-h-11 items-center rounded-full bg-champagner px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-koenigsblau transition-colors hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {tc("cta.zumAntrag")}
            </Link>
          ) : null}
          {next ? (
            <Link
              href={next.href}
              className="group inline-flex min-h-11 items-center gap-2.5 text-sm uppercase tracking-[0.12em] text-champagner/85 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <span>
                {t("weiter")} {tn("kapitel." + next.key)}
              </span>
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 -rotate-45 border-r border-t border-gold transition-transform group-hover:translate-x-1"
              />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
