"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/*
 * Bannières pré/post-visa (maquettes « Bannière Pré-Visa / Post-Visa »).
 * Chaque bannière : zone image teintée (export aplati de la maquette,
 * texte re-rendu par-dessus en segments colorés) et pied blanc avec
 * libellé au dégradé turquoise + pilule corail.
 *
 * Carrousel horizontal avec accroche (scroll snap) à toutes les tailles.
 * Les cartes ont une largeur fixe (plus large sur desktop) et défilent sous
 * la carte du solde.
 */

interface Segment {
  t: string;
  /** Couleur du segment : n = normal, t = turquoise, c = corail. */
  c: "n" | "t" | "c";
}

interface Bandeau {
  image: string;
  teinte: "bleu" | "peche" | "turquoise";
  pied: string;
  cta: string;
  /** Le CTA porte-t-il l'icône « plus » (bannières Recharger). */
  plus: boolean;
  segments: Segment[];
}

/** Couleur de fond de la zone image, raccord avec l'export aplati. */
const TEINTES: Record<Bandeau["teinte"], string> = {
  bleu: "bg-[#ecfdff]",
  peche: "bg-peach",
  turquoise: "bg-primary-lighter",
};

const COULEURS: Record<Segment["c"], string> = {
  n: "",
  t: "text-primary-light",
  c: "text-gradient-secondary",
};

export default function Bandeaux({ phase }: { phase: "pre-visa" | "post-visa" }) {
  const t = useTranslations("app.accueil");
  const bandeaux = t.raw(phase === "pre-visa" ? "bannieresPre" : "bannieresPost") as Bandeau[];

  return (
    <div
      className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:px-0"
      style={{ scrollSnapType: "x mandatory" }}
    >
      <div className="flex w-max gap-3">
        {bandeaux.map((b) => (
          <article
            key={b.image}
            className="h-[104px] w-[272px] shrink-0 overflow-hidden rounded-lg border border-grey-200 bg-white lg:h-[112px] lg:w-[340px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className={`relative h-[72px] lg:h-[80px] ${TEINTES[b.teinte]}`}>
              {/* Zone image aplatie (teinte + motif + illustration), texte exclu. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/app/accueil/${b.image}.png`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-right"
              />
              <p className="relative z-10 w-[77%] px-4 py-2 text-[10px] font-bold leading-4 text-dark">
                {b.segments.map((s, i) => (
                  <span key={i} className={COULEURS[s.c]}>
                    {s.t}
                  </span>
                ))}
              </p>
            </div>
            <div className="flex h-[32px] items-center justify-between bg-white px-4 shadow-[0_-1px_16px_rgba(0,0,0,0.15)]">
              <span className="text-gradient-primary text-[10px] font-bold leading-4">{b.pied}</span>
              {b.plus ? (
                <Link
                  href="/app/recharger"
                  className="flex h-6 items-center gap-1 rounded-full bg-gradient-to-r from-secondary to-secondary-light px-2.5 text-[9px] font-bold text-white transition-all hover:brightness-105"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/app/icons/plus-circle.svg" alt="" width={12} height={12} />
                  {b.cta}
                </Link>
              ) : (
                <button
                  type="button"
                  title={t("bientot")}
                  className="flex h-6 items-center gap-1 rounded-full bg-gradient-to-r from-secondary to-secondary-light px-2.5 text-[9px] font-bold text-white transition-all hover:brightness-105"
                >
                  {b.cta}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
