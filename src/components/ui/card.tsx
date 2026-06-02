import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
};

/**
 * Erhobene Fläche im Champagner-Ton mit feiner Gold-Kontur.
 */
export function Card({ as: Component = "div", className, children }: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-lg border border-gold/30 bg-champagner p-6 sm:p-8",
        className,
      )}
    >
      {children}
    </Component>
  );
}

type CardKickerProps = {
  className?: string;
  children?: ReactNode;
};

/** Mono-Kicker innerhalb einer Card. */
export function CardKicker({ className, children }: CardKickerProps) {
  return (
    <p
      className={cn(
        "font-mono text-xs uppercase tracking-[0.22em] text-gold",
        className,
      )}
    >
      {children}
    </p>
  );
}

type CardTitleProps = {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
};

/** Lora-Titel einer Card in koenigsblau. */
export function CardTitle({
  as: Component = "h3",
  className,
  children,
}: CardTitleProps) {
  return (
    <Component
      className={cn(
        "font-serif text-xl font-semibold leading-snug text-koenigsblau",
        className,
      )}
    >
      {children}
    </Component>
  );
}
