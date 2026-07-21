"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StatutVisa, obtenirCompte } from "@/lib/api/compte";
import { IconeCheck } from "@/components/app/flux/icones";

/*
 * Carte « Ajouter mon visa » : étape de conversion clé du parcours (la
 * preuve de visa débloque l'usage complet du compte Euro), donc mise en
 * avant avec une hiérarchie visuelle forte : vignette plus grande, badge
 * d'action corail, bord accentué et effet de survol.
 *
 * Carte dépliable (accordéon) : repliée, elle montre vignette + badge +
 * titre + courte description + chevron ; un clic la déplie avec une
 * animation fluide sur le message pédagogique et le CTA. Trois états :
 *  – aucun : visa non transmis, CTA « Ajouter mon visa » vers le flux ;
 *  – verification : preuve transmise, indicateur de traitement (CTA
 *    remplacé), re-lecture périodique du compte pour refléter la fin de
 *    la vérification simulée sans recharger la page ;
 *  – verifie : succès, plus de CTA, compte entièrement activé.
 */
export default function CarteAjoutVisa({ statutInitial = "aucun" }: { statutInitial?: StatutVisa }) {
  const t = useTranslations("app.accueil");
  const [statut, setStatut] = useState<StatutVisa>(statutInitial);
  const [ouverte, setOuverte] = useState(false);

  // Pendant la vérification simulée, on re-lit le compte régulièrement
  // (le vrai backend poussera une notification).
  useEffect(() => {
    if (statut !== "verification") return;
    const minuterie = window.setInterval(() => {
      const suivant = obtenirCompte().statutVisa ?? "aucun";
      if (suivant !== "verification") setStatut(suivant);
    }, 5000);
    return () => window.clearInterval(minuterie);
  }, [statut]);

  /** Petite pilule d'état affichée au-dessus du titre. */
  const badge =
    statut === "aucun" ? (
      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-secondary to-secondary-light px-2 py-0.5 text-[9px] font-bold leading-4 text-white">
        {t("ajoutVisaBadge")}
      </span>
    ) : statut === "verification" ? (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-lighter/60 px-2 py-0.5 text-[9px] font-bold leading-4 text-primary-light">
        <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-primary-light" />
        {t("visaVerifBadge")}
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-bold leading-4 text-success">
        <IconeCheck className="size-3" />
        {t("visaOkBadge")}
      </span>
    );

  const texteCourt = statut === "aucun" ? t("ajoutVisaTexte") : statut === "verification" ? t("visaVerifTexte") : t("visaOkTexte");
  const message = statut === "aucun" ? t("ajoutVisaMessage") : statut === "verification" ? t("visaVerifMessage") : t("visaOkMessage");

  return (
    <div
      className={
        "overflow-hidden rounded-xl border bg-white transition-shadow " +
        (statut === "aucun" ? "border-secondary/40 shadow-app hover:shadow-lg" : "border-grey-200 hover:shadow-app")
      }
    >
      {/* En-tête cliquable (état replié) : vignette, badge, titre, chevron. */}
      <button type="button" onClick={() => setOuverte((o) => !o)} aria-expanded={ouverte} className="flex w-full items-center gap-3 text-left">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app/accueil/ajout-visa.png" alt="" className="h-[76px] w-[112px] shrink-0 self-stretch object-cover" />
        <span className="min-w-0 flex-1 py-2.5">
          {badge}
          <span className="text-gradient-secondary mt-0.5 block text-sm font-bold leading-5">{t("ajoutVisaTitre")}</span>
          <span className="block text-xs leading-4 text-dark">{texteCourt}</span>
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/app/icons/caret-right.svg"
          alt=""
          width={20}
          height={20}
          className={"mr-3 size-5 shrink-0 transition-transform duration-300 " + (ouverte ? "-rotate-90" : "rotate-90")}
        />
      </button>

      {/* Volet dépliable : message pédagogique + CTA selon l'état. */}
      <div className={"grid transition-[grid-template-rows] duration-300 ease-out " + (ouverte ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 border-t border-grey-100 px-4 pb-4 pt-3">
            <p className="text-xs leading-5 text-dark">{message}</p>
            {statut === "aucun" && (
              <Link
                href="/app/visa"
                className="inline-flex h-[42px] w-full items-center justify-center rounded-full bg-gradient-to-r from-secondary to-secondary-light text-sm font-bold text-white transition-all hover:brightness-105"
              >
                {t("ajoutVisaCta")}
              </Link>
            )}
            {statut === "verification" && (
              <span className="inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-full bg-grey-100 text-sm font-bold text-grey">
                <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-grey-300 border-t-primary-light" />
                {t("visaVerifBadge")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
