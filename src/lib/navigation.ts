/**
 * Navigations-Datenmodell — EINE Quelle für Desktop + Mobile.
 * Labels kommen aus den Übersetzungen (messages/*.json, Namespace "nav").
 *
 * Aufgabe 10: Pro Reiter gibt es EINE Seite. Die ehemaligen Unterseiten
 * sind jetzt Anker-Sektionen (#anker) auf dieser Seite und werden per
 * Smooth-Scroll angesprungen. Ausnahme: der mehrstufige Mitgliedsantrag
 * bleibt eine eigene Route (/mitgliedschaft#mitgliedsantrag).
 */
export type NavChild = { key: string; href: string };
export type NavItem = { key: string; href: string; children?: NavChild[] };

export const navItems: NavItem[] = [
  {
    key: "club",
    href: "/club",
    children: [
      { key: "clubleben", href: "/club#clubleben" },
      { key: "philosophie", href: "/club#philosophie" },
      { key: "charta", href: "/club#charta" },
    ],
  },
  {
    key: "events",
    href: "/events",
    children: [
      { key: "business", href: "/events#business-events" },
      { key: "social", href: "/events#social-events" },
      { key: "kalender", href: "/events#kalender" },
    ],
  },
  {
    key: "members",
    href: "/members",
    children: [{ key: "login", href: "/members" }],
  },
  {
    key: "mitgliedschaft",
    href: "/mitgliedschaft",
    children: [
      { key: "vorteile", href: "/mitgliedschaft#vorteile" },
      { key: "antrag", href: "/mitgliedschaft#mitgliedsantrag" },
    ],
  },
  {
    key: "kontakt",
    href: "/kontakt",
    children: [
      { key: "beratung", href: "/kontakt#beratung" },
      { key: "formular", href: "/kontakt#formular" },
    ],
  },
];
