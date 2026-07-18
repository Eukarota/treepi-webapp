"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { gras } from "@/components/landing/texte";

/*
 * Carrousel des Treepers (Randy, Fatou, Koné) : grande carte blanche masquée,
 * photo pleine hauteur à gauche traversée d'un trait corail, voile dégradé
 * puis colonne de texte à droite (titre à mot corail, accroche en gras,
 * paragraphe) et puces de navigation. Avance automatique, fondu entre photos.
 */

type Diapo = {
  image: string;
  alt: string;
  titre: string;
  position: string;
  pre: string;
  hl: string;
  post: string;
  description: string;
  content: string;
};

/* Recadrages mobiles propres à chaque photo, repris du site en production.
   Sur desktop la photo remplit la carte sans réduction (la classe scale-80
   de la prod n'existe pas dans son build : elle est sans effet). */
const TRANSFOS_PHOTO = [
  "max-sm:scale-[1.6] max-sm:-translate-x-3",
  "max-sm:scale-[1.4] max-sm:translate-y-10",
  "max-sm:scale-[1.4] max-sm:-translate-x-2 max-sm:translate-y-10",
];

/* Traits décoratifs corail, un par diapo (chemins repris du site d'origine). */
const TRAITS = [
  {
    largeur: "80%",
    viewBox: "0 0 749 618",
    classe: "-translate-x-[10%] max-sm:translate-x-8 max-sm:translate-y-5 max-sm:scale-[1.8]",
    d: "M438.703 -33.3111C303.375 -11.9941 84.4996 54.9877 45.0002 131.488C5.50083 207.988 43.0034 298.987 191.502 365.987C340 432.988 621.5 402.987 719 637.487",
    grad: { x1: "43.7616", y1: "348.671", x2: "688.967", y2: "292.502" },
  },
  {
    largeur: "30%",
    viewBox: "0 0 461 612",
    classe: "max-sm:translate-x-5 max-sm:translate-y-11 max-sm:scale-[2.2]",
    d: "M-42.0625 756.971C90.7016 790.76 318.252 815.542 384.723 760.824C451.194 706.106 452.625 607.693 342.594 487.551C232.563 367.41 -37.9472 283.945 -35.0469 29.9996",
    grad: { x1: "471.526", y1: "561.738", x2: "-143.523", y2: "358.861" },
  },
  {
    largeur: "85%",
    viewBox: "0 0 865 535",
    classe: "translate-x-20 scale-[2.0] md:-translate-x-[10%] md:scale-100 max-sm:translate-x-11 max-sm:translate-y-11",
    d: "M835 30.12C699.672 51.437 578 25.12 551 93.1199C524 161.12 684 295.62 653 368.12C622 440.62 540.5 447.62 -12.9994 504.62",
    grad: { x1: "-30.3913", y1: "304.842", x2: "852.227", y2: "228.005" },
  },
];

function TraitCorail({ index, visible }: { index: number; visible: boolean }) {
  const trait = TRAITS[index];
  return (
    <svg
      width={trait.largeur}
      height="100%"
      viewBox={trait.viewBox}
      fill="none"
      className={`absolute inset-0 z-[2] aspect-video object-cover transition-opacity duration-500 ${trait.classe} ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden
    >
      <path d={trait.d} stroke={`url(#trait_corail_grad_${index})`} strokeWidth="59" strokeLinecap="round" />
      <defs>
        <linearGradient id={`trait_corail_grad_${index}`} {...trait.grad} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6567" />
          <stop offset="1" stopColor="#FFC486" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function TreepersCarousel() {
  const t = useTranslations("landing.treepers");
  const diapos = t.raw("slides") as Diapo[];
  const [actif, setActif] = useState(0);

  // Avance automatique toutes les 6 secondes.
  useEffect(() => {
    const minuterie = setInterval(() => setActif((i) => (i + 1) % diapos.length), 6000);
    return () => clearInterval(minuterie);
  }, [diapos.length]);

  const diapo = diapos[actif];

  return (
    <section className="section relative max-sm:!bg-grey-light max-sm:!py-0">
      {/* La carte est clipée à tous les paliers : les traits corail restent
          dans la silhouette au lieu de déborder sous la carte. */}
      <div className="masque-treepers relative min-h-[600px] overflow-hidden rounded-3xl">
        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white">
          {/* Photos superposées, fondu croisé entre les diapos. */}
          <div className="relative h-80 w-full max-md:min-h-[20rem] md:absolute md:inset-0 md:h-full">
            {diapos.map((d, i) => (
              <img
                key={d.image}
                src={d.image}
                alt={d.alt}
                title={d.titre}
                className={`absolute inset-0 z-[1] aspect-video !h-full !w-full object-cover transition-opacity duration-500 ${d.position} ${TRANSFOS_PHOTO[i % TRANSFOS_PHOTO.length]} ${
                  i === actif ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {/* Les traits sont rognés avant le bas de la carte : la languette
                basse du masque ne les laisse plus déborder de la silhouette. */}
            <div className="pointer-events-none absolute inset-0 z-[2] md:[clip-path:inset(0_0_66px_0)]">
              {diapos.map((d, i) => (
                <TraitCorail key={d.image} index={i % TRAITS.length} visible={i === actif} />
              ))}
            </div>
          </div>
          {/* Voile dégradé : la photo fond vers le gris clair côté texte. */}
          <div className="absolute inset-0 z-[5] mt-auto h-full w-full bg-gradient-to-b from-grey-light/0 from-20% via-white via-[46%] to-white to-100% md:ml-auto md:w-2/3 md:bg-gradient-to-r md:via-grey-light md:via-50% md:to-grey-light" />
          {/* Colonne texte. */}
          <div className="relative z-20 -mt-32 flex w-full flex-col gap-4 pt-8 md:mt-0 md:flex-row md:pb-16 md:pt-32">
            <div className="ml-auto mb-4 max-sm:pt-11 md:w-5/12">
              {/* Wrapper relatif : les puces se posent en absolu dans le
                  rembourrage bas, comme l'indicateur du site en production
                  (aucune hauteur ajoutée au flux). */}
              <div className="relative flex flex-col items-start justify-center gap-2 px-8 py-11 max-md:px-4">
                <h3 className="mb-4 text-left font-outfit !text-[40px] font-bold !leading-[41.6px] max-sm:!text-[31.88px] max-sm:!leading-[42.5px] max-xs:!text-[24px] max-xs:!leading-[32px] [&>span]:bg-gradient-to-r [&>span]:from-primary [&>span]:to-primary-light [&>span]:bg-clip-text [&>span]:text-transparent">
                  <span>{diapo.pre}</span>{" "}
                  <span className="!from-secondary !to-secondary-light">{diapo.hl}</span>{" "}
                  <span>{diapo.post}</span>
                </h3>
                <p className="text-left !text-[16px] font-bold !leading-[20.8px] text-dark max-sm:!text-[18.59px] max-sm:!leading-[29.22px] max-xs:!text-[14px] max-xs:!leading-[22px]">
                  {diapo.description}
                </p>
                <p className="mt-4 min-h-44 text-left !text-[16px] font-medium !leading-[20.8px] text-dark max-sm:!text-[18.59px] max-sm:!leading-[29.22px] max-xs:!text-[14px] max-xs:!leading-[22px]">
                  {gras(diapo.content)}
                </p>
                {/* Puces : anneau dégradé corail au repos, pilule pleine à l'état actif. */}
                <div className="absolute bottom-4 left-0 right-0 mx-auto flex items-center justify-center gap-2">
                  {diapos.map((d, i) => (
                    <button
                      key={d.image}
                      type="button"
                      aria-label={d.titre}
                      onClick={() => setActif(i)}
                      className={`flex h-5 items-center justify-center rounded-full bg-gradient-to-r from-secondary to-secondary-light transition-all duration-300 ${
                        i === actif ? "w-10" : "w-5 hover:scale-110"
                      }`}
                    >
                      {i !== actif && <span className="h-3 w-3 rounded-full bg-grey-light" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
