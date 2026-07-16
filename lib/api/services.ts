/*
 * API des services voyage & visa (simulation) : attestation de garantie
 * financière, accompagnement expert, recours visa et assurance voyage. Le vrai
 * backend générera les documents, planifiera les rendez-vous et créera les
 * abonnements. Ici tout est simulé (latence + persistance localStorage).
 */

import { definirVisaAjoute } from "./compte";
import { ecrireStockage, genererId, latenceReseau, lireStockage } from "./client";

/* --- Attestation de garantie financière -------------------------------- */

export interface Attestation {
  id: string;
  reference: string;
  /** Montant garanti (solde du compte Euro au moment de la génération). */
  montant: number;
  pays: string;
  motif: string;
  dateDepart: string;
  dateRetour: string;
  /** Date ISO de génération. */
  dateISO: string;
}

/** Référence lisible d'attestation (« ATT-XXXXXXXX »). */
export function referenceAttestation(): string {
  return "ATT-" + genererId().slice(0, 8).toUpperCase();
}

export function listerAttestations(): Attestation[] {
  return lireStockage<Attestation[]>("attestations") ?? [];
}

export async function genererAttestation(infos: Omit<Attestation, "id" | "reference" | "dateISO">): Promise<Attestation> {
  await latenceReseau();
  const attestation: Attestation = { ...infos, id: genererId(), reference: referenceAttestation(), dateISO: new Date().toISOString() };
  ecrireStockage("attestations", [attestation, ...listerAttestations()]);
  return attestation;
}

/* --- Accompagnement expert --------------------------------------------- */

export type PackAccId = "solo" | "famille" | "parent";
/** Canal de rendez-vous (téléphone ou bureau). */
export type CanalRdv = "telephone" | "bureau";

export const PACKS_ACCOMPAGNEMENT: { id: PackAccId; prix: number }[] = [
  { id: "solo", prix: 100 },
  { id: "famille", prix: 150 },
  { id: "parent", prix: 120 },
];

export function trouverPackAcc(id: PackAccId): { id: PackAccId; prix: number } {
  return PACKS_ACCOMPAGNEMENT.find((p) => p.id === id) ?? PACKS_ACCOMPAGNEMENT[0];
}

export async function reserverAccompagnement(infos: { canal: CanalRdv; packId: PackAccId }): Promise<{ reference: string }> {
  await latenceReseau();
  const reference = "RDV-" + genererId().slice(0, 6).toUpperCase();
  ecrireStockage("accompagnement", { ...infos, reference, dateISO: new Date().toISOString() });
  return { reference };
}

/* --- Recours visa & assurance voyage (abonnements) --------------------- */

export type ServiceId = "recours" | "assurance";
/** Prix annuel des abonnements de service. */
export const PRIX_SERVICE: Record<ServiceId, number> = { recours: 500, assurance: 90 };

export function servicesSouscrits(): ServiceId[] {
  return lireStockage<ServiceId[]>("services-souscrits") ?? [];
}

export async function souscrireService(id: ServiceId): Promise<{ id: ServiceId; prix: number }> {
  await latenceReseau();
  const actuels = servicesSouscrits();
  if (!actuels.includes(id)) ecrireStockage("services-souscrits", [...actuels, id]);
  return { id, prix: PRIX_SERVICE[id] };
}

/* --- Obtention de visa (dépôt du dossier) ------------------------------ */

/** Soumet le dossier de visa : bascule le tableau de bord en phase post-visa. */
export async function soumettreVisa(): Promise<void> {
  await latenceReseau();
  definirVisaAjoute(true);
}
