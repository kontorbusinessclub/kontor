import { cn } from "@/lib/utils";

type GoldRuleProps = {
  /** Rauten-Enden an beiden Seiten der Linie anzeigen (Markenfibel-Stil). */
  diamonds?: boolean;
  className?: string;
  /** Aria-Label, falls die Linie semantisch trennt; sonst rein dekorativ. */
  "aria-label"?: string;
};

/**
 * Feine, zentrierte goldene Trennlinie. Optional mit kleinen
 * Rauten-Enden. Rein dekorativ (aria-hidden), sofern kein Label gesetzt ist.
 */
export function GoldRule({ diamonds = false, className, ...aria }: GoldRuleProps) {
  const labelled = Boolean(aria["aria-label"]);

  return (
    <div
      role={labelled ? "separator" : undefined}
      aria-hidden={labelled ? undefined : true}
      className={cn("mx-auto flex w-24 items-center justify-center gap-2", className)}
      {...aria}
    >
      {diamonds ? <Diamond /> : null}
      <span className="h-px flex-1 bg-gold" />
      {diamonds ? <Diamond /> : null}
    </div>
  );
}

function Diamond() {
  return (
    <span className="block size-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
  );
}
