"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Wordmark } from "@/components/wordmark";

/**
 * Mobile Off-Canvas-Navigation (lg:hidden). Radix Dialog liefert
 * Focus-Trap, ESC-Schließen und Overlay-Klick. Panel kommt von rechts,
 * enthält alle navItems samt Kapiteln als Links und schließt bei Klick.
 */
export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Menü öffnen"
          className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-koenigsblau transition-colors hover:text-kontorblau focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:hidden"
        >
          <span className="flex w-6 flex-col gap-[5px]" aria-hidden="true">
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-koenigsblau/80 backdrop-blur-sm lg:hidden" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,360px)] flex-col overflow-y-auto bg-pergament shadow-2xl focus:outline-none lg:hidden"
          aria-label="Hauptnavigation"
        >
          <div className="flex items-center justify-between border-b border-gold/30 px-5 py-4">
            <Dialog.Title asChild>
              <span className="flex">
                <Wordmark tone="dark" size="footer" />
              </span>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Menü schließen"
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-koenigsblau transition-colors hover:text-kontorblau focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <span className="relative block h-5 w-5" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-current" />
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 bg-current" />
                </span>
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            Navigation durch alle Bereiche des Kontor Business Club.
          </Dialog.Description>

          <nav className="flex-1 px-5 py-6" aria-label="Mobile Hauptnavigation">
            <ul className="flex flex-col gap-7">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Dialog.Close asChild>
                    <Link
                      href={item.href}
                      className="block font-serif text-lg text-koenigsblau transition-colors hover:text-kontorblau focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    >
                      {t(item.key)}
                    </Link>
                  </Dialog.Close>
                  {item.children && item.children.length > 0 ? (
                    <ul className="mt-3 flex flex-col gap-3 border-l border-gold/40 pl-4">
                      {item.children.map((child) => (
                        <li key={child.key}>
                          <Dialog.Close asChild>
                            <Link
                              href={child.href}
                              className="block min-h-[44px] py-1 font-sans text-sm text-tinte transition-colors hover:text-koenigsblau focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                            >
                              {t("kapitel." + child.key)}
                            </Link>
                          </Dialog.Close>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto border-t border-gold/30 px-5 py-5">
            <LanguageSwitcher tone="dark" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
