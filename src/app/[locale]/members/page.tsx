import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { GoldRule } from "@/components/ui/gold-rule";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
      {/* Hero: nur Bild, ohne Filter (Iteration 5 § 5.2) */}
      <div className="relative min-h-[42vh] w-full overflow-hidden">
        <Image
          src="/images/Members_ohne_Wasserzeichen.png"
          alt="Mitgliederbereich Kontor Business Club"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Section background="pergament">
        <Container variant="text">
          <Reveal className="flex flex-col gap-5">
            <h1 className="font-serif text-4xl font-semibold leading-tight text-koenigsblau sm:text-5xl">
              {t("titel")}
            </h1>
            <GoldRule className="mx-0" />
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
