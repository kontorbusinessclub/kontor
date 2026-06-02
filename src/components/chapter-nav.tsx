"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Kapitel-Navigation (Pills) für die Unterseiten eines Menüpunkts.
 * Zeigt die Geschwister-Kapitel, hebt das aktive hervor. Macht klar:
 * man ist innerhalb eines Bereichs (z.B. "Club"), nicht auf einer Insel.
 * Rendert nichts, wenn es weniger als zwei Kapitel gibt.
 */
export function ChapterNav({ groupKey }: { groupKey: string }) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const group = navItems.find((item) => item.key === groupKey);
  const children = group?.children ?? [];
  if (children.length < 2) return null;

  return (
    <nav aria-label={t(groupKey)} className="border-b border-gold/20 bg-pergament">
      <ul className="mx-auto flex max-w-[var(--container-wide)] flex-wrap gap-2 px-5 py-4">
        {children.map((child) => {
          const active = pathname === child.href;
          return (
            <li key={child.key}>
              <Link
                href={child.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-block min-h-11 rounded-full border px-4 py-2.5 text-xs uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                  active
                    ? "border-koenigsblau bg-koenigsblau text-champagner"
                    : "border-koenigsblau/25 text-koenigsblau hover:border-koenigsblau hover:bg-koenigsblau/5",
                )}
              >
                {t("kapitel." + child.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
