"use client";

import { useTranslations } from "next-intl";

/*
 * Barre de capture email du site en production : cadre au dégradé corail,
 * carrousel vertical de petites icônes à gauche, champ email, bouton
 * « Rejoindre le mouvement ». Le défilement des icônes reprend l'animation
 * `slide-vertical` du site d'origine.
 */

const ICONES = [
  "/images/icons/airline.svg",
  "/images/icons/creditCard.svg",
  "/images/icons/chats.svg",
  "/images/icons/globe.svg",
];

export default function EmailCapture({ placeholder }: { placeholder: string }) {
  const t = useTranslations("landing.trust");

  return (
    <section className="flex w-full flex-col items-center md:px-3">
      <div className="flex w-full flex-col items-center gap-5 py-0 md:py-8">
        <div className="w-full rounded-lg bg-gradient-to-r from-secondary to-secondary-light p-0.5 shadow-lg transition-shadow duration-300 focus-within:shadow-xl sm:w-[65%] sm:rounded-[16px] sm:p-[2px]">
          <form
            className="flex w-full items-center rounded-2xl bg-white max-sm:rounded-lg"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex min-w-[200px] flex-1 items-center gap-3 !pr-0 max-sm:gap-0.5 sm:min-w-0">
              {/* Carrousel vertical d'icônes. */}
              <div className="relative ml-2 mt-1 h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-r from-purple-50 to-sky-50 max-md:h-6 max-md:w-6 sm:h-8 sm:w-8">
                <ul className="h-full animate-slide-vertical">
                  {ICONES.map((src, i) => (
                    <li key={src} className="flex h-full w-full items-center justify-center max-md:h-6 max-md:w-6">
                      <img src={src} alt={`icon-${i}`} className="h-full w-full object-contain" loading="lazy" />
                    </li>
                  ))}
                </ul>
              </div>
              <input
                type="email"
                required
                placeholder={placeholder}
                className="w-full rounded-xl p-4 text-base text-grey outline-none placeholder-grey max-sm:p-2 max-sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="m-1 shrink-0 rounded-xl bg-gradient-to-r from-secondary to-secondary-light px-8 py-4 text-sm font-bold text-white transition-opacity hover:opacity-90 max-sm:px-[28px] max-sm:py-2 sm:rounded-[13px]"
            >
              {/* Libellé complet sur desktop, raccourci sur mobile comme en production. */}
              <span className="text-xs max-sm:hidden">{t("cta")}</span>
              <span className="max-sm:text-[18.59px] max-xs:text-[14px] sm:hidden">{t("ctaCourt")}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
