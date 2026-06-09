"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Deutschlandflagge (schwarz-rot-gold), schlichter Vektor ohne Schatten. */
function FlagDE({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 5 3" className={className} aria-hidden="true" role="presentation">
      <rect width="5" height="3" fill="#000" />
      <rect width="5" height="2" y="1" fill="#D00" />
      <rect width="5" height="1" y="2" fill="#FFCE00" />
    </svg>
  );
}

/** Union Jack (Großbritannien), vereinfachter, schattenfreier Vektor. */
function FlagGB({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true" role="presentation">
      <clipPath id="kontor-gb-clip">
        <path d="M0 0v30h60V0z" />
      </clipPath>
      <g clipPath="url(#kontor-gb-clip)">
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

type LocaleDef = {
  code: "de" | "en";
  short: string;
  native: string;
  Flag: (props: { className?: string }) => React.ReactElement;
};

const LOCALES: LocaleDef[] = [
  { code: "de", short: "DE", native: "Deutsch", Flag: FlagDE },
  { code: "en", short: "EN", native: "English", Flag: FlagGB },
];

type LanguageSwitcherProps = {
  /** "dark" = auf hellem Grund (Header), "light" = auf koenigsblau. */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Sprachumschalter als Dropdown mit Flagge (Aufgabe 6).
 *
 * Zeigt nur die aktuell gewählte Sprache (Flagge + Code + Chevron). Beim
 * Öffnen erscheint zuerst die aktuelle, dann die andere Sprache als
 * „Deutsch – DE" / „English – EN". Schließt bei Außenklick und Escape,
 * ist tastaturbedienbar (Pfeil hoch/runter, Enter, Escape).
 * Flaggen sind Inline-SVG (kein Drittanbieter-CDN).
 */
export function LanguageSwitcher({ tone = "dark", className }: LanguageSwitcherProps) {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = LOCALES.find((l) => l.code === activeLocale) ?? LOCALES[0];
  const other = LOCALES.filter((l) => l.code !== activeLocale);
  // Reihenfolge im Dropdown: aktuelle Sprache zuerst, dann die andere.
  const ordered = [current, ...other];

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      // Fokus auf die erste Option, sobald das Dropdown offen ist.
      requestAnimationFrame(() => optionRefs.current[0]?.focus());
    }
  }, [open]);

  function select(code: string) {
    setOpen(false);
    if (code === activeLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: code });
    });
  }

  function onButtonKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onOptionKeyDown(e: React.KeyboardEvent, index: number) {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = (index + 1) % ordered.length;
        optionRefs.current[next]?.focus();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = (index - 1 + ordered.length) % ordered.length;
        optionRefs.current[prev]?.focus();
        break;
      }
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  const chevron = tone === "light" ? "text-champagner" : "text-gold";
  const triggerText = tone === "light" ? "text-champagner" : "text-koenigsblau";

  return (
    <div ref={rootRef} className={cn("relative", isPending && "opacity-60", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Sprache wählen / Choose language"
        disabled={isPending}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKeyDown}
        className={cn(
          "inline-flex min-h-11 items-center gap-2 rounded-sm px-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
          triggerText,
        )}
      >
        <current.Flag className="h-3.5 w-5 shrink-0 rounded-[1px]" />
        <span>{current.short}</span>
        <span
          aria-hidden="true"
          className={cn(
            "inline-block h-1.5 w-1.5 rotate-45 border-b border-r transition-transform",
            chevron,
            open && "-rotate-[135deg]",
          )}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Sprache / Language"
          className="absolute right-0 top-full z-50 mt-2 min-w-[12rem] border border-gold/30 bg-pergament py-1 shadow-xl"
        >
          {ordered.map((locale, index) => {
            const isActive = locale.code === activeLocale;
            return (
              <li key={locale.code} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  lang={locale.code}
                  onClick={() => select(locale.code)}
                  onKeyDown={(e) => onOptionKeyDown(e, index)}
                  className={cn(
                    "flex w-full min-h-11 items-center gap-3 px-4 py-2 text-left font-sans text-sm transition-colors hover:bg-champagner focus-visible:bg-champagner focus-visible:outline-none",
                    isActive ? "text-koenigsblau" : "text-tinte",
                  )}
                >
                  <locale.Flag className="h-3.5 w-5 shrink-0 rounded-[1px]" />
                  <span>
                    {locale.native} <span className="text-tinte/60">– {locale.short}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
