"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import BoutonApp from "@/components/app/ui/BoutonApp";
import IndicateurEtapes from "@/components/app/ui/IndicateurEtapes";

/*
 * Walkthrough de découverte (maquettes « Walkthrough/Services-1/4 » à
 * « 4/4 ») : 4 diapositives présentant les services Treepi.
 *
 * Chaque diapositive : courbes décoratives propres à l'étape (exports SVG
 * des cadres « Curve » Figma), illustration 272x272 centrée, titre Outfit
 * Bold 24 dont les mots-clés portent le dégradé corail, indicateur de
 * progression segmenté en haut, bouton « Suivant » (+ retour circulaire à
 * partir de la 2e étape). La dernière étape mène à l'écran de bienvenue.
 */

/** Ordre des visuels : illustration et courbe décorative par étape. */
const DIAPOSITIVES = [
  { illustration: "/app/illustrations/africa.svg", courbe: "/app/illustrations/curve-1.svg" },
  { illustration: "/app/illustrations/passport.webp", courbe: "/app/illustrations/curve-2.svg" },
  { illustration: "/app/illustrations/justification.svg", courbe: "/app/illustrations/curve-3.svg" },
  { illustration: "/app/illustrations/card.svg", courbe: "/app/illustrations/curve-4.svg" },
];

interface TexteDiapositive {
  avant: string;
  cle1: string;
  milieu: string;
  cle2: string;
  apres: string;
}

export default function PageDecouverte() {
  const t = useTranslations("app.walkthrough");
  const router = useRouter();
  const [etape, setEtape] = useState(0);
  const textes = t.raw("slides") as TexteDiapositive[];

  /** Termine le walkthrough : mémorise le passage puis va à l'accueil visiteur. */
  const terminer = () => {
    window.localStorage.setItem("treepi.walkthrough-vu", "1");
    router.push("/app/bienvenue");
  };

  const suivant = () => (etape === DIAPOSITIVES.length - 1 ? terminer() : setEtape(etape + 1));
  const texte = textes[etape];

  return (
    <EcranApp className="md:justify-center">
      <FondApp />
      {/* Courbes décoratives de l'étape, ancrées en haut de l'écran. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={DIAPOSITIVES[etape].courbe}
        src={DIAPOSITIVES[etape].courbe}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 w-full animate-fade-in md:w-[56rem]"
      />

      <div className="colonne-app relative z-10 pb-8 pt-16 md:py-16">
        <IndicateurEtapes total={DIAPOSITIVES.length} courante={etape} />

        {/* Illustration de l'étape (exports vectoriels des maquettes). */}
        <div className="mt-11 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={DIAPOSITIVES[etape].illustration}
            src={DIAPOSITIVES[etape].illustration}
            alt=""
            width={272}
            height={272}
            className="size-[272px] max-w-full animate-fade-in"
          />
        </div>

        {/* Titre : mots-clés au dégradé corail signature. */}
        <h1 key={etape} className="mt-auto animate-fade-in font-outfit text-2xl font-bold leading-8 text-dark md:mt-12">
          {texte.avant}
          <span className="text-gradient-secondary">{texte.cle1}</span>
          {texte.milieu}
          <span className="text-gradient-secondary">{texte.cle2}</span>
          {texte.apres}
        </h1>

        {/* Navigation : retour circulaire dès la 2e étape + « Suivant ». */}
        <div className="mt-10 flex items-center gap-2">
          {etape > 0 && (
            <BoutonApp icone aria-label={t("retour")} onClick={() => setEtape(etape - 1)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app/icons/arrow-left.svg" alt="" width={21} height={21} />
            </BoutonApp>
          )}
          <BoutonApp onClick={suivant}>{t("suivant")}</BoutonApp>
        </div>
      </div>
    </EcranApp>
  );
}
