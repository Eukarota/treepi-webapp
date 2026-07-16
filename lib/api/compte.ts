/*
 * API du compte Euro (simulation).
 *
 * Contrat du futur backend : solde, transactions, phase du parcours visa.
 * La simulation persiste l'état en localStorage ; l'activation du compte
 * (écran « Félicitations ») crédite le compte comme dans les maquettes
 * « Pack 2 (option dépôt) » : +2750 € via une conversion XOF → EUR.
 */

import { ecrireStockage, genererId, latenceReseau, lireStockage } from "./client";

/** Mouvement affiché dans la liste « Transactions » du tableau de bord. */
export interface Transaction {
  id: string;
  /** Type d'icône : recharge (plus corail), conversion / virement (flèches teal). */
  type: "recharge" | "conversion" | "virement";
  titre: string;
  montantEuros: number;
  /** Sens du mouvement (défaut crédit) : détermine le signe + / -. */
  sens?: "credit" | "debit";
  /** Date ISO complète. */
  date: string;
}

/** Coordonnées bancaires (affichage RIB / IBAN). */
export interface Rib {
  titulaire: string;
  iban: string;
  bic: string;
  banque: string;
}

/**
 * Compte de dépôt Treepi (fixe) : cible des recharges par virement, comme sur
 * la maquette « Compte de dépôt Treepi ». Le vrai backend fournira un IBAN de
 * collecte et une référence de mandat par recharge.
 */
export const RIB_TREEPI: Rib = {
  titulaire: "Treepi SAS",
  iban: "FR76 3000 4000 0312 3456 7890 143",
  bic: "TREPFRPPXXX",
  banque: "Treepi Payments",
};

export interface CompteEuro {
  soldeEuros: number;
  transactions: Transaction[];
  /** Phase du voyageur : détermine le jeu de bannières du tableau de bord. */
  phase: "pre-visa" | "post-visa";
  /** L'utilisateur a-t-il renseigné son visa (carte « Ajouter mon visa »). */
  visaAjoute: boolean;
  /** Progression du profil (anneau autour de l'avatar), en %. */
  progressionProfil: number;
  /** Le compte Euro a-t-il été activé (écran « Félicitations »). */
  active: boolean;
}

/** Compte neuf : l'état « Frais de gestion » des maquettes (0 €, vide). */
const COMPTE_NEUF: CompteEuro = {
  soldeEuros: 0,
  transactions: [],
  phase: "pre-visa",
  visaAjoute: false,
  progressionProfil: 0,
  active: false,
};

/** Lit l'état du compte simulé (compte neuf par défaut). */
export function obtenirCompte(): CompteEuro {
  return lireStockage<CompteEuro>("compte") ?? COMPTE_NEUF;
}

/**
 * Active le compte Euro (fin du flux d'activation) : crédite le pack
 * comme sur la maquette « Pack 2 (option dépôt) ».
 */
export async function activerCompte(): Promise<CompteEuro> {
  await latenceReseau();
  const compte: CompteEuro = {
    ...obtenirCompte(),
    active: true,
    soldeEuros: 2750,
    transactions: [
      {
        id: genererId(),
        type: "recharge",
        titre: "XOF → EUR",
        montantEuros: 2750,
        date: "2026-04-12T20:38:00",
      },
      {
        id: genererId(),
        type: "conversion",
        titre: "Luise Vatton",
        montantEuros: 39.99,
        date: "2026-04-08T12:53:00",
      },
    ],
  };
  ecrireStockage("compte", compte);
  return compte;
}

/** Enregistre l'état du compte (persistance simulée). */
function enregistrerCompte(compte: CompteEuro): CompteEuro {
  ecrireStockage("compte", compte);
  return compte;
}

/** Ajoute un mouvement en tête de liste et met à jour le solde. */
function appliquerMouvement(
  montantEuros: number,
  titre: string,
  type: Transaction["type"],
  sens: "credit" | "debit",
  dateISO?: string
): CompteEuro {
  const compte = obtenirCompte();
  const mouvement: Transaction = {
    id: genererId(),
    type,
    titre,
    montantEuros,
    sens,
    date: dateISO ?? new Date().toISOString(),
  };
  const delta = sens === "credit" ? montantEuros : -montantEuros;
  return enregistrerCompte({
    ...compte,
    soldeEuros: Math.max(0, Math.round((compte.soldeEuros + delta) * 100) / 100),
    transactions: [mouvement, ...compte.transactions],
    active: true,
  });
}

/** Crédit immédiat (sans latence) : à utiliser après un appel API parent. */
export function crediterImmediat(
  montantEuros: number,
  titre: string,
  type: Transaction["type"] = "recharge",
  dateISO?: string
): CompteEuro {
  return appliquerMouvement(montantEuros, titre, type, "credit", dateISO);
}

/** Débit immédiat (sans latence). */
export function debiterImmediat(montantEuros: number, titre: string, type: Transaction["type"] = "virement"): CompteEuro {
  return appliquerMouvement(montantEuros, titre, type, "debit");
}

/** Crédite le compte (recharge, réception d'un virement...). */
export async function crediterCompte(
  montantEuros: number,
  titre: string,
  type: Transaction["type"] = "recharge",
  dateISO?: string
): Promise<CompteEuro> {
  await latenceReseau();
  return appliquerMouvement(montantEuros, titre, type, "credit", dateISO);
}

/** Débite le compte (virement émis...). */
export async function debiterCompte(
  montantEuros: number,
  titre: string,
  type: Transaction["type"] = "virement"
): Promise<CompteEuro> {
  await latenceReseau();
  return appliquerMouvement(montantEuros, titre, type, "debit");
}

/** Renseigne l'obtention du visa (bascule les bannières en post-visa). */
export function definirVisaAjoute(visaAjoute: boolean): CompteEuro {
  return enregistrerCompte({ ...obtenirCompte(), visaAjoute, phase: visaAjoute ? "post-visa" : "pre-visa" });
}

/** IBAN Treepi personnel de l'utilisateur (écran « Recevoir »). */
export function obtenirRibUtilisateur(utilisateur: { id: string; prenom: string; nom: string }): Rib {
  // IBAN déterministe à partir de l'identifiant (simulation).
  let graine = 0;
  for (let i = 0; i < utilisateur.id.length; i++) graine = (graine * 31 + utilisateur.id.charCodeAt(i)) % 1_000_000_000;
  const chiffres = graine.toString().padStart(9, "0");
  const iban = `FR76 3000 4${chiffres.slice(0, 3)} ${chiffres.slice(3, 7)} ${chiffres.slice(7, 9)}00 0${chiffres.slice(0, 2)} 0${chiffres.slice(2, 4)}`;
  return {
    titulaire: `${utilisateur.prenom} ${utilisateur.nom}`.trim() || "Compte Euro Treepi",
    iban,
    bic: "TREPFRPPXXX",
    banque: "Treepi Payments",
  };
}
