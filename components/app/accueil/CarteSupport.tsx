"use client";

import { useTranslations } from "next-intl";

/*
 * Carte support (composant Figma « Banner/Large ») : photo du service
 * client fondue vers le blanc à gauche, message avec « Treepi » au dégradé
 * turquoise, pied avec libellé et pilule corail « En savoir plus ».
 */
export default function CarteSupport() {
  const t = useTranslations("app.accueil");

  return (
    <article className="overflow-hidden rounded-lg border border-grey-200 bg-white">
      <div className="relative h-[107px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/app/accueil/support.webp"
          alt=""
          className="absolute inset-y-0 right-0 h-full w-[63%] object-cover"
        />
        {/* Fondu blanc vers la gauche, comme la maquette. */}
        <div className="absolute inset-0 bg-gradient-to-r from-white from-[56%] to-transparent" />
        <p className="relative z-10 w-[170px] px-4 py-4 text-[10px] leading-4 text-dark">
          {t("supportAvant")}
          <span className="text-gradient-primary font-bold">{t("supportMarque")}</span>
          {t("supportApres")}
        </p>
      </div>
      <div className="flex items-center justify-between bg-white px-4 py-1 shadow-[0_-1px_16px_rgba(0,0,0,0.25)]">
        <span className="text-gradient-primary text-[10px] font-bold leading-4">{t("supportPied")}</span>
        <button
          type="button"
          title={t("bientot")}
          className="rounded-full bg-gradient-to-r from-secondary to-secondary-light px-3 py-1.5 text-[9px] font-bold text-white transition-all hover:brightness-105"
        >
          {t("supportCta")}
        </button>
      </div>
    </article>
  );
}
