"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/*
 * Bouton de l'application (composant Figma « Primary » / « Neutral »).
 *
 * Contrairement aux boutons du site marketing (coins arrondis 12px), les
 * boutons de l'app sont des pilules pleines hauteur 46px :
 *  – primaire : turquoise plein, texte blanc Inter Bold 14 ;
 *  – désactivé : turquoise très clair (état « Primary/Disabled » Figma) ;
 *  – neutre : transparent, texte gris 700 Inter SemiBold 14 ;
 *  – icône : pilule circulaire 46x46 (ex. retour du walkthrough).
 */

type Variante = "primaire" | "neutre";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  /** Rend une pilule circulaire 46x46 (contenu = icône seule). */
  icone?: boolean;
  children: ReactNode;
}

const BASE =
  "inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full text-sm leading-tight " +
  "transition-all duration-200 ease-out select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none";

const VARIANTES: Record<Variante, string> = {
  // « Primary » : turquoise plein, désactivé = turquoise 100.
  primaire:
    "bg-primary-light font-bold text-white shadow-[0_4px_14px_rgba(9,209,199,0.25)] " +
    "hover:brightness-105 hover:shadow-[0_8px_24px_rgba(9,209,199,0.35)] active:brightness-95 " +
    "disabled:bg-primary-lighter disabled:shadow-none",
  // « Neutral » : simple texte gris, léger fond au survol.
  neutre: "bg-transparent font-semibold text-grey-700 hover:bg-grey-light active:bg-grey-100",
};

export default function BoutonApp({
  variante = "primaire",
  icone = false,
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      className={
        `${BASE} ${VARIANTES[variante]} ` +
        (icone ? "size-[46px] shrink-0 px-0" : "w-full px-[14px]") +
        (className ? ` ${className}` : "")
      }
      {...props}
    >
      {children}
    </button>
  );
}
