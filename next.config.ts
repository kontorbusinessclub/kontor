import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Aufgabe 10: Die ehemaligen Einzelrouten bleiben als permanente Redirects
 * (308) auf die neuen Anker-URLs bestehen, damit Backlinks nicht brechen.
 * Da next-intl das Locale-Prefixing per Middleware übernimmt (kein Next-i18n),
 * decken wir sowohl den Default-Pfad (de, ohne Prefix) als auch /en ab.
 */
const legacyRoutes: Record<string, string> = {
  "/club/clubleben": "/club#clubleben",
  "/club/philosophie": "/club#philosophie",
  "/club/charta": "/club#charta",
  "/events/business-events": "/events#business-events",
  "/events/social-events": "/events#social-events",
  "/events/eventkalender": "/events#kalender",
  "/mitgliedschaft/vorteile": "/mitgliedschaft#vorteile",
  "/kontakt/beratung": "/kontakt#beratung",
  "/kontakt/formular": "/kontakt#formular",
};

const nextConfig: NextConfig = {
  // .com -> .de Redirect wird auf Domain-/Vercel-Ebene gesetzt (canonical: .de).
  async redirects() {
    return Object.entries(legacyRoutes).flatMap(([source, destination]) => [
      { source, destination, permanent: true },
      {
        source: `/en${source}`,
        destination: `/en${destination}`,
        permanent: true,
      },
    ]);
  },
};

export default withNextIntl(nextConfig);
