import { cn } from "@/lib/utils";

type GoldRuleProps = {
  className?: string;
  /** Aria-Label, falls die Linie semantisch trennt; sonst rein dekorativ. */
  "aria-label"?: string;
};

/**
 * Feine, zentrierte goldene Trennlinie. Einheitliche Maße (Iteration 2 § 6):
 * Höhe 1px, Breite 64px (w-16, innerhalb der Markenfibel-Empfehlung 48–64px).
 * Rein dekorativ (aria-hidden), sofern kein Label gesetzt ist.
 */
export function GoldRule({ className, ...aria }: GoldRuleProps) {
  const labelled = Boolean(aria["aria-label"]);

  return (
    <div
      role={labelled ? "separator" : undefined}
      aria-hidden={labelled ? undefined : true}
      className={cn("mx-auto flex w-16 items-center justify-center", className)}
      {...aria}
    >
      <span className="h-px flex-1 bg-gold" />
    </div>
  );
}
