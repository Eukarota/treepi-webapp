import type { ReactNode } from "react";

/*
 * Petit rendu riche pour les messages du landing : les segments entourés
 * de doubles astérisques (**ainsi**) deviennent des <span> avec la classe
 * donnée (gras simple par défaut, ou dégradé de marque pour les cartes
 * sécurité). Évite de multiplier les balises dans les fichiers de messages.
 */
export function gras(texte: string, classe = "font-bold"): ReactNode[] {
  return texte.split(/\*\*(.+?)\*\*/g).map((morceau, i) =>
    i % 2 === 1 ? (
      <span key={i} className={classe}>
        {morceau}
      </span>
    ) : (
      morceau
    )
  );
}

/* Variante dégradé primaire (mots clés des cartes « Sécurité et fiabilité »). */
export function grasDegrade(texte: string): ReactNode[] {
  return gras(
    texte,
    "text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light font-bold"
  );
}
