import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16: "proxy" ersetzt die frühere "middleware"-Konvention.
export default createMiddleware(routing);

export const config = {
  // Alle Pfade außer API, Next-Interna und Dateien mit Endung.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
