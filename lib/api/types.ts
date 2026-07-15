/*
 * Types partagés de la couche API.
 *
 * Le backend n'existe pas encore : ces types décrivent le contrat que le
 * futur backend devra honorer. Toute la partie applicative (écrans, contexte
 * de session) ne dépend que de ces types et des signatures de lib/api, si
 * bien que le passage du mock au vrai backend se fera sans toucher aux
 * écrans (voir lib/api/client.ts).
 */

/** Utilisateur connu de la plateforme. */
export interface Utilisateur {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  /** Civilité déclarée à l'inscription. */
  genre: "homme" | "femme";
  /** Date de naissance au format ISO (AAAA-MM-JJ). */
  dateNaissance: string;
  paysResidence: string;
  villeResidence: string;
  nationalite: string;
  /** Indicatif + numéro, ex. "+225 07 00 00 00 00". */
  telephone: string;
  /** Progression du parcours (compte euro, activation, etc.). */
  statut: "inscrit" | "compte-euro-en-cours" | "actif";
}

/** Session active côté client. */
export interface Session {
  utilisateur: Utilisateur;
  /** Jeton factice ; deviendra un vrai jeton (JWT/cookie) avec le backend. */
  jeton: string;
}

/** Résultat générique d'un appel API : succès typé ou erreur lisible. */
export type ResultatApi<T> =
  | { ok: true; donnees: T }
  | { ok: false; erreur: string; code?: CodeErreurApi };

/** Codes d'erreur que les écrans savent interpréter. */
export type CodeErreurApi =
  | "identifiants-invalides"
  | "compte-verrouille"
  | "email-deja-utilise"
  | "otp-invalide"
  | "otp-expire"
  | "inconnu";

/** Données collectées au fil des étapes d'inscription. */
export interface BrouillonInscription {
  email?: string;
  motDePasse?: string;
  genre?: "homme" | "femme";
  prenom?: string;
  nom?: string;
  dateNaissance?: string;
  paysResidence?: string;
  villeResidence?: string;
  villeNaissance?: string;
  nationalite?: string;
  telephone?: string;
}
