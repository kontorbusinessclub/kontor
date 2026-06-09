import { setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Hero } from "@/components/home/hero";
import { Willkommen } from "@/components/home/willkommen";
import { Saeulen } from "@/components/home/saeulen";
import { EventsPreview } from "@/components/home/events-preview";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { KontaktCta } from "@/components/home/kontakt-cta";

/**
 * Startseite des Kontor Business Club (Reihenfolge gemäß Aufgabe 9):
 * Einspieler (Hero) → Herzlich willkommen → Drei Säulen → Events →
 * Was Mitglieder sagen → FAQs → Passt der Club zu dir?
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />

      <Section background="pergament">
        <Willkommen />
      </Section>

      <Section background="champagner">
        <Saeulen />
      </Section>

      <Section background="pergament">
        <EventsPreview />
      </Section>

      <Section background="koenigsblau">
        <Testimonials />
      </Section>

      <Section background="pergament">
        <Faq />
      </Section>

      <KontaktCta />
    </>
  );
}
