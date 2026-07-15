"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/*
 * « Simulateur de transfert » du tableau de bord : source + clause,
 * courbe de taux (export aplati de la maquette), note du taux en rouge,
 * champ XOF ↔ EUR avec pastilles devises et bouton d'inversion corail,
 * lien « Des frais peuvent être inclus » et CTA « Transférer ».
 * Même taux de référence que le simulateur du site (655,957 FCFA / EUR).
 */

/** Taux de change fixe EUR → XOF (parité FCFA). */
const TAUX = 655.957;

export default function SimulateurTransfert() {
  const t = useTranslations("app.accueil");
  const [euros, setEuros] = useState(300);
  const xof = Math.round(euros * TAUX);

  const formate = (v: number) => new Intl.NumberFormat("fr-FR").format(v);

  return (
    <section data-tuto="simulateur" className="flex flex-col gap-2">
      <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("simulateurTitre")}</h2>

      <div className="flex flex-col gap-2 rounded-lg border border-grey-200 bg-white p-4">
        <p className="text-center text-[10px] leading-4 text-grey">
          {t("simulateurSource")}
          <a href="https://www.morningstar.com/" target="_blank" rel="noreferrer" className="underline">
            Morningstar
          </a>
          {" · "}
          <span className="underline">{t("simulateurClause")}</span>
        </p>

        {/* Courbe du taux (export de la maquette, valeurs illustratives). */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/accueil/simulateur-courbe.png" alt="" className="w-full" />
          <div className="flex justify-between px-6 text-[10px] leading-4 text-dark">
            <span>9 juillet</span>
            <span>21 juillet</span>
            <span>{t("simulateurAujourdhui")}</span>
          </div>
        </div>

        <p className="text-center text-[10px] leading-4 text-grey">{t("simulateurEquivalent")}</p>
        <p className="text-center text-[10px] leading-4 text-error">
          {t("simulateurTaux", { taux: formate(TAUX) })}
        </p>

        {/* Ligne XOF (montant reçu, calculé). */}
        <div className="flex h-[42px] items-center justify-between rounded-xl border border-grey-100 px-3">
          <span className="text-sm font-medium text-dark">{formate(xof)}</span>
          <span className="flex items-center gap-1 text-sm font-bold text-dark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/icons/piece-xof.png" alt="" width={20} height={20} className="size-5 rounded-full" />
            XOF
          </span>
        </div>

        {/* Inversion (décorative : le sens du calcul reste EUR → XOF). */}
        <div className="relative -my-4 z-10 flex justify-center">
          <span className="grid size-9 rotate-90 place-items-center rounded-full bg-gradient-to-r from-secondary to-secondary-light shadow-[0_4px_14px_rgba(255,101,103,0.35)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/icons/arrows-left-right.svg" alt="" width={18} height={18} className="size-[18px] brightness-0 invert" />
          </span>
        </div>

        {/* Ligne EUR (montant saisi). */}
        <div className="flex h-[42px] items-center justify-between rounded-xl border border-grey-100 px-3">
          <input
            type="number"
            min={1}
            value={euros}
            onChange={(e) => setEuros(Math.max(0, Number(e.target.value)))}
            aria-label="EUR"
            className="w-24 bg-transparent text-sm font-medium text-dark outline-none"
          />
          <span className="flex items-center gap-1 text-sm font-bold text-dark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/icons/piece-eur.png" alt="" width={20} height={20} className="size-5 rounded-full" />
            EUR
          </span>
        </div>

        <p className="text-center text-[10px] leading-4 text-grey underline">{t("simulateurFrais")}</p>

        <button
          type="button"
          title={t("bientot")}
          className="inline-flex h-[46px] w-full items-center justify-center rounded-full bg-primary-light text-sm font-bold text-white transition-all hover:brightness-105"
        >
          {t("simulateurTransferer")}
        </button>
      </div>
    </section>
  );
}
