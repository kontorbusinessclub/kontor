import { cn } from "@/lib/utils";

type GoldRuleProps = {
  className?: string;
  /** Aria-Label, falls die Linie semantisch trennt; sonst rein dekorativ. */
  "aria-label"?: string;
};

/**
 * Feine, zentrierte goldene Trennlinie (Aufgabe 7: ohne Rauten-Enden).
 * Rein dekorativ (aria-hidden), sofern kein Label gesetzt ist.
 */
export function GoldRule({ className, ...aria }: GoldRuleProps) {
  const labelled = Boolean(aria["aria-label"]);

  return (
    <div
      role={labelled ? "separator" : undefined}
      aria-hidden={labelled ? undefined : true}
      className={cn("mx-auto flex w-24 items-center justify-center", className)}
      {...aria}
    >
      <span className="h-px flex-1 bg-gold" />
    </div>
  );
}
