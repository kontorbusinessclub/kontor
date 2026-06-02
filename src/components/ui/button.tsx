import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "gold";
type ButtonSize = "sm" | "md";

const base =
  "inline-flex items-center justify-center rounded-full font-sans font-semibold uppercase tracking-[0.08em] " +
  "transition-colors duration-200 select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kontorblau focus-visible:ring-offset-2 focus-visible:ring-offset-pergament " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-koenigsblau text-champagner hover:bg-kontorblau border border-transparent",
  outline:
    "border border-koenigsblau text-koenigsblau bg-transparent hover:bg-kontorblau hover:text-champagner hover:border-kontorblau",
  gold: "bg-gold text-koenigsblau hover:bg-kontorblau hover:text-champagner border border-transparent",
};

const sizes: Record<ButtonSize, string> = {
  // Touch-Ziel >= 44px Höhe sichergestellt.
  sm: "min-h-11 px-5 py-2 text-xs",
  md: "min-h-12 px-7 py-3 text-sm",
};

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
};

/** Als interner Link gerendert, wenn `href` gesetzt ist. */
type ButtonAsLink = SharedProps & {
  href: ComponentProps<typeof Link>["href"];
} & Omit<ComponentProps<typeof Link>, "href" | "className">;

/** Als <button> gerendert ohne `href`. */
type ButtonAsButton = SharedProps & {
  href?: undefined;
} & Omit<ComponentProps<"button">, "className">;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * Pill-Button. Mit `href` wird der lokalisierte Link aus
 * "@/i18n/navigation" genutzt, sonst ein natives <button>.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkProps } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
