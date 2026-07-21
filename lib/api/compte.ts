/*
 * API du compte Euro (simulation).
 *
 * Contrat du futur backend : solde, transactions, phase du parcours visa.
 * Le compte Euro est un produit payant qui suit la checklist d'ouverture des
 * maquettes (« Compléter tes infos, Signer ton contrat, Effectuer ton
 * paiement, Bienvenue sur Treepi ») :
 *  1. `ouvrirCompteEuro` clôt le dossier (pack + KYC + signature) →
 *     `attente-paiement` ;
 *  2. `soumettrePaiementOuverture` enregistre le money-in et son justificatif
 *     (frais seuls pour le pack « compte », première recharge « Financer mon
 *     voyage » avec conformité financeur/provenance pour le pack
 *     « attestation ») → `attente-validation` ;
 *  3. la validation (15 min à 24 h ouvrées en réel, ~25 s simulées dans
 *     `obtenirCompte`) active le compte et crédite le montant rechargé.
 * Aucun prélèvement différé : les frais du pack sont payés dans le money-in
 * d'onboarding, jamais débités du solde.
 */

import { ecrireStockage, genererId, latenceReseau, lireStockage } from "./client";
import { trouverPack, type PackId } from "./packs";

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

/**
 * Informations recueillies pendant l'ouverture du compte Euro (KYC) : identité
 * (passeport) et situation, qui alimentent les volets « À renseigner » du
 * profil. Le vrai backend les vérifiera auprès d'un prestataire d'identité.
 */
export interface InfosKyc {
  passeportNumero: string;
  paysDelivrance: string;
  expiration: string;
  /** Situation professionnelle déclarée (salarié, indépendant, étudiant...). */
  situationPro?: string;
  /** Secteur d'activité déclaré. */
  secteur?: string;
  /** Revenu mensuel net déclaré, en euros. */
  revenuMensuel?: string;
  /** Tranche de patrimoine déclarée. */
  patrimoine?: string;
  /** Certifie ne pas être une « US person » (réglementation FATCA). */
  usPerson?: boolean;
  /** Certifie ne pas être une personne politiquement exposée. */
  ppe?: boolean;
}

/**
 * Statut de la preuve de visa (carte « Ajouter mon visa ») :
 * aucun = pas encore transmise ; verification = transmise, en cours de
 * vérification par Treepi ; verifie = validée, compte entièrement activé.
 */
export type StatutVisa = "aucun" | "verification" | "verifie";

/** Type d'hébergement déclaré pour le séjour (pilote les champs et justificatifs). */
export type TypeHebergement = "reservation" | "proche" | "proprietaire";

/**
 * Justificatif d'hébergement du séjour, collecté après la preuve de visa. Les
 * champs varient selon le type : `hote` pour un hébergement chez un proche,
 * `telephone` pour une réservation d'hôtel/airbnb.
 */
export interface InfosHebergement {
  type: TypeHebergement;
  /** Nom, prénom et étage de l'hébergeur (hébergement chez un proche). */
  hote?: string;
  adresse: string;
  codePostal: string;
  ville: string;
  /** Téléphone de l'hôtel/airbnb (hébergement en réservation). */
  telephone?: string;
  /** Nom du justificatif d'hébergement téléversé. */
  justificatif?: string;
}

/**
 * État du parcours d'ouverture du compte Euro (machine à états) :
 * aucun = pas de dossier ; attente-paiement = dossier signé, paiement
 * d'ouverture à effectuer ; attente-validation = justificatif soumis, en
 * cours de vérification ; actif = compte Euro activé.
 */
export type EtatOuverture = "aucun" | "attente-paiement" | "attente-validation" | "actif";

/** Canal du paiement d'ouverture (money-in avec justificatif, jamais de carte). */
export type CanalPaiement = "especes" | "virement-local" | "virement-europe";

/** Qui finance le voyage (volet conformité LCB-FT du pack preuve). */
export type TypeFinanceur = "moi" | "famille" | "entreprise" | "autre";

/**
 * Identité du financeur tiers déclarée pendant le paiement d'ouverture du pack
 * preuve. Les champs varient selon le type (famille : lien de parenté ;
 * entreprise : raison sociale ; autre : précision libre).
 */
export interface FinanceurTiers {
  type: TypeFinanceur;
  nom?: string;
  prenom?: string;
  lienParente?: string;
  raisonSociale?: string;
  telephone?: string;
  email?: string;
  precision?: string;
  /** Nom du fichier de la pièce d'identité du financeur téléversée. */
  piece?: string;
}

/**
 * Paiement d'ouverture soumis à la validation. Pour le pack « compte », seuls
 * les frais sont payés (`montantCredite` = 0) ; pour le pack « attestation »,
 * le total fond la première recharge et les frais (simulation affichée à
 * l'écran « Financer mon voyage »).
 */
export interface PaiementOuverture {
  canal: CanalPaiement;
  /** Pays du dépôt (canal espèces). */
  paysDepot?: string;
  /** Montant qui créditera le solde à l'activation (0 pour le pack compte). */
  montantCredite: number;
  fraisPack: number;
  fraisTransfert: number;
  /** Montant total à virer ou déposer (crédité + frais). */
  total: number;
  /** Déclarations de conformité du pack preuve. */
  financeur?: FinanceurTiers;
  provenanceFonds?: string;
  /** Nom du fichier du justificatif de paiement téléversé. */
  justificatif?: string;
  /** Date ISO de soumission (pilote la validation simulée). */
  soumisLe: string;
}

/** Informations du visa obtenu, collectées dans le flux « Obtention de visa ». */
export interface InfosVisa {
  /** Dates de validité du visa (ISO AAAA-MM-JJ). */
  debutValidite: string;
  finValidite: string;
  /** Pays de délivrance du visa Schengen. */
  paysDelivrance: string;
  motifSejour: string;
  /** Nom du fichier de preuve d'obtention de visa téléversé. */
  preuve?: string;
  /** Justificatif d'hébergement pendant le séjour (type + adresse + document). */
  hebergement?: InfosHebergement;
}

export interface CompteEuro {
  soldeEuros: number;
  transactions: Transaction[];
  /** Phase du voyageur : détermine le jeu de bannières du tableau de bord. */
  phase: "pre-visa" | "post-visa";
  /** L'utilisateur a-t-il renseigné son visa (carte « Ajouter mon visa »). */
  visaAjoute: boolean;
  /** Statut de la vérification de la preuve de visa. */
  statutVisa?: StatutVisa;
  /** Date ISO de soumission de la preuve (pilote la vérification simulée). */
  visaSoumisLe?: string;
  /** Informations du visa transmises à la soumission. */
  visa?: InfosVisa;
  /** Progression du profil (anneau autour de l'avatar), en %. */
  progressionProfil: number;
  /** Le compte Euro a-t-il été activé (écran « Félicitations »). */
  active: boolean;
  /** Le compte Euro est-il actif (paiement d'ouverture validé). */
  ouvert?: boolean;
  /** État détaillé du parcours d'ouverture (machine à états). */
  etatOuverture?: EtatOuverture;
  /** Pack souscrit à l'ouverture. */
  packId?: PackId;
  /** Informations d'identité collectées au KYC. */
  kyc?: InfosKyc;
  /** Date ISO de signature du contrat. */
  signeLe?: string;
  /** Paiement d'ouverture soumis (frais seuls ou première recharge). */
  paiementOuverture?: PaiementOuverture;
}

/** Compte neuf : aucun produit, l'accueil est en mode découverte. */
const COMPTE_NEUF: CompteEuro = {
  soldeEuros: 0,
  transactions: [],
  phase: "pre-visa",
  visaAjoute: false,
  progressionProfil: 0,
  active: false,
  etatOuverture: "aucun",
};

/** Durée de la vérification simulée d'une preuve de visa. */
const DUREE_VERIFICATION_VISA_MS = 30_000;

/**
 * Durée de la validation simulée du paiement d'ouverture (15 min à 24 h
 * ouvrées en réel : le backend notifiera par email/push à la validation).
 */
const DUREE_VALIDATION_PAIEMENT_MS = 25_000;

/**
 * Active le compte à la validation du paiement d'ouverture : crédite le
 * montant rechargé (pack preuve) avec la ligne de la maquette (« XOF → EUR »
 * pour un dépôt d'espèces, « Compte » pour un virement). Côté backend, cette
 * bascule sera déclenchée par le back-office de vérification des justificatifs.
 */
function activerApresValidation(compte: CompteEuro): CompteEuro {
  const paiement = compte.paiementOuverture;
  const credit = paiement?.montantCredite ?? 0;
  const mouvements: Transaction[] =
    credit > 0 && paiement
      ? [
          {
            id: genererId(),
            type: paiement.canal === "especes" ? "recharge" : "virement",
            titre: paiement.canal === "especes" ? "XOF → EUR" : "Compte",
            montantEuros: credit,
            date: new Date().toISOString(),
          },
        ]
      : [];
  return {
    ...compte,
    etatOuverture: "actif",
    ouvert: true,
    active: true,
    soldeEuros: Math.round((compte.soldeEuros + credit) * 100) / 100,
    transactions: [...mouvements, ...compte.transactions],
  };
}

/** Lit l'état du compte simulé (compte neuf par défaut). */
export function obtenirCompte(): CompteEuro {
  const brut = lireStockage<CompteEuro>("compte") ?? COMPTE_NEUF;
  // Migrations des comptes enregistrés avant le statut de visa détaillé et
  // avant la machine à états d'ouverture.
  let compte: CompteEuro = {
    ...brut,
    statutVisa: brut.statutVisa ?? (brut.visaAjoute ? "verifie" : "aucun"),
    etatOuverture: brut.etatOuverture ?? (brut.ouvert ? "actif" : brut.signeLe ? "attente-paiement" : "aucun"),
  };
  // Simulation : la vérification de la preuve de visa aboutit ~30 s après la
  // soumission ; le compte bascule alors en phase post-visa (le vrai backend
  // notifiera).
  if (
    compte.statutVisa === "verification" &&
    compte.visaSoumisLe &&
    Date.now() - Date.parse(compte.visaSoumisLe) > DUREE_VERIFICATION_VISA_MS
  ) {
    compte = { ...compte, statutVisa: "verifie", visaAjoute: true, phase: "post-visa" };
    ecrireStockage("compte", compte);
  }
  // Simulation : la validation du paiement d'ouverture aboutit ~25 s après la
  // soumission du justificatif et active le compte.
  if (
    compte.etatOuverture === "attente-validation" &&
    compte.paiementOuverture &&
    Date.now() - Date.parse(compte.paiementOuverture.soumisLe) > DUREE_VALIDATION_PAIEMENT_MS
  ) {
    compte = activerApresValidation(compte);
    ecrireStockage("compte", compte);
  }
  return compte;
}

/** Dossier KYC pré-rempli du raccourci de démonstration (Awa Diallo). */
const KYC_DEMO: InfosKyc = {
  passeportNumero: "19AA45678",
  paysDelivrance: "Côte d'Ivoire",
  expiration: "12/05/2030",
  situationPro: "Étudiant",
  secteur: "Éducation",
  revenuMensuel: "800",
  patrimoine: "Moins de 10 000 €",
  usPerson: true,
  ppe: true,
};

/**
 * Raccourci de démonstration (maquette « Pack 2 option dépôt ») : pose d'un
 * coup l'état actif complet du pack preuve, comme si l'utilisateur avait signé
 * son dossier, payé son ouverture par dépôt d'espèces puis été validé. Dans le
 * vrai parcours, ces étapes passent par `ouvrirCompteEuro` puis
 * `soumettrePaiementOuverture` ; ce raccourci sert aux démos et aux tests
 * (aucune entrée d'interface, à appeler depuis la console).
 */
export async function activerCompte(): Promise<CompteEuro> {
  await latenceReseau();
  const compte: CompteEuro = {
    ...obtenirCompte(),
    active: true,
    ouvert: true,
    etatOuverture: "actif",
    packId: "attestation",
    kyc: KYC_DEMO,
    progressionProfil: 100,
    signeLe: new Date().toISOString(),
    paiementOuverture: {
      canal: "especes",
      paysDepot: "Côte d'Ivoire",
      montantCredite: 2750,
      fraisPack: trouverPack("attestation").prixAnnuel,
      fraisTransfert: 55,
      total: 3015,
      financeur: { type: "moi" },
      provenanceFonds: "Épargne personnelle",
      justificatif: "justificatif-depot.pdf",
      soumisLe: new Date().toISOString(),
    },
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

/**
 * Enregistre la preuve de visa transmise : le compte passe en statut
 * « vérification en cours » ; la bascule post-visa intervient à la
 * validation (simulée ~30 s plus tard, voir obtenirCompte).
 */
export function soumettreDossierVisa(visa: InfosVisa): CompteEuro {
  return enregistrerCompte({
    ...obtenirCompte(),
    visa,
    statutVisa: "verification",
    visaSoumisLe: new Date().toISOString(),
  });
}

/**
 * Clôt le dossier d'ouverture du compte Euro (pack + KYC + signature) :
 * enregistre le pack et les informations d'identité, complète la progression
 * du profil et place le compte en `attente-paiement`. Le compte ne devient
 * actif qu'après le paiement d'ouverture et sa validation.
 */
export async function ouvrirCompteEuro(packId: PackId, kyc: InfosKyc): Promise<CompteEuro> {
  await latenceReseau();
  return enregistrerCompte({
    ...obtenirCompte(),
    etatOuverture: "attente-paiement",
    packId,
    kyc,
    progressionProfil: 100,
    signeLe: new Date().toISOString(),
  });
}

/**
 * Barème simulé des frais de transfert du paiement d'ouverture, par canal
 * (part du montant transféré). Le vrai backend le remplacera par la grille du
 * partenaire money-in.
 */
export const TAUX_FRAIS_TRANSFERT: Record<CanalPaiement, number> = {
  especes: 0.02,
  "virement-local": 0.01,
  "virement-europe": 0,
};

/** Frais de transfert du paiement d'ouverture pour un montant donné. */
export function fraisTransfertOuverture(canal: CanalPaiement, base: number): number {
  return Math.round(base * TAUX_FRAIS_TRANSFERT[canal] * 100) / 100;
}

/**
 * Soumet le paiement d'ouverture (canal, montants, conformité, justificatif) :
 * le compte passe en `attente-validation`. L'activation intervient à la
 * validation du justificatif (simulée ~25 s plus tard, voir `obtenirCompte`) ;
 * le vrai backend la déclenchera depuis son back-office et notifiera.
 */
export async function soumettrePaiementOuverture(
  paiement: Omit<PaiementOuverture, "soumisLe">
): Promise<CompteEuro> {
  await latenceReseau();
  return enregistrerCompte({
    ...obtenirCompte(),
    etatOuverture: "attente-validation",
    paiementOuverture: { ...paiement, soumisLe: new Date().toISOString() },
  });
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
