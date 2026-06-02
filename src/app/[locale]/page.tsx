import { setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Hero } from "@/components/home/hero";
import { NextEvent } from "@/components/home/next-event";
import { Saeulen } from "@/components/home/saeulen";
import { MemberBanner } from "@/components/home/member-banner";
import { Aktuelles } from "@/components/home/aktuelles";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { Social } from "@/components/home/social";
import { KontaktCta } from "@/components/home/kontakt-cta";

/**
 * Startseite des Kontor Business Club.
 * Stapelt die Sektionen im Hintergrund-System:
 * Hero -> NextEvent -> Säulen -> Mitglieder-Banner -> Aktuelles ->
 * Testimonials -> FAQ -> Social -> Kontakt-CTA.
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

      <Section background="champagner">
        <NextEvent />
      </Section>

      <Section background="pergament">
        <Saeulen />
      </Section>

      <Section background="champagner">
        <MemberBanner />
      </Section>

      <Section background="pergament">
        <Aktuelles />
      </Section>

      <Section background="koenigsblau">
        <Testimonials />
      </Section>

      <Section background="pergament">
        <Faq />
      </Section>

      <Section background="champagner">
        <Social />
      </Section>

      <KontaktCta />
    </>
  );
}
