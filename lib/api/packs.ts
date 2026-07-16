/*
 * API des packs Treepi (simulation).
 *
 * Les trois offres annuelles proposées à l'ouverture du compte Euro (écran
 * « De quoi as-tu besoin ? ») correspondent aux grandes fonctionnalités du
 * produit :
 *  – « compte »      : compte Euro + carte (80 €/an) ;
 *  – « attestation » : attestation de garantie financière illimitée (210 €/an,
 *    l'offre « Populaire ») ;
 *  – « recours »     : assurance recours visa jusqu'à 15 000 € (500 €/an).
 *
 * Ce module ne porte que les données structurelles (identifiant, prix, badge).
 * Le contenu marketing (nom, accroche, listes d'avantages) vit dans les
 * messages i18n `app.flux.packs.liste`, indexé par `id`.
 */

import { ecrireStockage, latenceReseau, lireStockage } from "./client";

export type PackId = "compte" | "attestation" | "recours";

export interface Pack {
  id: PackId;
  /** Prix annuel en euros (sert au paiement simulé). */
  prixAnnuel: number;
  /** Offre mise en avant (badge « Populaire »). */
  populaire?: boolean;
}

/** Catalogue des packs, dans l'ordre d'affichage de la maquette. */
export const PACKS: Pack[] = [
  { id: "compte", prixAnnuel: 80 },
  { id: "attestation", prixAnnuel: 210, populaire: true },
  { id: "recours", prixAnnuel: 500 },
];

/** Retrouve un pack par identifiant. */
export function trouverPack(id: PackId): Pack {
  return PACKS.find((p) => p.id === id) ?? PACKS[0];
}

/** Pack actuellement souscrit (null si aucun). */
export function packChoisi(): PackId | null {
  return lireStockage<PackId>("pack");
}

/**
 * Souscrit à un pack (paiement annuel simulé). Le vrai backend créera
 * l'abonnement et déclenchera le prélèvement. Renvoie l'identifiant retenu.
 */
export async function souscrirePack(id: PackId): Promise<{ id: PackId; prixAnnuel: number }> {
  await latenceReseau();
  ecrireStockage("pack", id);
  return { id, prixAnnuel: trouverPack(id).prixAnnuel };
}
