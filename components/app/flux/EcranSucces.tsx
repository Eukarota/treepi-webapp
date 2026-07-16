"use client";

import type { ReactNode } from "react";
import Swirl from "@/components/ui/Swirl";
import BoutonApp from "@/components/app/ui/BoutonApp";

/*
 * Écran de succès générique des flux (modèle « Ecran de confirmation » des
 * maquettes) : fond dégradé, volute en fondu doux, illustration high-five,
 * grande feuille blanche en arc occupant ~la moitié basse portant le titre
 * (mot-clé au dégradé) et l'action. Réutilisé par Recharge, Virement, Visa...
 */
export default function EcranSucces({
  titreAvant,
  titreCle,
  texte,
  cta,
  onContinuer,
  teinte = "turquoise",
}: {
  titreAvant: string;
  titreCle: string;
  texte?: ReactNode;
  cta: string;
  onContinuer: () => void;
  /** Dégradé de fond : turquoise (opérations) ou corail (inscription/visa). */
  teinte?: "turquoise" | "corail";
}) {
  const fond = teinte === "corail" ? "from-secondary-light to-secondary" : "from-primary-light to-primary";
  const cle = teinte === "corail" ? "text-gradient-primary" : "text-gradient-secondary";

  return (
    <div className={"relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b " + fond}>
      <Swirl className="absolute inset-0 h-full w-full mix-blend-soft-light" />

      {/* Illustration high-five (calques Figma recomposés), posée sur l'arc. */}
      <div className="relative flex flex-1 items-end justify-center pb-3">
        <div className="relative aspect-[254/272] w-[254px] max-w-[58%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/illustrations/highfive/graphics.svg" alt="" className="absolute" style={{ left: "0.11%", top: "2.87%", width: "99.78%", height: "91.68%" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/illustrations/highfive/lines.svg" alt="" className="absolute" style={{ left: "15.15%", top: "0.31%", width: "66.9%", height: "51.71%" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/illustrations/highfive/hand-2.svg" alt="" className="absolute" style={{ left: "43.42%", top: "5.42%", width: "56.26%", height: "94.48%" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/illustrations/highfive/hand-1.svg" alt="" className="absolute" style={{ left: "10.53%", top: "7.48%", width: "44.27%", height: "92.42%" }} />
        </div>
      </div>

      <div className="relative flex min-h-[46dvh] shrink-0 justify-center">
        <div className="flex w-[178%] max-w-none flex-col justify-center rounded-t-[50%] bg-white px-[14%] pb-10 pt-12 md:w-[120%] md:px-[8%]">
          <div className="mx-auto w-full max-w-[272px] text-center md:max-w-md">
            <h1 className="font-outfit text-2xl font-bold leading-8 text-dark">
              {titreAvant}
              <span className={cle}>{titreCle}</span>
            </h1>
            {texte && <p className="mt-3 text-sm leading-[22px] text-grey">{texte}</p>}
            <div className="mt-8">
              <BoutonApp onClick={onContinuer}>{cta}</BoutonApp>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
