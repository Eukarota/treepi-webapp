"use client";

import { useTranslations } from "next-intl";
import Swirl from "@/components/ui/Swirl";
import BoutonApp from "@/components/app/ui/BoutonApp";

/*
 * Écran de confirmation « Compte créé » (maquette « Ecran de confirmation/
 * Compte créé ») : fond dégradé pêche → corail avec la volute en fondu
 * doux, illustration du high-five, grande feuille blanche en arc de cercle
 * portant « Bravo ! Ton compte a été créé avec succès » (« succès » au
 * dégradé turquoise) et le bouton « Continuer ».
 */
export default function EcranBravo({ onContinuer }: { onContinuer: () => void }) {
  const t = useTranslations("app.inscription.bravo");

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-secondary-light to-secondary">
      {/* Volute en fondu doux, comme sur la maquette (soft-light). */}
      <Swirl className="absolute inset-0 h-full w-full mix-blend-soft-light" />

      {/* Illustration high-five (calques Figma recomposés) : décalée vers le bas
          pour que l'arc blanc (z-10) recouvre légèrement le bas des mains. */}
      <div className="relative z-0 flex flex-1 items-end justify-center">
        <div className="relative aspect-[254/272] w-[254px] max-w-[58%] translate-y-8">
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

      {/* Feuille blanche en arc de cercle occupant ~la moitié basse (déborde
          des deux côtés) ; la colonne de texte reste centrée et bornée. */}
      <div className="relative z-10 flex min-h-[46dvh] shrink-0 justify-center">
        <div className="flex w-[178%] max-w-none flex-col justify-center rounded-t-[50%] bg-white pb-10 pt-12 md:w-[120%]">
          <div className="mx-auto w-full max-w-[272px] text-center md:max-w-md md:px-6">
            <h1 className="font-outfit text-2xl font-bold leading-8 text-dark">
              {t("titre1")}
              <br />
              {t("titre2Avant")}
              <span className="text-gradient-primary">{t("titre2Cle")}</span>
            </h1>
            <div className="mt-9">
              <BoutonApp onClick={onContinuer}>{t("continuer")}</BoutonApp>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
