"use client";

import { useTranslations } from "next-intl";
import * as Accordion from "@radix-ui/react-accordion";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { GoldRule } from "@/components/ui/gold-rule";

type FaqItem = {
  frage: string;
  antwort: string;
};

/**
 * Barrierefreies FAQ-Accordion (Radix) auf pergament-Fläche.
 * Inhalte aus home.faq.items via t.raw.
 */
export function Faq() {
  const t = useTranslations("home");
  const items = t.raw("faq.items") as FaqItem[];

  return (
    <Container variant="text" className="flex flex-col">
      <header className="flex flex-col gap-5">
        <Kicker tone="light">{t("faq.kicker")}</Kicker>
        <h2 className="font-serif text-3xl font-semibold leading-tight text-koenigsblau sm:text-4xl">
          {t("faq.titel")}
        </h2>
        <GoldRule className="mx-0" />
      </header>

      <Accordion.Root type="single" collapsible className="mt-10 flex flex-col">
        {items.map((item, index) => (
          <Accordion.Item
            key={index}
            value={`item-${index}`}
            className="border-b border-gold/30"
          >
            <Accordion.Header className="m-0">
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-5 text-left font-serif text-lg font-semibold text-koenigsblau transition-colors hover:text-kontorblau focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kontorblau focus-visible:ring-offset-2 focus-visible:ring-offset-pergament">
                <span>{item.frage}</span>
                <span
                  aria-hidden="true"
                  className="relative ms-4 size-4 shrink-0"
                >
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-gold" />
                  <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-gold transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0" />
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-none">
              <p className="pb-5 pe-8 font-sans text-base leading-relaxed text-tinte/85">
                {item.antwort}
              </p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Container>
  );
}
