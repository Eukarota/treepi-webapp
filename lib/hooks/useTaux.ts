"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import { abonnerTaux, rafraichirTaux, tauxDerniereMaj } from "@/lib/api/change";

/*
 * Alimente les écrans en taux de change temps réel. Au montage, déclenche une
 * récupération auprès du fournisseur puis rafraîchit périodiquement ; via
 * `useSyncExternalStore`, tout composant qui appelle ce hook se recalcule dès
 * qu'un nouveau taux arrive (les fonctions `convertir`/`tauxEntre` liront alors
 * la valeur à jour). SSR-safe : `null` côté serveur et au premier rendu client
 * (les taux ne se chargent que côté navigateur), donc pas d'écart d'hydratation.
 */

/** Intervalle de rafraîchissement des taux (ms). Le fournisseur gratuit
 * publie une fois par jour ; 5 min suffisent largement à rester frais. */
const INTERVALLE_MAJ = 5 * 60 * 1000;

/**
 * Branche le composant appelant sur les taux temps réel et renvoie
 * l'horodatage (ms) du dernier taux réel reçu, ou `null` tant qu'on est au repli.
 */
export function useTauxTempsReel(): number | null {
  useEffect(() => {
    rafraichirTaux();
    const id = setInterval(rafraichirTaux, INTERVALLE_MAJ);
    // Rafraîchit aussi au retour d'onglet (les taux ont pu bouger).
    const auRetour = () => {
      if (document.visibilityState === "visible") rafraichirTaux();
    };
    document.addEventListener("visibilitychange", auRetour);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", auRetour);
    };
  }, []);

  return useSyncExternalStore(abonnerTaux, tauxDerniereMaj, () => null);
}
