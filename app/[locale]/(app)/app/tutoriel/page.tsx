"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { CompteEuro, obtenirCompte } from "@/lib/api/compte";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import NavBarApp from "@/components/app/accueil/NavBarApp";
import EnTeteAccueil from "@/components/app/accueil/EnTeteAccueil";
import CarteSolde from "@/components/app/accueil/CarteSolde";
import Bandeaux from "@/components/app/accueil/Bandeaux";
import Transactions from "@/components/app/accueil/Transactions";
import CarteAjoutVisa from "@/components/app/accueil/CarteAjoutVisa";
import ServicesTreepi from "@/components/app/accueil/ServicesTreepi";
import SimulateurTransfert from "@/components/app/accueil/SimulateurTransfert";
import CarteSupport from "@/components/app/accueil/CarteSupport";

/*
 * Tutoriel facultatif (section « Tutoriel » des maquettes) : visite guidée
 * du tableau de bord. La page est assombrie, l'élément présenté reste en
 * pleine lumière (projecteur), une bulle blanche explique la fonction et
 * les boutons Retour/Suivant du bas font défiler les 3 étapes :
 * carte du solde → services → simulateur. À la fin, retour à l'accueil.
 */

interface EtapeTuto {
  cible: string;
  texte: string;
}

export default function PageTutoriel() {
  const t = useTranslations("app.tuto");
  const router = useRouter();
  const { session, chargement } = useSession();
  const [compte, setCompte] = useState<CompteEuro | null>(null);
  const [etape, setEtape] = useState(0);
  const [cadre, setCadre] = useState<{ x: number; y: number; l: number; h: number } | null>(null);

  const etapes = t.raw("etapes") as EtapeTuto[];

  useEffect(() => {
    if (!chargement && !session) {
      router.replace("/app/bienvenue");
      return;
    }
    if (session) setCompte(obtenirCompte());
  }, [chargement, session, router]);

  /** Mesure la cible de l'étape et cadre le projecteur dessus. */
  const mesurer = useCallback(() => {
    const cible = document.querySelector(`[data-tuto="${etapes[etape].cible}"]`);
    if (!cible) return;
    cible.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior });
    const r = cible.getBoundingClientRect();
    setCadre({ x: r.left - 8, y: r.top - 8, l: r.width + 16, h: r.height + 16 });
  }, [etape, etapes]);

  useEffect(() => {
    if (!compte) return;
    // Attend le rendu du tableau de bord avant de mesurer.
    const minuteur = setTimeout(mesurer, 150);
    window.addEventListener("resize", mesurer);
    return () => {
      clearTimeout(minuteur);
      window.removeEventListener("resize", mesurer);
    };
  }, [compte, mesurer]);

  const terminer = () => {
    window.localStorage.setItem("treepi.tuto-vu", "1");
    router.replace("/app/accueil");
  };

  const suivant = () => (etape === etapes.length - 1 ? terminer() : setEtape(etape + 1));

  if (!session || !compte) return null;

  // Position de la bulle : sous le cadre, ou au-dessus s'il est trop bas.
  const bulleEnHaut = cadre ? cadre.y + cadre.h > window.innerHeight - 220 : false;

  return (
    <EcranApp className="bg-grey-light">
      <FondApp />
      <NavBarApp />

      {/* Tableau de bord figé sous la visite guidée. */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-md px-6 pb-28 pt-4" aria-hidden>
        <div className="flex flex-col gap-4">
          <EnTeteAccueil progression={compte.progressionProfil} />
          <CarteSolde soldeEuros={compte.soldeEuros} />
          <Bandeaux phase={compte.phase} />
          <Transactions transactions={compte.transactions} />
          <CarteAjoutVisa />
          <ServicesTreepi />
          <SimulateurTransfert />
          <CarteSupport />
        </div>
      </div>

      {/* Projecteur : le voile sombre est porté par l'ombre du cadre. */}
      {cadre && (
        <div className="fixed inset-0 z-40" onClick={suivant}>
          <div
            className="absolute rounded-xl shadow-[0_0_0_9999px_rgba(35,39,46,0.55)] transition-all duration-300"
            style={{ left: cadre.x, top: cadre.y, width: cadre.l, height: cadre.h }}
          />
          {/* Bulle d'explication. */}
          <div
            className="absolute z-10 w-[248px] animate-fade-in rounded-2xl bg-white p-4 text-sm leading-[22px] text-dark shadow-app"
            key={etape}
            style={
              bulleEnHaut
                ? { left: Math.max(16, cadre.x + 16), bottom: window.innerHeight - cadre.y + 12 }
                : { left: Math.max(16, cadre.x + 16), top: cadre.y + cadre.h + 12 }
            }
            onClick={(e) => e.stopPropagation()}
          >
            {etapes[etape].texte}
          </div>

          {/* Navigation de la visite. */}
          <div
            className="absolute inset-x-6 bottom-24 z-10 mx-auto flex max-w-md items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {etape > 0 && (
              <button
                type="button"
                aria-label={t("retour")}
                onClick={() => setEtape(etape - 1)}
                className="grid size-[46px] shrink-0 place-items-center rounded-full bg-primary-light transition-all hover:brightness-105"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/app/icons/arrow-left.svg" alt="" width={21} height={21} />
              </button>
            )}
            <button
              type="button"
              onClick={suivant}
              className="inline-flex h-[46px] w-full items-center justify-center rounded-full bg-primary-light text-sm font-bold text-white shadow-[0_4px_14px_rgba(9,209,199,0.35)] transition-all hover:brightness-105"
            >
              {etape === etapes.length - 1 ? t("terminer") : t("suivant")}
            </button>
          </div>
        </div>
      )}
    </EcranApp>
  );
}
