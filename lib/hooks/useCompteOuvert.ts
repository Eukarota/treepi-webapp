"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { obtenirCompte } from "@/lib/api/compte";

/*
 * Garde des flux « argent » (Recharger, Recevoir, Virement, Attestation) :
 * ces écrans nécessitent un compte Euro actif (dossier signé + paiement
 * d'ouverture validé). Sinon, on redirige vers `/app/compte-euro`, qui
 * aiguille lui-même selon l'état (nouveau dossier, reprise du paiement ou
 * retour à l'accueil pendant la vérification). Le vrai backend appliquera le
 * même refus côté serveur (403 tant que le compte n'est pas actif), la garde
 * front n'est que le confort de navigation.
 */
export function useCompteOuvert(): boolean {
  const router = useRouter();
  // Lu au montage (rien côté serveur) ; l'état ne bouge pas pendant l'écran.
  const [ouvert] = useState(() => (typeof window === "undefined" ? true : Boolean(obtenirCompte().ouvert)));

  useEffect(() => {
    if (!ouvert) router.replace("/app/compte-euro");
  }, [ouvert, router]);

  return ouvert;
}
