/*
 * Taux de change (simulation).
 *
 * Le futur backend fournira les taux temps réel et l'historique via un
 * fournisseur de change ; ici on expose une table de référence fixe et une
 * série historique déterministe (taux indicatif) pour faire fonctionner le
 * simulateur du tableau de bord. Brancher le backend = remplacer ces corps.
 */

export interface Devise {
  code: string;
  /** Symbole court affiché dans la pastille (1 à 3 caractères). */
  symbole: string;
  nom: string;
  /** 1 EUR = `tauxParEuro` unités de cette devise. */
  tauxParEuro: number;
  /** Couleur de fond de la pastille. */
  couleur: string;
}

/** Devises proposées, centrées sur le public de Treepi puis destinations. */
export const DEVISES: Devise[] = [
  { code: "XOF", symbole: "CFA", nom: "Franc CFA (UEMOA)", tauxParEuro: 655.957, couleur: "#16a34a" },
  { code: "EUR", symbole: "€", nom: "Euro", tauxParEuro: 1, couleur: "#2f6df6" },
  { code: "USD", symbole: "$", nom: "Dollar américain", tauxParEuro: 1.08, couleur: "#15803d" },
  { code: "GBP", symbole: "£", nom: "Livre sterling", tauxParEuro: 0.85, couleur: "#7c3aed" },
  { code: "MAD", symbole: "DH", nom: "Dirham marocain", tauxParEuro: 10.85, couleur: "#c2410c" },
  { code: "NGN", symbole: "₦", nom: "Naira nigérian", tauxParEuro: 1750, couleur: "#0f766e" },
  { code: "GHS", symbole: "₵", nom: "Cedi ghanéen", tauxParEuro: 16.2, couleur: "#b45309" },
  { code: "CAD", symbole: "C$", nom: "Dollar canadien", tauxParEuro: 1.47, couleur: "#be123c" },
];

export function trouverDevise(code: string): Devise {
  return DEVISES.find((d) => d.code === code) ?? DEVISES[0];
}

/** Taux : 1 unité de `source` vaut ? unités de `cible`. */
export function tauxEntre(source: string, cible: string): number {
  return trouverDevise(cible).tauxParEuro / trouverDevise(source).tauxParEuro;
}

/** Convertit un montant de `source` vers `cible`. */
export function convertir(montant: number, source: string, cible: string): number {
  return montant * tauxEntre(source, cible);
}

/** Bruit déterministe dans [0,1[ (même valeur côté serveur et client). */
function bruit(x: number): number {
  const v = Math.sin(x * 12.9898) * 43758.5453;
  return v - Math.floor(v);
}

/** Graine numérique stable à partir d'une chaîne (paire de devises). */
function graine(texte: string): number {
  let h = 0;
  for (let i = 0; i < texte.length; i++) h = (h * 31 + texte.charCodeAt(i)) % 100000;
  return h;
}

/**
 * Série historique simulée du taux `source`→`cible` sur `jours` jours : marche
 * aléatoire douce autour du taux courant, déterministe par paire (pas de
 * Math.random, pour un rendu stable serveur/client). Se termine sur le taux
 * courant affiché.
 */
export function historiqueTaux(source: string, cible: string, jours = 30): number[] {
  const base = tauxEntre(source, cible);
  const g = graine(source + cible);
  const points: number[] = [];
  let v = base * (0.97 + bruit(g) * 0.02);
  for (let i = 0; i < jours; i++) {
    v += (bruit(g + i * 7.13) - 0.5) * base * 0.012; // pas de la marche
    v += (base - v) * 0.06; // rappel doux vers le taux courant
    points.push(v);
  }
  points[points.length - 1] = base;
  return points;
}
