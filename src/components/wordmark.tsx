import { cn } from "@/lib/utils";

type WordmarkProps = {
  /** "dark" = auf hellem Grund (Header), "light" = auf koenigsblau (Footer). */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Wortmarke „KONTOR / Business Club" (Iteration 2, § 3).
 *
 * Zweizeilig, mittig zentriert: „Kontor" oberhalb von „Business Club".
 * Ohne Goldlinie dazwischen, mit reduziertem Zeilenabstand. Lora 600,
 * Versalien, Letter-Spacing .12em. In Header und Footer identisch.
 */
export function Wordmark({ tone = "dark", className }: WordmarkProps) {
  const text = tone === "light" ? "text-champagner" : "text-koenigsblau";

  return (
    <span
      className={cn(
        "flex flex-col items-center gap-2 text-center font-serif font-semibold uppercase leading-none tracking-[0.12em]",
        text,
        className,
      )}
    >
      <span className="text-[22px]">Kontor</span>
      <span className="text-[13px]">Business Club</span>
    </span>
  );
}
