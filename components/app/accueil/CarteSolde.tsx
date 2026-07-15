"use client";

import { useTranslations } from "next-intl";

/*
 * Carte du solde Euro (maquette « Virtual card ») : fond turquoise aux
 * courbes découpées (export aplati de la maquette, avec l'encoche en haut
 * à droite), pastille drapeau EUR, bouton « Recharger » corail logé dans
 * l'encoche, solde Outfit Bold 36 centré, puis la rangée d'actions rapides
 * en pastilles givrées qui chevauche le bas de la carte.
 */
export default function CarteSolde({ soldeEuros }: { soldeEuros: number }) {
  const t = useTranslations("app.accueil");
  const actions = t.raw("actions") as { cle: string; libelle: string }[];

  const solde = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(soldeEuros);

  const ICONES: Record<string, string> = {
    transactions: "/app/icons/action-transactions.svg",
    convertir: "/app/icons/action-convertir.svg",
    rib: "/app/icons/action-rib.svg",
    abonnement: "/app/icons/action-abonnement.svg",
  };

  return (
    <div data-tuto="carte" className="relative">
      <div className="relative aspect-[272/153] w-full">
        {/* Fond de carte exporté de Figma (forme + courbes + encoche). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app/accueil/carte-virtuelle.png" alt="" className="absolute inset-0 size-full" />

        {/* Pastille devise. */}
        <div className="absolute left-[3%] top-[4%] flex items-center gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/icons/drapeau-eur.png" alt="" width={14} height={14} className="size-3.5 rounded-full" />
          <span className="text-sm font-bold leading-[22px] text-white">EUR</span>
        </div>

        {/* Bouton Recharger, dimensionné pour remplir l'encoche (39% x 26%
            de la carte, proportions de la maquette). */}
        <button
          type="button"
          title={t("bientot")}
          className="absolute right-0 top-0 flex h-[26%] w-[39%] items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-secondary to-secondary-light text-xs font-bold text-white shadow-[0_4px_14px_rgba(255,101,103,0.35)] transition-all hover:brightness-105"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/icons/plus-circle.svg" alt="" width={18} height={18} />
          {t("recharger")}
        </button>

        {/* Solde. */}
        <p className="absolute left-1/2 top-[34%] -translate-x-1/2 font-outfit text-4xl font-bold leading-[48px] text-white">
          {solde} €
        </p>
      </div>

      {/* Actions rapides : pastilles givrées à cheval sur le bas de carte. */}
      <div className="-mt-7 flex justify-center gap-px">
        {actions.map((action) => (
          <button
            key={action.cle}
            type="button"
            title={t("bientot")}
            className="flex w-[61px] flex-col items-center gap-1"
          >
            <span className="grid size-10 place-items-center rounded-full border-[0.5px] border-white/70 bg-white/50 backdrop-blur-[2.5px] transition-colors hover:bg-white/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ICONES[action.cle]} alt="" width={20} height={20} className="size-5" />
            </span>
            <span className="text-[10px] leading-4 text-dark">{action.libelle}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
