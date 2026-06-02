import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // .com -> .de Redirect wird auf Domain-/Vercel-Ebene gesetzt (canonical: .de).
  // Hinweis: lokale "multiple lockfiles"-Warnung ist kosmetisch (übergeordneter
  // Ordner hat ein Lockfile); auf Vercel ist kontor ein eigenes Repo, dort irrelevant.
};

export default withNextIntl(nextConfig);
