import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type KickerProps = {
  /**
   * "dark" für helle Flächen (Gold-Akzent),
   * "light" für dunkle koenigsblau-Flächen (Smaragd-Akzent).
   */
  tone?: "dark" | "light";
  as?: ElementType;
  className?: string;
  children?: ReactNode;
};

/**
 * Mono-Kicker über Headlines. Kleines, weit gesperrtes Versal-Label.
 */
export function Kicker({
  tone = "dark",
  as: Component = "p",
  className,
  children,
}: KickerProps) {
  return (
    <Component
      className={cn(
        "font-mono text-xs uppercase tracking-[0.22em]",
        tone === "dark" ? "text-gold" : "text-smaragd",
        className,
      )}
    >
      {children}
    </Component>
  );
}
