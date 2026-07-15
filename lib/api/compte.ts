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
  /** Type d'icône : recharge (plus corail) ou conversion (flèches teal). */
  type: "recharge" | "conversion";
  titre: string;
  montantEuros: number;
  /** Date ISO complète. */
  date: string;
}

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
