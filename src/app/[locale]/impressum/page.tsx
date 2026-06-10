import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ChapterHeader } from "@/components/ui/chapter-header";
import { LegalDocument } from "@/components/legal-document";
import { impressum } from "@/content/legal";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.impressum" });
  return { title: t("titel") };
}

export default async function ImpressumPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.impressum");

  return (
    <Section background="pergament">
      <Container variant="text">
        <ChapterHeader kicker={t("titel")} title={t("titel")} tone="dark" />
        <LegalDocument blocks={impressum} locale={locale} href="/impressum" />
      </Container>
    </Section>
  );
}
