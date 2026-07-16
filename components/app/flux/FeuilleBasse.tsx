"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

/*
 * Feuille basse (bottom sheet) des flux : voile sombre + carte blanche qui
 * remonte du bas, avec poignée de glissement, titre optionnel (mot-clé au
 * dégradé corail) et contenu. Utilisée pour les encarts « Informations
 * utiles », les récapitulatifs et les sélecteurs.
 *
 * Positionnée en absolu : bornée au panneau du flux sur desktop, plein écran
 * sur mobile (comme le calendrier d'inscription).
 */
export default function FeuilleBasse({
  ouverte,
  onFermer,
  titreAvant,
  titreCle,
  children,
}: {
  ouverte: boolean;
  onFermer: () => void;
  titreAvant?: string;
  titreCle?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!ouverte) return;
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && onFermer();
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [ouverte, onFermer]);

  if (!ouverte) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-dark/40" role="dialog" aria-modal="true" onClick={onFermer}>
      <div className="animate-fade-in rounded-t-[28px] bg-white px-6 pb-8 pt-3 shadow-app" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto h-1 w-10 rounded-full bg-grey-200" />
        {(titreAvant || titreCle) && (
          <h2 className="mt-4 font-outfit text-base font-bold leading-6 text-dark">
            {titreAvant}
            {titreCle && <span className="text-gradient-secondary">{titreCle}</span>}
          </h2>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
