"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export type EventCard = {
  id: string;
  href: string;
  title: string;
  dateLabel: string;
  time: string;
  location: string;
  type: "business" | "social";
  typeLabel: string;
  image: string;
  imageAlt: string;
};

type EventsCarouselProps = {
  cards: EventCard[];
  labels: { anmelden: string; prev: string; next: string };
};

/**
 * Horizontal scrollbares Karten-Karussell der nächsten Veranstaltungen
 * (Aufgabe 11). Bis zu drei Karten gleichzeitig sichtbar, die terminlich
 * nächste links. Chevron-Buttons und Pfeiltasten scrollen weiter.
 */
export function EventsCarousel({ cards, labels }: EventsCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);

  function scrollByCards(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const amount = card ? card.clientWidth + 24 : track.clientWidth;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCards(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCards(-1);
    }
  }

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={labels.next}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        {cards.map((card) => (
          <li
            key={card.id}
            className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <Link
              href={card.href}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-gold/30 bg-reinweiss transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold motion-reduce:transform-none"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex h-full flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm uppercase tracking-[0.16em] text-koenigsblau">
                  {card.dateLabel}
                </span>
                <span className="rounded-full border border-smaragd/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-smaragd">
                  {card.typeLabel}
                </span>
              </div>
              <p className="font-mono text-sm text-tinte/70">{card.time}</p>
              <h3 className="font-serif text-2xl font-semibold leading-snug text-koenigsblau">
                {card.title}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-tinte/80">
                {card.location}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 pt-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-koenigsblau">
                {labels.anmelden}
                <span
                  aria-hidden="true"
                  className="inline-block h-2 w-2 -rotate-45 border-r border-t border-gold transition-transform group-hover:translate-x-1"
                />
              </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {cards.length > 1 ? (
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label={labels.prev}
            className="inline-flex size-11 items-center justify-center rounded-full border border-koenigsblau/30 text-koenigsblau transition-colors hover:border-koenigsblau hover:bg-koenigsblau hover:text-champagner focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <span aria-hidden="true" className="block h-2.5 w-2.5 rotate-[135deg] border-r-2 border-t-2 border-current" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label={labels.next}
            className="inline-flex size-11 items-center justify-center rounded-full border border-koenigsblau/30 text-koenigsblau transition-colors hover:border-koenigsblau hover:bg-koenigsblau hover:text-champagner focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <span aria-hidden="true" className="block h-2.5 w-2.5 -rotate-45 border-r-2 border-t-2 border-current" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
