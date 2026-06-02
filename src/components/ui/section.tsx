import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionBackground = "pergament" | "champagner" | "koenigsblau";

type SectionProps = {
  /**
   * Flächen-Hintergrund. koenigsblau setzt automatisch helle Schrift
   * (text-champagner) für ausreichenden Kontrast.
   */
  background?: SectionBackground;
  id?: string;
  className?: string;
  /** Aria-Label für Sektionen ohne sichtbare Überschrift. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children?: ReactNode;
};

const backgrounds: Record<SectionBackground, string> = {
  pergament: "bg-pergament text-tinte",
  champagner: "bg-champagner text-tinte",
  koenigsblau: "bg-koenigsblau text-champagner",
};

/**
 * Horizontaler Seiten-Abschnitt mit Flächen-Hintergrund und
 * vertikalem Standard-Padding. Kapselt das Hintergrund-System.
 */
export function Section({
  background = "pergament",
  id,
  className,
  children,
  ...aria
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-24",
        backgrounds[background],
        className,
      )}
      {...aria}
    >
      {children}
    </section>
  );
}
