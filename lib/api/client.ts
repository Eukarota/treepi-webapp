/*
 * « Transport » de la couche API.
 *
 * Aujourd'hui : simulation locale (latence artificielle + persistance
 * localStorage) pour que l'application soit entièrement navigable sans
 * backend. Demain : il suffira de remplacer les implémentations de
 * lib/api/auth.ts par des appels fetch vers l'API réelle ; les écrans
 * consomment uniquement les signatures, jamais ce fichier directement.
 */

/** Latence simulée pour rendre les transitions réalistes (ms). */
const LATENCE_MIN = 350;
const LATENCE_MAX = 750;

/** Attend une durée aléatoire, comme un aller-retour réseau. */
export function latenceReseau(): Promise<void> {
  const duree = LATENCE_MIN + Math.random() * (LATENCE_MAX - LATENCE_MIN);
  return new Promise((resoudre) => setTimeout(resoudre, duree));
}

/** Préfixe commun des clés localStorage de la simulation. */
const PREFIXE = "treepi.mock.";

/** Lit une valeur JSON persistée par la simulation (null si absente). */
export function lireStockage<T>(cle: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const brut = window.localStorage.getItem(PREFIXE + cle);
    return brut ? (JSON.parse(brut) as T) : null;
  } catch {
    return null;
  }
}

/** Écrit une valeur JSON dans le stockage de la simulation. */
export function ecrireStockage<T>(cle: string, valeur: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFIXE + cle, JSON.stringify(valeur));
}

/** Supprime une valeur du stockage de la simulation. */
export function effacerStockage(cle: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PREFIXE + cle);
}

/** Petit générateur d'identifiants uniques pour les entités simulées. */
export function genererId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
