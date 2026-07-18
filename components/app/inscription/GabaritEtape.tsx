"use client";

import { useTranslations } from "next-intl";
import Swirl from "@/components/ui/Swirl";
import IndicateurEtapes from "@/components/app/ui/IndicateurEtapes";

/*
 * Gabarit des écrans d'inscription (maquettes « Inscription/... »).
 *
 * Haut d'écran sur dégradé turquoise avec la volute en filigrane :
 * TopNav (flèche retour, titre « Inscription » Outfit Bold 24 blanc, croix),
 * indicateur des 4 phases (email, mot de passe, infos, téléphone), sous-titre
 * Outfit Bold 18 blanc avec mot-clé au dégradé corail et description 10px.
 *
 * Le contenu est posé sur une feuille gris clair arrondie (28px) qui monte
 * jusqu'à ~187px du haut, avec une bulle d'étape optionnelle (« 1/3 »,
 * pastille pêche) à cheval sur son bord supérieur.
 */
export default function GabaritEtape({
  phase,
  titreAvant,
  titreCle,
  description,
  bulle,
  onRetour,
  onQuitter,
  children,
}: {
  /** Index (base 0) de la phase courante parmi les 4 de l'inscription. */
  phase: number;
  titreAvant: string;
  titreCle: string;
  description: string;
  /** Contenu de la bulle d'étape (ex. « 1/3 »), absente si non fournie. */
  bulle?: string;
  onRetour: () => void;
  onQuitter: () => void;
  children: React.ReactNode;
}) {
  const t = useTranslations("app.inscription");

  return (
    // Mobile : plein écran. Desktop : panneau centré (max-w-md) sur la page,
    // ce qui évite le bandeau vide et contient la feuille + le calendrier.
    <div className="relative flex flex-1 flex-col md:justify-center md:py-10">
      {/* Desktop : bouton texte explicite au-dessus du panneau pour annuler
          l'inscription et retourner au site (la croix reste sur mobile). */}
      <button
        type="button"
        onClick={onQuitter}
        className="relative z-10 hidden items-center gap-1.5 text-sm font-bold text-primary-light transition-opacity hover:opacity-70 md:mx-auto md:mb-4 md:flex md:w-full md:max-w-md"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app/icons/arrow-left-teal.svg" alt="" width={20} height={20} className="size-5" />
        {t("retourSite")}
      </button>
      <div className="relative flex flex-1 flex-col md:mx-auto md:w-full md:max-w-md md:flex-none md:overflow-hidden md:rounded-[28px] md:shadow-app">
        {/* Fond dégradé turquoise + volute (plein écran sur mobile, borné au
            panneau sur desktop). */}
        <div aria-hidden className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary-light to-primary">
          <Swirl className="absolute inset-0 h-full w-full" />
        </div>

        {/* En-tête : TopNav + indicateur de phases + sous-titre. */}
        <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-4 px-6 pb-6 pt-10">
          <div className="flex h-8 items-center justify-between">
            <button type="button" onClick={onRetour} aria-label={t("retour")} className="transition-opacity hover:opacity-70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app/icons/arrow-left-white.svg" alt="" width={32} height={32} />
            </button>
            <span className="font-outfit text-2xl font-bold leading-8 text-white">{t("titre")}</span>
            {/* Croix mobile uniquement ; invisible (mais présente pour centrer
                le titre) sur desktop où le bouton texte la remplace. */}
            <button type="button" onClick={onQuitter} aria-label={t("quitter")} className="transition-opacity hover:opacity-70 md:invisible">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app/icons/close-white.svg" alt="" width={32} height={32} />
            </button>
          </div>
          <IndicateurEtapes total={4} courante={phase} />
          <div className="flex flex-col gap-1">
            <h1 className="font-outfit text-lg font-bold leading-[26px] text-white">
              {titreAvant}
              <span className="text-gradient-secondary">{titreCle}</span>
            </h1>
            {/* Lisibilité desktop : la description passe en 12px medium. */}
            <p className="text-[10px] leading-4 text-dark md:text-xs md:font-medium md:leading-[18px]">{description}</p>
          </div>
        </div>

        {/* Feuille de contenu, avec la bulle d'étape à cheval sur le bord. */}
        <div className="relative z-10 flex flex-1 flex-col rounded-t-[28px] bg-grey-light">
          {bulle && (
            <div className="absolute left-1/2 top-2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-peach text-[10px] font-bold leading-4 text-dark">
              {bulle}
            </div>
          )}
          <div className="colonne-app pb-8 pt-14 md:flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
