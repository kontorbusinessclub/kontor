/**
 * Zentrale Events-Datenquelle (Aufgabe 14).
 *
 * EINZIGE Wahrheitsquelle für Veranstaltungen. Wird von Homepage-Vorschau,
 * Eventkalender, Anmeldeformular und Feedback-Formular gemeinsam genutzt.
 * Änderungen hier schlagen überall durch.
 *
 * Beschreibungen mit "TODO" werden vom Auftraggeber nachgeliefert (siehe § 14).
 */

export type EventType = "business" | "social";

export type EventLocation = {
  name: string;
  street: string;
  zip: string;
  city: string;
};

export type KontorEvent = {
  id: string;
  slug: string;
  title: string;
  type: EventType;
  /** ISO-Datum YYYY-MM-DD. */
  date: string;
  /** 24h-Zeit HH:mm. */
  time: string;
  location: EventLocation;
  description: string;
  image: string;
};

const PROVINZIAL: EventLocation = {
  name: "Provinzial Versicherung Zentrale",
  street: "Provinzial-Allee 1",
  zip: "48159",
  city: "Münster",
};

export const events: KontorEvent[] = [
  {
    id: "auftakt-2026-06-18",
    slug: "auftaktveranstaltung",
    title: "Auftaktveranstaltung",
    type: "business",
    date: "2026-06-18",
    time: "18:00",
    location: PROVINZIAL,
    description: "TODO – Beschreibung wird nachgeliefert.",
    image: "/images/provinzial-zentrale.avif",
  },
  {
    id: "folge-2026-07-16",
    slug: "folgeveranstaltung-juli",
    title: "Folgeveranstaltung",
    type: "business",
    date: "2026-07-16",
    time: "18:00",
    location: PROVINZIAL,
    description: "TODO – Beschreibung wird nachgeliefert.",
    image: "/images/provinzial-zentrale.avif",
  },
  {
    id: "folge-2026-08-20",
    slug: "folgeveranstaltung-august",
    title: "Folgeveranstaltung",
    type: "business",
    date: "2026-08-20",
    time: "18:00",
    location: PROVINZIAL,
    description: "TODO – Beschreibung wird nachgeliefert.",
    image: "/images/provinzial-zentrale.avif",
  },
];

/** Datum + Zeit eines Events als Date-Objekt (lokale Zeit). */
function eventStart(event: KontorEvent): Date {
  return new Date(`${event.date}T${event.time}:00`);
}

/** Künftige Events, aufsteigend nach Datum sortiert. */
export function getUpcomingEvents(now: Date = new Date()): KontorEvent[] {
  return events
    .filter((event) => eventStart(event) >= now)
    .sort((a, b) => eventStart(a).getTime() - eventStart(b).getTime());
}

/** Vergangene Events, absteigend nach Datum sortiert (jüngstes zuerst). */
export function getPastEvents(now: Date = new Date()): KontorEvent[] {
  return events
    .filter((event) => eventStart(event) < now)
    .sort((a, b) => eventStart(b).getTime() - eventStart(a).getTime());
}

/** Event per id finden. */
export function getEventById(id: string): KontorEvent | undefined {
  return events.find((event) => event.id === id);
}

/**
 * Anzeigeformat für Select-Optionen, z. B.
 * "18.06.2026 · 18:00 Uhr · Auftaktveranstaltung".
 */
export function formatEventOption(event: KontorEvent, locale = "de"): string {
  const [year, month, day] = event.date.split("-");
  if (locale === "en") {
    return `${day}.${month}.${year} · ${event.time} · ${event.title}`;
  }
  return `${day}.${month}.${year} · ${event.time} Uhr · ${event.title}`;
}

/** Datum lokalisiert ausgeben, z. B. "18. Juni 2026" / "18 June 2026". */
export function formatEventDate(event: KontorEvent, locale = "de"): string {
  return eventStart(event).toLocaleDateString(locale === "en" ? "en-GB" : "de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
