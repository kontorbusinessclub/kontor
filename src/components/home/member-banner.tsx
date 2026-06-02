import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";
import styles from "./member-banner.module.css";

/**
 * Platzhalter-Firmen als Text-Wortmarken quer durch die Branchen.
 * Bewusst KEINE Logos/Bilder, bis echte Mitglieder-Logos vorliegen.
 */
const REIHE_1 = [
  "Beispiel Steuerberatung",
  "Muster Bau GmbH",
  "Nordlicht Immobilien",
  "Aurum Catering",
  "Lindgrün Garten",
  "Hansa Logistik",
] as const;

const REIHE_2 = [
  "Klarwerk IT",
  "Westfalen Recht",
  "Atelier Nordwand",
  "Voss Sanitär",
  "Greven Tischlerei",
  "Domhof Versicherung",
] as const;

const REIHE_3 = [
  "Promenade Marketing",
  "Aasee Architekten",
  "Kontor Finanz",
  "Münster Manufaktur",
  "Schiller & Sohn",
  "Bernstein Eventtechnik",
] as const;

const REIHEN = [
  { firmen: REIHE_1, dir: styles.left, speed: styles.slow, delay: styles.d0 },
  { firmen: REIHE_2, dir: styles.right, speed: styles.fast, delay: styles.d1 },
  { firmen: REIHE_3, dir: styles.left, speed: styles.medium, delay: styles.d2 },
] as const;

// Leicht variierende Breiten/Höhen für lebendigen, unregelmäßigen Rhythmus.
const VARIANTEN = [styles.wNarrow, styles.wWide, styles.wMid] as const;
const HEBUNG = [styles.up, styles.down, ""] as const;

/**
 * Drei Reihen durchlaufender Chips in abwechselnde Richtungen, mit
 * unterschiedlichem Tempo und versetztem Start. Chips: Champagner-Fläche,
 * feiner Gold-Rand, Tinte-Text, dezenter Hover.
 * Respektiert prefers-reduced-motion (ruhiges mehrzeiliges Raster).
 */
export async function MemberBanner() {
  const t = await getTranslations("home");

  // Zwei identische Gruppen pro Reihe für nahtlose Endlos-Schleife.
  const groups = [0, 1];

  return (
    <Container className="flex flex-col gap-8">
      <header className="flex flex-col items-center gap-4 text-center">
        <Kicker tone="light">{t("banner.titel")}</Kicker>
        <GoldRule diamonds />
      </header>

      <div className={styles.stage} aria-label={t("banner.titel")}>
        {REIHEN.map((reihe, reiheIndex) => (
          <div key={reiheIndex} className={styles.viewport}>
            <ul
              className={`${styles.track} ${reihe.dir} ${reihe.speed} ${reihe.delay}`}
            >
              {groups.map((group) =>
                reihe.firmen.map((firma, chipIndex) => (
                  <li
                    key={`${group}-${firma}`}
                    aria-hidden={group === 1 ? true : undefined}
                    className={`${styles.chip} ${VARIANTEN[chipIndex % VARIANTEN.length]} ${HEBUNG[chipIndex % HEBUNG.length]}`}
                  >
                    {firma}
                  </li>
                )),
              )}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  );
}
