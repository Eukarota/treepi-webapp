/*
 * Recharge du compte Euro (simulation).
 *
 * Contrat du futur backend : créer une recharge (carte / virement / espèces),
 * calculer les frais de gestion, tenir l'historique. La carte est créditée
 * immédiatement ; le virement et le dépôt en espèces restent « en cours »
 * jusqu'à réception des fonds (comme dans les maquettes).
 */

import { crediterImmediat } from "./compte";
import { ecrireStockage, genererId, latenceReseau, lireStockage } from "./client";

export type MethodeRecharge = "carte" | "virement" | "especes";

export interface Recharge {
  id: string;
  methode: MethodeRecharge;
  montantEuros: number;
  fraisEuros: number;
  statut: "effectuee" | "en-cours";
  reference: string;
  date: string;
}

/** Taux des frais de gestion (simulation) : 1,5 %, minimum 1 €. */
export const TAUX_FRAIS = 0.015;

export function fraisRecharge(montantEuros: number): number {
  if (montantEuros <= 0) return 0;
  return Math.round(Math.max(1, montantEuros * TAUX_FRAIS) * 100) / 100;
}

/** Référence de recharge à indiquer sur le virement / dépôt. */
export function referenceRecharge(): string {
  return "TRP-" + genererId().slice(0, 8).toUpperCase();
}

export function listerRecharges(): Recharge[] {
  return lireStockage<Recharge[]>("recharges") ?? [];
}

/**
 * Crée une recharge. Carte : créditée aussitôt (statut « effectuée »).
 * Virement / espèces : enregistrée « en cours » (créditée à réception).
 */
export async function creerRecharge(params: {
  methode: MethodeRecharge;
  montantEuros: number;
  reference?: string;
}): Promise<Recharge> {
  await latenceReseau();
  const instantanee = params.methode === "carte";
  const recharge: Recharge = {
    id: genererId(),
    methode: params.methode,
    montantEuros: params.montantEuros,
    fraisEuros: fraisRecharge(params.montantEuros),
    statut: instantanee ? "effectuee" : "en-cours",
    reference: params.reference ?? referenceRecharge(),
    date: new Date().toISOString(),
  };
  ecrireStockage("recharges", [recharge, ...listerRecharges()]);
  if (instantanee) {
    const libelle = { carte: "Recharge par carte", virement: "Virement reçu", especes: "Dépôt en espèces" }[params.methode];
    crediterImmediat(params.montantEuros, libelle, "recharge");
  }
  return recharge;
}
