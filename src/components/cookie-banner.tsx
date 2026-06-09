"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "kontor_cookie_acknowledged";

/**
 * Cookie-Hinweis (Aufgabe 18.5).
 *
 * Da ausschließlich technisch notwendige Cookies eingesetzt werden, reicht
 * ein informierender Hinweis ohne Opt-in (§ 25 Abs. 2 TDDDG). Erscheint
 * einmal beim ersten Besuch, Status wird in localStorage gespeichert.
 * Schmaler Streifen unten: koenigsblau, Champagner-Text, Gold-Button.
 */
export function CookieBanner() {
  const t = useTranslations("cookie");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "true") {
        setVisible(true);
      }
    } catch {
      // localStorage nicht verfügbar – Banner bleibt aus.
    }
  }, []);

  function acknowledge() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("ariaLabel")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/40 bg-koenigsblau text-champagner"
    >
      <div className="mx-auto flex max-w-[var(--container-wide)] flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-sm leading-relaxed text-champagner/90">
          {t("text")}{" "}
          <Link
            href="/datenschutz"
            className="text-champagner underline decoration-gold underline-offset-4 hover:text-gold"
          >
            {t("link")}
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={acknowledge}
          className="shrink-0 self-start rounded-full bg-gold px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-koenigsblau transition-colors hover:bg-champagner focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagner sm:self-auto"
        >
          {t("button")}
        </button>
      </div>
    </div>
  );
}
