import { Link } from "@/i18n/navigation";
import { LEGAL_EN_NOTICE, type LegalBlock } from "@/content/legal";

type LegalDocumentProps = {
  blocks: LegalBlock[];
  locale: string;
  /** Routenpfad dieser Seite, für den deutschen Verweis in der EN-Ansicht. */
  href: "/impressum" | "/agb" | "/datenschutz";
  /** Optionale „Stand"-Zeile (AGB). */
  stand?: string;
};

/**
 * Rendert einen Rechtstext. In der EN-Ansicht erscheint statt einer
 * juristischen Vollübersetzung nur ein Verweis auf die maßgebliche
 * deutsche Fassung (Aufgabe 17).
 */
export function LegalDocument({ blocks, locale, href, stand }: LegalDocumentProps) {
  if (locale === "en") {
    return (
      <p className="mt-10 font-sans text-lg leading-relaxed text-tinte/90">
        {LEGAL_EN_NOTICE}{" "}
        <Link
          href={href}
          locale="de"
          className="text-koenigsblau underline decoration-gold underline-offset-4"
        >
          Deutsche Version
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="mt-10 flex flex-col gap-7">
      {stand ? (
        <p className="font-mono text-sm uppercase tracking-[0.14em] text-tinte/60">
          {stand}
        </p>
      ) : null}
      {blocks.map((block, index) => (
        <div key={index} className="flex flex-col gap-2">
          {block.heading ? (
            <h2 className="font-serif text-xl font-semibold text-koenigsblau">
              {block.heading}
            </h2>
          ) : null}
          {block.text ? (
            <p className="whitespace-pre-line font-sans text-base leading-relaxed text-tinte/90">
              {block.text}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
