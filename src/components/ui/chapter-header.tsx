import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Kicker } from "./kicker";
import { GoldRule } from "./gold-rule";

type ChapterHeaderProps = {
  /** Mono-Kicker über der Überschrift. */
  kicker: ReactNode;
  /** Hauptüberschrift der Kapitelseite (H1). */
  title: ReactNode;
  /** Optionaler Lead-Text unter der Überschrift. */
  intro?: ReactNode;
  /** Feine Gold-Trennlinie unter dem Kicker anzeigen. */
  rule?: boolean;
  /** Tonalität passend zum Hintergrund (dark = helle Fläche). */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Kopfbereich einer Kapitelseite: Kicker, H1 (Lora, koenigsblau)
 * und optionaler Lead-Absatz (Source Sans, leicht).
 */
export function ChapterHeader({
  kicker,
  title,
  intro,
  rule = true,
  tone = "dark",
  className,
}: ChapterHeaderProps) {
  const light = tone === "light";

  return (
    <header className={cn("flex flex-col gap-5", className)}>
      <Kicker tone={tone}>{kicker}</Kicker>

      <h1
        className={cn(
          "font-serif text-4xl font-semibold leading-tight sm:text-5xl",
          light ? "text-champagner" : "text-koenigsblau",
        )}
      >
        {title}
      </h1>

      {rule ? <GoldRule className="mx-0" /> : null}

      {intro ? (
        <p
          className={cn(
            "max-w-[var(--container-text)] font-sans text-lg font-light leading-relaxed",
            light ? "text-champagner/85" : "text-tinte/85",
          )}
        >
          {intro}
        </p>
      ) : null}
    </header>
  );
}
