"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const locales = [
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
] as const;

type LocaleSwitcherProps = {
  /** Farbschema: "dark" = auf hellem Grund (Default), "light" = auf koenigsblau. */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Sprach-Umschalter (DE/EN) als Textlinks. Wechselt die Locale unter
 * Beibehaltung des aktuellen Pfads via router.replace(pathname, {locale}).
 * Die aktive Sprache ist hervorgehoben und trägt aria-current.
 */
export function LocaleSwitcher({ tone = "dark", className }: LocaleSwitcherProps) {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: string) {
    if (locale === activeLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  const idle = tone === "light" ? "text-champagner/60" : "text-tinte/55";
  const active = tone === "light" ? "text-champagner" : "text-koenigsblau";
  const hover =
    tone === "light" ? "hover:text-champagner" : "hover:text-kontorblau";

  return (
    <div
      className={cn(
        "flex items-center gap-1 font-mono text-xs uppercase tracking-[0.14em]",
        isPending && "opacity-60",
        className,
      )}
      role="group"
      aria-label="Sprache wählen / Choose language"
    >
      {locales.map((locale, index) => {
        const isActive = locale.code === activeLocale;
        return (
          <span key={locale.code} className="flex items-center gap-1">
            {index > 0 ? (
              <span aria-hidden="true" className="text-gold/60">
                /
              </span>
            ) : null}
            <button
              type="button"
              lang={locale.code}
              onClick={() => switchTo(locale.code)}
              aria-current={isActive ? "true" : undefined}
              disabled={isPending}
              className={cn(
                "inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                isActive
                  ? cn(active, "border-b border-gold")
                  : cn(idle, hover),
              )}
            >
              {locale.label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
