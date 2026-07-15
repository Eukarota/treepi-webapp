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
    <div className="relative flex flex-1 flex-col">
      {/* Fond dégradé turquoise + volute, derrière tout l'écran. */}
      <div aria-hidden className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary-light to-primary">
        <Swirl className="absolute inset-0 h-full w-full" />
      </div>

      {/* En-tête : TopNav + indicateur de phases + sous-titre.
          Sur desktop, le bandeau dégradé s'étire et la colonne se centre. */}
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-4 px-6 pb-6 pt-10">
        <div className="flex h-8 items-center justify-between">
          <button type="button" onClick={onRetour} aria-label={t("retour")} className="transition-opacity hover:opacity-70">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/icons/arrow-left-white.svg" alt="" width={32} height={32} />
          </button>
          <span className="font-outfit text-2xl font-bold leading-8 text-white">{t("titre")}</span>
          <button type="button" onClick={onQuitter} aria-label={t("quitter")} className="transition-opacity hover:opacity-70">
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
          <p className="text-[10px] leading-4 text-dark">{description}</p>
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
  );
}
