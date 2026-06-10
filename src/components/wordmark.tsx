import { cn } from "@/lib/utils";

type WordmarkProps = {
  /** "dark" = auf hellem Grund (Header), "light" = auf koenigsblau (Footer). */
  tone?: "dark" | "light";
  /** Größenstufe der Wortmarke. */
  size?: "header" | "footer";
  className?: string;
};

/**
 * Wortmarke „KONTOR / Business Club" (Aufgabe 3).
 *
 * Zweizeilig, mittig zentriert: „Kontor" oberhalb von „Business Club",
 * dazwischen eine feine Goldlinie. Lora 600, Versalien, Letter-Spacing .12em.
 * Identisch in Header und Footer einsetzbar (nur Farbton/Größe variieren).
 */
export function Wordmark({ tone = "dark", size = "header", className }: WordmarkProps) {
  const text = tone === "light" ? "text-champagner" : "text-koenigsblau";
  const top = size === "header" ? "text-[22px]" : "text-[20px]";
  const bottom = size === "header" ? "text-[13px]" : "text-[12px]";

  return (
    <span
      className={cn(
        "flex flex-col items-center text-center font-serif font-semibold uppercase leading-none tracking-[0.12em]",
        text,
        className,
      )}
    >
      <span className={top}>Kontor</span>
      <span aria-hidden="true" className="my-1.5 block h-px w-7 bg-gold" />
      <span className={bottom}>Business Club</span>
    </span>
  );
}
