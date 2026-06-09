/**
 * Rechtliche Inhalte (Aufgabe 18). Deutsch ist die maßgebliche Fassung;
 * die englische Ansicht zeigt nur einen Verweis auf die deutsche Version
 * (Aufgabe 17).
 *
 * ⚠️ Vor Live-Schaltung anwaltlich prüfen lassen. Platzhalter in eckigen
 * Klammern (z.B. [Straße und Hausnummer]) trägt der Auftraggeber nach.
 */

export type LegalBlock = { heading?: string; text: string };

/** Englischer Hinweis statt juristischer Vollübersetzung (Aufgabe 17). */
export const LEGAL_EN_NOTICE =
  "The legal notice, terms and conditions, and privacy policy are governed by German law and are available in their authoritative German version only. Please find the German version here:";

// ---------------------------------------------------------------------------
// § 18.1 Impressum (mit § 5 DDG statt § 5 TMG)
// ---------------------------------------------------------------------------
export const impressum: LegalBlock[] = [
  {
    text: "Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz):",
  },
  {
    text: "Kontor Business Club UG (haftungsbeschränkt) i. Gr.\n[Straße und Hausnummer]\n[PLZ und Ort]",
  },
  {
    heading: "Vertreten durch",
    text: "[Name der/des Geschäftsführer/in]",
  },
  {
    heading: "Kontakt",
    text: "Telefon: [Telefonnummer]\nE-Mail: info@kontor-businessclub.com",
  },
  {
    heading: "Registereintrag",
    text: "Eintragung im Handelsregister.\nRegistergericht: [Amtsgericht]\nRegisternummer: [HRB-Nummer]",
  },
  {
    heading: "Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG",
    text: "[USt-IdNr. – sofern bereits erteilt; sonst Zeile entfernen]",
  },
  {
    heading: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
    text: "[Name], [Anschrift wie oben]",
  },
  {
    heading: "EU-Streitschlichtung",
    text: "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/\nUnsere E-Mail-Adresse finden Sie oben im Impressum.",
  },
  {
    heading: "Verbraucher-Streitbeilegung / Universalschlichtungsstelle",
    text: "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
  },
  {
    heading: "Haftung für Inhalte",
    text: "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
  },
  {
    heading: "Haftung für Links",
    text: "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
  },
  {
    heading: "Urheberrecht",
    text: "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.",
  },
];

// ---------------------------------------------------------------------------
// § 18.3 Datenschutzerklärung (DSGVO)
// ---------------------------------------------------------------------------
export const datenschutz: LegalBlock[] = [
  {
    heading: "1. Verantwortlicher",
    text: "Verantwortlich für die Datenverarbeitung auf dieser Website ist der im Impressum genannte Betreiber. Bei Fragen zum Datenschutz erreichen Sie uns unter info@kontor-businessclub.com.",
  },
  {
    heading: "2. Allgemeine Hinweise zur Datenverarbeitung",
    text: "Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. a (Einwilligung), lit. b (Vertrag/Vertragsanbahnung) und lit. f (berechtigtes Interesse) DSGVO.",
  },
  {
    heading: "3. Hosting bei IONOS",
    text: "Wir hosten unsere Website bei der IONOS SE, Elgendorfer Str. 57, 56410 Montabaur (Deutschland). Beim Aufrufen unserer Website werden personenbezogene Daten (z. B. IP-Adresse, Datum, Uhrzeit, abgerufene Inhalte, Browser-Typ) in Server-Logfiles erfasst. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Wir haben mit IONOS einen Vertrag über Auftragsverarbeitung gemäß Art. 28 DSGVO geschlossen.",
  },
  {
    heading: "4. Server-Logfiles",
    text: "Der Provider erhebt und speichert automatisch Informationen in Server-Logfiles, die Ihr Browser automatisch übermittelt (Browsertyp und -version, verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse). Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und dienen der technischen Sicherheit und Stabilität. Sie werden nach kurzer Zeit gelöscht, soweit sie nicht zur Aufklärung eines Sicherheitsvorfalls benötigt werden.",
  },
  {
    heading: "5. Cookies",
    text: "Wir setzen ausschließlich technisch notwendige Cookies ein (z. B. zur Speicherung Ihrer Spracheinstellung, der Sitzung sowie des Status des Cookie-Hinweises). Es werden keine Marketing- oder Tracking-Cookies verwendet. Externe Analyse- oder Marketing-Tools kommen nicht zum Einsatz.",
  },
  {
    heading: "6. Kontakt-, Anmelde-, Mitglieds- und Feedback-Formular",
    text: "Wenn Sie uns über eines unserer Formulare Anfragen zukommen lassen, werden Ihre Angaben aus dem Formular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. lit. f DSGVO (berechtigtes Interesse an der Bearbeitung).\n\nDer Versand der Formulardaten erfolgt über Resend, Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA. Mit Resend besteht ein Vertrag über Auftragsverarbeitung sowie ein gültiger Angemessenheitsbeschluss / Standardvertragsklauseln gemäß Art. 45 / 46 DSGVO.",
  },
  {
    heading: "7. Schriftarten",
    text: "Wir verwenden zur einheitlichen Darstellung von Schriftarten lokale Schriftdateien (Self-Hosting). Eine Verbindung zu Servern von Google Fonts oder anderen Anbietern wird nicht aufgebaut.",
  },
  {
    heading: "8. Rechte der betroffenen Person",
    text: "Sie haben jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch (Art. 21). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO). Ihnen steht zudem ein Beschwerderecht bei einer Aufsichtsbehörde zu (Art. 77 DSGVO).",
  },
  {
    heading: "9. Speicherdauer",
    text: "Wir verarbeiten und speichern Ihre personenbezogenen Daten nur so lange, wie es für die Erfüllung des jeweiligen Zwecks erforderlich ist oder gesetzliche Aufbewahrungsfristen dies vorsehen. Danach werden die Daten gelöscht.",
  },
  {
    heading: "10. SSL-/TLS-Verschlüsselung",
    text: "Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie an „https://“ in der Adresszeile Ihres Browsers.",
  },
  {
    heading: "11. Aktualität",
    text: "Letzte Aktualisierung am [Datum bei Live-Schaltung].",
  },
];

// ---------------------------------------------------------------------------
// § 18.4 SEPA-Lastschriftmandat (für Schritt 5 des Mitgliedsantrags)
// ---------------------------------------------------------------------------
export const SEPA_MANDAT_TEXT = `Ich ermächtige den Kontor Business Club UG (haftungsbeschränkt) i. Gr., Zahlungen für die Mitgliedschaft und Aufnahmegebühr von meinem Konto mittels Lastschrift einzuziehen. Zugleich weise ich mein Kreditinstitut an, die vom Kontor Business Club auf mein Konto gezogenen Lastschriften einzulösen.

Hinweis: Ich kann innerhalb von acht Wochen, beginnend mit dem Belastungsdatum, die Erstattung des belasteten Betrages verlangen. Es gelten dabei die mit meinem Kreditinstitut vereinbarten Bedingungen.

Gläubiger-Identifikationsnummer: [Platzhalter — Beantragung bei der Deutschen Bundesbank steht aus, Nummer wird in Kürze nachgereicht]
Mandatsreferenz: wird separat mitgeteilt`;
