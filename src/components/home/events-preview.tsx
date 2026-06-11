import { getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import { Reveal } from "@/components/ui/reveal";
import { getUpcomingEvents, formatEventDate } from "@/lib/events";
import { EventsCarousel, type EventCard } from "./events-carousel";

/**
 * Events-Vorschau auf der Startseite (Aufgaben 9 & 11): die terminlich
 * nächsten Veranstaltungen als Karten nebeneinander, terminlich nächste
 * zuerst, mit Pfeil-Navigation. Datenquelle ist die zentrale events-Liste.
 */
export async function EventsPreview() {
  const t = await getTranslations("home.events");
  const locale = await getLocale();
  const upcoming = getUpcomingEvents();

  const cards: EventCard[] = upcoming.map((event) => ({
    id: event.id,
    href: `/events?event=${event.id}#kalender`,
    title: event.title,
    dateLabel: formatEventDate(event, locale),
    time: `${event.time} Uhr`,
    location: `${event.location.name}, ${event.location.city}`,
    type: event.type,
    typeLabel: t(`tag.${event.type}`),
    image: event.image,
    imageAlt: `${event.location.name} in ${event.location.city} – Veranstaltungsort des ${event.title}`,
  }));

  return (
    <Container>
      <header className="flex flex-col gap-5">
        <Kicker tone="light" className="text-koenigsblau">{t("kicker")}</Kicker>
        <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
          {t("titel")}
        </h2>
        <GoldRule className="mx-0" />
      </header>

      <Reveal className="mt-10">
        {cards.length > 0 ? (
          <EventsCarousel
            cards={cards}
            labels={{
              anmelden: t("anmelden"),
              prev: t("prev"),
              next: t("next"),
            }}
          />
        ) : (
          <p className="font-sans text-base text-tinte/80">{t("leer")}</p>
        )}
      </Reveal>
    </Container>
  );
}
