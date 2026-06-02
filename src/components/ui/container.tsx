import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  /** "wide" = 1200px Inhaltsbreite, "text" = 800px Lesebreite. */
  variant?: "wide" | "text";
  /** Semantisches Element, Default <div>. */
  as?: ElementType;
  className?: string;
  children?: ReactNode;
};

/**
 * Zentrierter Inhalts-Container mit seitlichem Padding.
 * Begrenzt die Breite auf den passenden Token (wide bzw. text).
 */
export function Container({
  variant = "wide",
  as: Component = "div",
  className,
  children,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-5",
        variant === "wide"
          ? "max-w-[var(--container-wide)]"
          : "max-w-[var(--container-text)]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
