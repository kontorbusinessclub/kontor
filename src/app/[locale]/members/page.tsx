import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { GoldRule } from "@/components/ui/gold-rule";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ImageOverlay } from "@/components/ui/image-overlay";
import { Reveal } from "@/components/ui/reveal";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "members.login" });
  return { title: t("titel") };
}

export default async function MembersPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("members.login");
  const tc = await getTranslations("common.cta");

  return (
    <>
      <ImageOverlay
        src="/images/muenster-dom.jpg"
        alt="St.-Paulus-Dom über den Dächern von Münster"
        overlay="strong"
        priority
        heightClassName="min-h-[42vh]"
        align="end"
      >
        <h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-tight text-champagner sm:text-5xl">
          {t("titel")}
        </h1>
        <GoldRule className="mx-0 mt-6" />
      </ImageOverlay>

      <Section background="pergament">
        <Container variant="text">
          <Reveal>
            <p className="font-sans text-xl font-light leading-relaxed text-tinte/85">
              {t("intro")}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <Card className="mt-10">
              {/* UI-Platzhalter ohne Funktion. Echtes Auth folgt spaeter. */}
              <form aria-label={t("titel")} className="flex flex-col gap-6">
                <Field label={t("emailLabel")} htmlFor="members-email">
                  <Input
                    id="members-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="name@firma.de"
                  />
                </Field>

                <Button type="submit" variant="primary" disabled>
                  {tc("anmelden")}
                </Button>
              </form>

              <p className="mt-6 border-t border-gold/30 pt-6 font-sans text-sm leading-relaxed text-tinte/70">
                {t("hinweis")}
              </p>
            </Card>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
