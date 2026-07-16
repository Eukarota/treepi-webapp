"use client";

import { useState } from "react";
import NavBarApp from "@/components/app/accueil/NavBarApp";

/** Clé de persistance de l'état replié de la colonne latérale. */
const CLE_NAV_REPLIEE = "treepi.nav-repliee";

/*
 * Coquille des écrans connectés : porte la navigation (barre basse sur
 * mobile, colonne latérale repliable sur desktop) et décale le contenu de
 * la largeur de la colonne. La colonne est repliée par défaut (auto) ; dès
 * que l'utilisateur agit sur la poignée, son choix est conservé en
 * localStorage et persiste d'une page à l'autre.
 */
export default function CoquilleApp({
  children,
  barreMobile = true,
  flux = false,
}: {
  children: React.ReactNode;
  /** Afficher la barre de navigation basse sur mobile (faux dans les flux). */
  barreMobile?: boolean;
  /** Mode flux : le contenu occupe toute la hauteur (colonne desktop + panneau). */
  flux?: boolean;
}) {
  // Repliée par défaut ; on ne déplie que si l'utilisateur l'a choisi ("0").
  const [repliee, setRepliee] = useState(
    () => typeof window === "undefined" || window.localStorage.getItem(CLE_NAV_REPLIEE) !== "0",
  );

  const basculer = () => {
    setRepliee((r) => {
      window.localStorage.setItem(CLE_NAV_REPLIEE, r ? "0" : "1");
      return !r;
    });
  };

  return (
    <>
      <NavBarApp repliee={repliee} onBasculer={basculer} mobile={barreMobile} />
      <div
        className={
          (flux ? "flex flex-1 flex-col " : "") +
          "relative z-10 transition-[padding] duration-300 " +
          (repliee ? "lg:pl-20" : "lg:pl-56")
        }
      >
        {children}
      </div>
    </>
  );
}
