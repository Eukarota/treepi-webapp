"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/*
 * Carte du solde Euro (maquette « Virtual card »).
 *
 * Mobile, 1:1 maquette : fond turquoise aux courbes découpées (export aplati
 * avec l'encoche en haut à droite), bouton « Recharger » logé dans l'encoche,
 * solde Outfit Bold 36 centré.
 *
 * Desktop : la carte pleine largeur serait démesurée et l'encoche laisserait
 * un grand vide blanc. On raccourcit donc la carte (ratio paysage, l'encoche
 * est recadrée par le bas) et « Recharger » redevient une pilule discrète dans
 * le coin. Le solde est agrandi et centré. La rangée d'actions rapides en
 * pastilles givrées chevauche le bas de la carte dans les deux cas.
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

  // Actions déjà reliées à un flux (les autres restent « Bientôt disponible »).
  const LIENS: Record<string, string | undefined> = {
    rib: "/app/recevoir",
  };

  return (
    <div data-tuto="carte" className="relative">
      <div className="relative aspect-[272/153] w-full overflow-hidden rounded-[20px] lg:aspect-[8/3]">
        {/* Fond de carte exporté de Figma (forme + courbes + encoche).
            object-bottom : sur desktop la carte est plus courte, l'encoche du
            haut est recadrée pour éviter le vide blanc. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app/accueil/carte-virtuelle.png" alt="" className="absolute inset-0 size-full object-cover object-bottom" />

        {/* Pastille devise. */}
        <div className="absolute left-[3%] top-[4%] flex items-center gap-1 lg:gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/icons/drapeau-eur.png" alt="" width={14} height={14} className="size-3.5 rounded-full lg:size-5" />
          <span className="text-sm font-bold leading-[22px] text-white lg:text-xl">EUR</span>
        </div>

        {/* Recharger. Mobile : remplit l'encoche (39% x 26%, maquette).
            Desktop : pilule discrète dans le coin haut droit. */}
        <Link
          href="/app/recharger"
          className="absolute right-0 top-0 flex h-[26%] w-[39%] items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-secondary to-secondary-light text-xs font-bold text-white shadow-[0_4px_14px_rgba(255,101,103,0.35)] transition-all hover:brightness-105 lg:left-auto lg:right-5 lg:top-5 lg:h-auto lg:w-auto lg:gap-2 lg:px-5 lg:py-2.5 lg:text-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/icons/plus-circle.svg" alt="" width={18} height={18} className="size-[18px] lg:size-5" />
          {t("recharger")}
        </Link>

        {/* Solde : centré, agrandi sur desktop. */}
        <p className="absolute left-1/2 top-[34%] -translate-x-1/2 font-outfit text-4xl font-bold leading-[48px] text-white lg:top-1/2 lg:-translate-y-1/2 lg:text-[52px] lg:leading-[56px]">
          {solde} €
        </p>
      </div>

      {/* Actions rapides : pastilles givrées à cheval sur le bas de carte. */}
      <div className="-mt-7 flex justify-center gap-px lg:-mt-10 lg:gap-8">
        {actions.map((action) => {
          const contenu = (
            <>
              <span className="grid size-10 place-items-center rounded-full border-[0.5px] border-white/70 bg-white/50 backdrop-blur-[2.5px] transition-colors group-hover:bg-white/70 lg:size-14">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ICONES[action.cle]} alt="" width={20} height={20} className="size-5 lg:size-7" />
              </span>
              <span className="text-[10px] leading-4 text-dark lg:text-sm">{action.libelle}</span>
            </>
          );
          const classe = "group flex w-[61px] flex-col items-center gap-1 lg:w-20 lg:gap-2";
          const href = LIENS[action.cle];
          return href ? (
            <Link key={action.cle} href={href} className={classe}>
              {contenu}
            </Link>
          ) : (
            <button key={action.cle} type="button" title={t("bientot")} className={classe}>
              {contenu}
            </button>
          );
        })}
      </div>
    </div>
  );
}
