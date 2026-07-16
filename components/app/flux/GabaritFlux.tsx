"use client";

import { useTranslations } from "next-intl";
import Swirl from "@/components/ui/Swirl";
import IndicateurEtapes from "@/components/app/ui/IndicateurEtapes";

/*
 * Gabarit partagé des flux de l'app (Recharge, Virement, Visa, Accompagnement,
 * KYC...). Reprend la structure des maquettes : bandeau dégradé turquoise avec
 * volute, TopNav (retour, titre blanc Outfit Bold 24, croix), indicateur de
 * progression facultatif, sous-titre Outfit Bold 18 (mot-clé au dégradé corail)
 * et description, puis une feuille de contenu gris clair arrondie.
 *
 * Mobile : plein écran. Desktop : panneau centré (max-w-md, coins arrondis,
 * ombre), posé sur le fond de marque, comme le flux d'inscription. Le fond
 * dégradé est borné au panneau pour éviter le bandeau vide sur grand écran.
 */
export default function GabaritFlux({
  titre,
  etape,
  totalEtapes,
  titreAvant,
  titreCle,
  description,
  bulle,
  onRetour,
  onQuitter,
  children,
}: {
  /** Titre du bandeau (ex. « Recharge »). */
  titre: string;
  /** Étape courante (base 0) pour l'indicateur ; omis = pas d'indicateur. */
  etape?: number;
  totalEtapes?: number;
  /** Sous-titre optionnel : partie neutre + mot-clé au dégradé corail. */
  titreAvant?: string;
  titreCle?: string;
  description?: string;
  /** Contenu de la bulle d'étape (ex. « 1/3 »), à cheval sur la feuille. */
  bulle?: string;
  onRetour: () => void;
  onQuitter: () => void;
  children: React.ReactNode;
}) {
  const c = useTranslations("app.commun");
  const avecEntete = Boolean(titreAvant || description);

  return (
    <div className="relative flex flex-1 flex-col md:justify-center md:py-10">
      <div className="relative flex flex-1 flex-col md:mx-auto md:w-full md:max-w-md md:flex-none md:overflow-hidden md:rounded-[28px] md:shadow-app">
        {/* Fond dégradé + volute (plein écran mobile, borné au panneau desktop). */}
        <div aria-hidden className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary-light to-primary">
          <Swirl className="absolute inset-0 h-full w-full" />
        </div>

        {/* En-tête : TopNav + indicateur + sous-titre. */}
        <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-4 px-6 pb-6 pt-10">
          <div className="flex h-8 items-center justify-between">
            <button type="button" onClick={onRetour} aria-label={c("retour")} className="transition-opacity hover:opacity-70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app/icons/arrow-left-white.svg" alt="" width={32} height={32} />
            </button>
            <span className="font-outfit text-2xl font-bold leading-8 text-white">{titre}</span>
            <button type="button" onClick={onQuitter} aria-label={c("fermer")} className="transition-opacity hover:opacity-70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app/icons/close-white.svg" alt="" width={32} height={32} />
            </button>
          </div>

          {typeof etape === "number" && totalEtapes ? <IndicateurEtapes total={totalEtapes} courante={etape} /> : null}

          {avecEntete && (
            <div className="flex flex-col gap-1">
              {(titreAvant || titreCle) && (
                <h1 className="font-outfit text-lg font-bold leading-[26px] text-white">
                  {titreAvant}
                  {titreCle && <span className="text-gradient-secondary">{titreCle}</span>}
                </h1>
              )}
              {description && <p className="text-[10px] leading-4 text-dark">{description}</p>}
            </div>
          )}
        </div>

        {/* Feuille de contenu (bulle d'étape à cheval sur le bord). */}
        <div className="relative z-10 flex flex-1 flex-col rounded-t-[28px] bg-grey-light">
          {bulle && (
            <div className="absolute left-1/2 top-2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-peach text-[10px] font-bold leading-4 text-dark">
              {bulle}
            </div>
          )}
          <div className={"colonne-app pb-8 md:flex-1 " + (bulle ? "pt-14" : "pt-8")}>{children}</div>
        </div>
      </div>
    </div>
  );
}
