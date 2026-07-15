/*
 * API d'authentification (simulation).
 *
 * Contrat que le futur backend devra implémenter à l'identique : chaque
 * fonction correspondra à un endpoint (POST /auth/login, POST /auth/otp,
 * etc.). Les écrans n'importent que ces fonctions et les types de
 * lib/api/types.ts ; brancher le vrai backend = remplacer les corps.
 *
 * Comportement de la simulation :
 * - les comptes créés via l'inscription sont persistés en localStorage ;
 * - un compte de démonstration existe toujours : demo@treepi.app / Treepi2026! ;
 * - la connexion applique la règle des 3 tentatives (maquettes
 *   Login/Error/Tentative1-3) puis verrouille le compte ;
 * - le code OTP attendu est toujours 123456 (affiché nulle part : les
 *   maquettes prévoient un renvoi de code, le renvoi « fonctionne » donc).
 */

import {
  BrouillonInscription,
  ResultatApi,
  Session,
  Utilisateur,
} from "./types";
import {
  ecrireStockage,
  effacerStockage,
  genererId,
  latenceReseau,
  lireStockage,
} from "./client";

/** Compte interne : utilisateur + secret (jamais exposé aux écrans). */
interface CompteSimule {
  utilisateur: Utilisateur;
  motDePasse: string;
}

/** Code OTP accepté par la simulation. */
export const CODE_OTP_DEMO = "123456";

/** Nombre de tentatives de connexion avant verrouillage (cf. maquettes). */
export const MAX_TENTATIVES = 3;

/** Compte de démonstration toujours disponible. */
const COMPTE_DEMO: CompteSimule = {
  motDePasse: "Treepi2026!",
  utilisateur: {
    id: "demo",
    email: "demo@treepi.app",
    prenom: "Awa",
    nom: "Diallo",
    genre: "femme",
    dateNaissance: "2001-04-12",
    paysResidence: "Côte d'Ivoire",
    villeResidence: "Abidjan",
    nationalite: "Ivoirienne",
    telephone: "+225 07 00 00 00 00",
    statut: "inscrit",
  },
};

/** Charge tous les comptes connus (démo + comptes créés localement). */
function chargerComptes(): CompteSimule[] {
  const crees = lireStockage<CompteSimule[]>("comptes") ?? [];
  return [COMPTE_DEMO, ...crees];
}

/** Compteur de tentatives ratées par email. */
function tentativesRatees(email: string): number {
  return lireStockage<Record<string, number>>("tentatives")?.[email] ?? 0;
}

function memoriserTentatives(email: string, nombre: number): void {
  const tout = lireStockage<Record<string, number>>("tentatives") ?? {};
  tout[email] = nombre;
  ecrireStockage("tentatives", tout);
}

/**
 * Connexion par email + mot de passe.
 * Applique la règle des 3 tentatives puis renvoie "compte-verrouille".
 */
/**
 * MODE TEST : tant que le backend n'existe pas, la connexion réussit
 * toujours pour permettre de naviguer dans l'app. Si l'email correspond à
 * un compte connu, on le charge ; sinon on fabrique un utilisateur de test
 * à la volée. Repasser à false pour retrouver la règle des 3 tentatives.
 */
const AUTH_TOUJOURS_OK = true;

export async function seConnecter(
  email: string,
  motDePasse: string
): Promise<ResultatApi<Session> & { tentativesRestantes?: number }> {
  await latenceReseau();
  const emailNormalise = email.trim().toLowerCase();
  const compte = chargerComptes().find((c) => c.utilisateur.email === emailNormalise);

  if (!AUTH_TOUJOURS_OK) {
    if (tentativesRatees(emailNormalise) >= MAX_TENTATIVES) {
      return { ok: false, erreur: "Compte temporairement verrouillé.", code: "compte-verrouille" };
    }
    if (!compte || compte.motDePasse !== motDePasse) {
      const ratees = tentativesRatees(emailNormalise) + 1;
      memoriserTentatives(emailNormalise, ratees);
      if (ratees >= MAX_TENTATIVES) {
        return { ok: false, erreur: "Compte temporairement verrouillé.", code: "compte-verrouille", tentativesRestantes: 0 };
      }
      return {
        ok: false,
        erreur: "Email ou mot de passe incorrect.",
        code: "identifiants-invalides",
        tentativesRestantes: MAX_TENTATIVES - ratees,
      };
    }
  }

  // Compte connu ou utilisateur de test improvisé (MODE TEST).
  const utilisateur: Utilisateur = compte
    ? compte.utilisateur
    : { ...COMPTE_DEMO.utilisateur, id: genererId(), email: emailNormalise || COMPTE_DEMO.utilisateur.email };

  memoriserTentatives(emailNormalise, 0);
  const session: Session = { utilisateur, jeton: genererId() };
  ecrireStockage("session", session);
  return { ok: true, donnees: session };
}

/** Déconnexion : efface la session simulée. */
export async function seDeconnecter(): Promise<void> {
  effacerStockage("session");
}

/** Restaure la session persistée (null si déconnecté). */
export function sessionCourante(): Session | null {
  return lireStockage<Session>("session");
}

/** Demande d'envoi d'un code OTP à l'adresse fournie. */
export async function demanderOtp(email: string): Promise<ResultatApi<{ envoyeA: string }>> {
  await latenceReseau();
  const emailNormalise = email.trim().toLowerCase();
  if (chargerComptes().some((c) => c.utilisateur.email === emailNormalise)) {
    return { ok: false, erreur: "Un compte existe déjà avec cet email.", code: "email-deja-utilise" };
  }
  return { ok: true, donnees: { envoyeA: emailNormalise } };
}

/** Vérifie le code OTP saisi (simulation : 123456). */
export async function verifierOtp(email: string, code: string): Promise<ResultatApi<null>> {
  await latenceReseau();
  if (code !== CODE_OTP_DEMO) {
    return { ok: false, erreur: "Code incorrect. Vérifie ta boîte mail.", code: "otp-invalide" };
  }
  return { ok: true, donnees: null };
}

/** Demande de réinitialisation du mot de passe (toujours « envoyée »). */
export async function reinitialiserMotDePasse(email: string): Promise<ResultatApi<null>> {
  await latenceReseau();
  return { ok: true, donnees: null };
}

/**
 * Création du compte à la fin du flux d'inscription.
 * Le brouillon doit être complet (le stepper garantit chaque étape).
 */
export async function creerCompte(
  brouillon: BrouillonInscription
): Promise<ResultatApi<Session>> {
  await latenceReseau();
  const email = brouillon.email?.trim().toLowerCase();
  if (!email || !brouillon.motDePasse) {
    return { ok: false, erreur: "Inscription incomplète.", code: "inconnu" };
  }
  if (chargerComptes().some((c) => c.utilisateur.email === email)) {
    return { ok: false, erreur: "Un compte existe déjà avec cet email.", code: "email-deja-utilise" };
  }

  const utilisateur: Utilisateur = {
    id: genererId(),
    email,
    prenom: brouillon.prenom ?? "",
    nom: brouillon.nom ?? "",
    genre: brouillon.genre ?? "homme",
    dateNaissance: brouillon.dateNaissance ?? "",
    paysResidence: brouillon.paysResidence ?? "",
    villeResidence: brouillon.villeResidence ?? "",
    nationalite: brouillon.nationalite ?? "",
    telephone: brouillon.telephone ?? "",
    statut: "inscrit",
  };

  const crees = lireStockage<CompteSimule[]>("comptes") ?? [];
  crees.push({ utilisateur, motDePasse: brouillon.motDePasse });
  ecrireStockage("comptes", crees);

  const session: Session = { utilisateur, jeton: genererId() };
  ecrireStockage("session", session);
  return { ok: true, donnees: session };
}
