"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

/*
 * Modale de l'application (maquettes « Modal » : réinitialisation du mot de
 * passe, confirmations...) : carte blanche arrondie posée sur un voile
 * sombre, croix de fermeture en haut à droite, titre Outfit Bold 16 dont le
 * mot-clé porte le dégradé corail, corps Inter 14, action en pilule.
 */
export default function ModaleApp({
  ouverte,
  onFermer,
  titreAvant,
  titreCle,
  children,
  libelleFermer,
}: {
  ouverte: boolean;
  onFermer: () => void;
  /** Début du titre en gris 950, puis mot-clé au dégradé corail. */
  titreAvant: string;
  titreCle: string;
  children: ReactNode;
  /** Libellé accessible de la croix de fermeture. */
  libelleFermer: string;
}) {
  // Fermeture au clavier (Échap), comme attendu d'une modale accessible.
  useEffect(() => {
    if (!ouverte) return;
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && onFermer();
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [ouverte, onFermer]);

  if (!ouverte) return null;

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-dark/40 px-6"
      role="dialog"
      aria-modal="true"
      onClick={onFermer}
    >
      <div
        className="w-full max-w-[280px] animate-fade-in rounded-2xl bg-white p-4 shadow-app"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-outfit text-base font-bold leading-6 text-dark">
            {titreAvant}
            <span className="text-gradient-secondary">{titreCle}</span>
          </h2>
          <button
            type="button"
            onClick={onFermer}
            aria-label={libelleFermer}
            className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-xl leading-none text-dark transition-colors hover:bg-grey-light"
          >
            ×
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-5 text-sm leading-[22px] text-dark">{children}</div>
      </div>
    </div>
  );
}
