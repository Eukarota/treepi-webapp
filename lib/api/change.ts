/*
 * Taux de change.
 *
 * Les taux courants sont récupérés en direct auprès d'un fournisseur public
 * (open.er-api.com, base EUR, sans clé) via `rafraichirTaux()`. La table
 * `DEVISES` ci-dessous ne sert plus que de secours : valeurs de repli tant que
 * la première requête n'a pas répondu, ou si le réseau échoue. Les fonctions de
 * conversion lisent toujours le dernier taux connu (réel s'il est arrivé, repli
 * sinon), ce qui les garde synchrones pour le rendu.
 *
 * L'historique reste une série déterministe (aucun fournisseur gratuit sans clé
 * ne donne l'historique de ces devises), mais elle est ancrée sur le taux réel
 * courant : la courbe converge vers la vraie valeur du jour.
 *
 * Brancher le backend : remplacer l'URL/le parsing de `rafraichirTaux()` par
 * l'endpoint interne (voir docs/BACKEND.md).
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

/**
 * Devises proposées, centrées sur le public de Treepi (monnaies africaines)
 * puis élargies aux devises de destination et de référence. Le `tauxParEuro`
 * n'est plus qu'une valeur de secours (1 EUR = tauxParEuro) : le taux réel est
 * chargé au montage par `rafraichirTaux()` et vient l'écraser.
 */
export const DEVISES: Devise[] = [
  // Afrique de l'Ouest et centrale (francs CFA à parité fixe avec l'euro).
  { code: "XOF", symbole: "CFA", nom: "Franc CFA (UEMOA)", tauxParEuro: 655.957, couleur: "#16a34a" },
  { code: "XAF", symbole: "CFA", nom: "Franc CFA (CEMAC)", tauxParEuro: 655.957, couleur: "#0d9488" },
  // Maghreb.
  { code: "MAD", symbole: "DH", nom: "Dirham marocain", tauxParEuro: 10.85, couleur: "#c2410c" },
  { code: "DZD", symbole: "DA", nom: "Dinar algérien", tauxParEuro: 145, couleur: "#047857" },
  { code: "TND", symbole: "DT", nom: "Dinar tunisien", tauxParEuro: 3.4, couleur: "#9a3412" },
  { code: "EGP", symbole: "£E", nom: "Livre égyptienne", tauxParEuro: 53, couleur: "#a16207" },
  // Afrique anglophone et de l'Est.
  { code: "NGN", symbole: "₦", nom: "Naira nigérian", tauxParEuro: 1750, couleur: "#0f766e" },
  { code: "GHS", symbole: "₵", nom: "Cedi ghanéen", tauxParEuro: 16.2, couleur: "#b45309" },
  { code: "KES", symbole: "KSh", nom: "Shilling kényan", tauxParEuro: 140, couleur: "#065f46" },
  { code: "UGX", symbole: "USh", nom: "Shilling ougandais", tauxParEuro: 4000, couleur: "#7e22ce" },
  { code: "TZS", symbole: "TSh", nom: "Shilling tanzanien", tauxParEuro: 2900, couleur: "#b91c1c" },
  { code: "RWF", symbole: "RF", nom: "Franc rwandais", tauxParEuro: 1450, couleur: "#0e7490" },
  { code: "ETB", symbole: "Br", nom: "Birr éthiopien", tauxParEuro: 130, couleur: "#ca8a04" },
  { code: "CDF", symbole: "FC", nom: "Franc congolais", tauxParEuro: 3050, couleur: "#4d7c0f" },
  { code: "ZAR", symbole: "R", nom: "Rand sud-africain", tauxParEuro: 19.5, couleur: "#1d4ed8" },
  // Devises de destination et de référence.
  { code: "EUR", symbole: "€", nom: "Euro", tauxParEuro: 1, couleur: "#2f6df6" },
  { code: "USD", symbole: "$", nom: "Dollar américain", tauxParEuro: 1.08, couleur: "#15803d" },
  { code: "GBP", symbole: "£", nom: "Livre sterling", tauxParEuro: 0.85, couleur: "#7c3aed" },
  { code: "CAD", symbole: "C$", nom: "Dollar canadien", tauxParEuro: 1.47, couleur: "#be123c" },
];

export function trouverDevise(code: string): Devise {
  return DEVISES.find((d) => d.code === code) ?? DEVISES[0];
}

/*
 * ── Taux vivants ────────────────────────────────────────────────────────────
 * Table mutable des taux (1 EUR = ? unités), initialisée sur les valeurs de
 * secours de DEVISES puis mise à jour par `rafraichirTaux()`. Les composants
 * s'abonnent via `abonnerTaux` (voir lib/hooks/useTaux.ts) pour se recalculer
 * quand les taux réels arrivent ou changent.
 */
const tauxVivants = new Map<string, number>(DEVISES.map((d) => [d.code, d.tauxParEuro]));
/** Horodatage (ms) de la dernière mise à jour réussie, `null` si encore au repli. */
let derniereMaj: number | null = null;
const abonnes = new Set<() => void>();

function notifier(): void {
  for (const cb of abonnes) cb();
}

/** S'abonne aux mises à jour de taux ; renvoie la fonction de désabonnement. */
export function abonnerTaux(cb: () => void): () => void {
  abonnes.add(cb);
  return () => {
    abonnes.delete(cb);
  };
}

/** Horodatage (ms) du dernier taux réel reçu, ou `null` si on est encore au repli. */
export function tauxDerniereMaj(): number | null {
  return derniereMaj;
}

/** Taux vivant d'une devise (1 EUR = ?), repli sur la valeur de DEVISES. */
export function tauxParEuro(code: string): number {
  return tauxVivants.get(code) ?? trouverDevise(code).tauxParEuro;
}

/** Fournisseur public de taux réels, base EUR, sans clé. */
const URL_TAUX = "https://open.er-api.com/v6/latest/EUR";
/** Requête en vol partagée : évite les appels concurrents redondants. */
let requeteEnCours: Promise<void> | null = null;

/**
 * Récupère les taux réels et met à jour la table vivante. Idempotent tant qu'une
 * requête est déjà en vol (retourne la même promesse). En cas d'échec réseau on
 * conserve silencieusement les derniers taux connus (réels ou repli).
 */
export function rafraichirTaux(): Promise<void> {
  if (requeteEnCours) return requeteEnCours;
  requeteEnCours = (async () => {
    try {
      const reponse = await fetch(URL_TAUX, { cache: "no-store" });
      const data = (await reponse.json()) as {
        result?: string;
        rates?: Record<string, number>;
        time_last_update_unix?: number;
      };
      if (data.result !== "success" || !data.rates) return;
      for (const devise of DEVISES) {
        const taux = data.rates[devise.code];
        if (typeof taux === "number" && taux > 0) tauxVivants.set(devise.code, taux);
      }
      // L'horodatage change à chaque récupération : les abonnés se recalculent.
      derniereMaj = data.time_last_update_unix ? data.time_last_update_unix * 1000 : Date.now();
      notifier();
    } catch {
      // Réseau indisponible : on garde les taux en place, aucune interruption.
    } finally {
      requeteEnCours = null;
    }
  })();
  return requeteEnCours;
}

/** Taux : 1 unité de `source` vaut ? unités de `cible` (dernier taux connu). */
export function tauxEntre(source: string, cible: string): number {
  return tauxParEuro(cible) / tauxParEuro(source);
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
