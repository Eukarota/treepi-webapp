/*
 * API des packs Treepi (simulation).
 *
 * Les deux offres annuelles proposées à l'ouverture du compte Euro (écran
 * « De quoi as-tu besoin ? ») :
 *  – « compte »      : compte Euro + carte (80 €/an). À l'étape paiement de
 *    l'ouverture, seuls les frais de gestion sont réglés ; le compte s'active
 *    à solde nul et l'attestation reste une option payante (100 €/an) ;
 *  – « attestation » : compte Euro + preuve de fonds (210 €/an, l'offre
 *    « Populaire »). L'étape paiement est la première recharge « Financer mon
 *    voyage » (frais inclus dans le total) et l'attestation est incluse.
 * L'ancien pack « recours » (500 €/an) est retiré de l'offre ; le service
 * recours visa reste souscriptible à part (lib/api/services.ts).
 *
 * Ce module ne porte que les données structurelles (identifiant, prix, badge).
 * Le contenu marketing (nom, accroche, listes d'avantages) vit dans les
 * messages i18n `app.flux.packs.liste`, indexé par `id`.
 */

import { ecrireStockage, latenceReseau, lireStockage } from "./client";

export type PackId = "compte" | "attestation";

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
