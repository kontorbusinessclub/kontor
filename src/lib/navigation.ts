/**
 * Navigations-Datenmodell — EINE Quelle für Desktop + Mobile.
 * Labels kommen aus den Übersetzungen (messages/*.json, Namespace "nav"/"chapters").
 * "Unterseiten" = eigene Routen (Kapitel), die oben laden (kein Anchor-Scroll).
 */
export type NavChild = { key: string; href: string };
export type NavItem = { key: string; href: string; children?: NavChild[] };

export const navItems: NavItem[] = [
  {
    key: "club",
    href: "/club/clubleben",
    children: [
      { key: "clubleben", href: "/club/clubleben" },
      { key: "philosophie", href: "/club/philosophie" },
      { key: "charta", href: "/club/charta" },
    ],
  },
  {
    key: "events",
    href: "/events/eventkalender",
    children: [
      { key: "business", href: "/events/business-events" },
      { key: "social", href: "/events/social-events" },
      { key: "kalender", href: "/events/eventkalender" },
    ],
  },
  {
    key: "members",
    href: "/members",
    children: [{ key: "login", href: "/members" }],
  },
  {
    key: "mitgliedschaft",
    href: "/mitgliedschaft/vorteile",
    children: [
      { key: "vorteile", href: "/mitgliedschaft/vorteile" },
      { key: "antrag", href: "/mitgliedschaft/antrag" },
    ],
  },
  {
    key: "kontakt",
    href: "/kontakt/formular",
    children: [
      { key: "beratung", href: "/kontakt/beratung" },
      { key: "formular", href: "/kontakt/formular" },
    ],
  },
];
