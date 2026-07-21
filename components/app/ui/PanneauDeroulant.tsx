"use client";

import { CSSProperties, ReactNode, RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/*
 * Panneau flottant des listes déroulantes (SelecteurListe, SelecteurIndicatif).
 * Rendu dans un portail vers <body> en position fixe : il déborde librement
 * des conteneurs à coins arrondis / overflow-hidden des feuilles de flux et
 * passe au-dessus de tout (z-50). Calé sous l'ancre, il bascule au-dessus
 * quand la place manque en bas de l'écran ; la position suit le défilement
 * et le redimensionnement. Gère la fermeture au clic extérieur et à Échap.
 */
export default function PanneauDeroulant({
  ancre,
  largeur,
  onFermer,
  children,
}: {
  /** Conteneur du champ déclencheur : sert d'ancre de position et de zone exclue du clic extérieur. */
  ancre: RefObject<HTMLDivElement | null>;
  /** Largeur en px ; par défaut celle de l'ancre. */
  largeur?: number;
  onFermer: () => void;
  children: ReactNode;
}) {
  const panneau = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties | null>(null);

  // Position recalculée à l'ouverture puis à chaque défilement / redimensionnement.
  useLayoutEffect(() => {
    const placer = () => {
      const a = ancre.current;
      if (!a) return;
      const rect = a.getBoundingClientRect();
      const l = largeur ?? rect.width;
      // Borné au viewport pour ne jamais créer de débordement horizontal.
      const gauche = Math.max(8, Math.min(rect.left, window.innerWidth - l - 8));
      const placeDessous = window.innerHeight - rect.bottom;
      // ~290px = recherche + liste (max-h-52) ; au-dessous, on ouvre vers le haut.
      if (placeDessous < 300 && rect.top > placeDessous) {
        setStyle({ left: gauche, bottom: window.innerHeight - rect.top + 4, width: l });
      } else {
        setStyle({ left: gauche, top: rect.bottom + 4, width: l });
      }
    };
    placer();
    window.addEventListener("scroll", placer, true);
    window.addEventListener("resize", placer);
    return () => {
      window.removeEventListener("scroll", placer, true);
      window.removeEventListener("resize", placer);
    };
  }, [ancre, largeur]);

  // Fermeture au clic extérieur (ancre et panneau exclus) / Échap.
  useEffect(() => {
    const surClic = (e: MouseEvent) => {
      const cible = e.target as Node;
      if (ancre.current?.contains(cible) || panneau.current?.contains(cible)) return;
      onFermer();
    };
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && onFermer();
    window.addEventListener("mousedown", surClic);
    window.addEventListener("keydown", surTouche);
    return () => {
      window.removeEventListener("mousedown", surClic);
      window.removeEventListener("keydown", surTouche);
    };
  }, [ancre, onFermer]);

  if (!style) return null;

  return createPortal(
    <div
      ref={panneau}
      style={style}
      className="fixed z-50 overflow-hidden rounded-xl border border-grey-100 bg-white shadow-app"
    >
      {children}
    </div>,
    document.body,
  );
}
