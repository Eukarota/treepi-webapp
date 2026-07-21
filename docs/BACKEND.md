# Contrat d'API backend Treepi

Ce document liste tous les endpoints attendus par l'app pour construire la
roadmap backend. **Source de vérité : `lib/api/*.ts`.** Chaque fonction de la
simulation correspond à un endpoint ; ses types TypeScript (payloads, réponses)
sont le schéma à implémenter. Brancher le backend = remplacer les corps de ces
fonctions par des appels HTTP, sans toucher aux écrans.

## Conventions

- Base `/v1`, JSON, jeton Bearer (session + refresh). Locale via `Accept-Language` (fr / en).
- Montants : le front manipule des euros décimaux ; l'API doit exposer des **centimes entiers** (le client convertira au branchement).
- Dates ISO 8601 UTC. Erreurs `{ code, message }` avec codes stables déjà mappés côté front : `identifiants-invalides`, `compte-verrouille`, `email-deja-utilise`, `otp-invalide`, `inconnu`.
- Clé d'idempotence obligatoire sur les POST d'argent (recharges, virements, paiements).

## Machine à états du compte

```
inscrit            → (dossier : pack + KYC + signature)   → attente-paiement
attente-paiement   → (money-in + justificatif soumis)     → attente-validation
attente-validation → (justificatif validé, back-office)   → actif
actif              → (preuve de visa vérifiée)            → post-visa
```

État persisté dans `compte.etatOuverture` (`compte.ouvert` reste le booléen
« compte actif »). Le paiement d'ouverture dépend du pack :

- **compte (80 €/an)** : frais de gestion seuls (`montantCredite = 0`),
  activation à solde nul ;
- **attestation (210 €/an)** : première recharge « Financer mon voyage »
  (frais fondus dans le total) + conformité LCB-FT (financeur du voyage,
  pièce du tiers, provenance des fonds), activation avec solde crédité.

| État | Condition | Accessible | Refusé par le backend (403/422) |
| --- | --- | --- | --- |
| Inscrit | `etatOuverture = aucun` | tableau de bord découverte, simulateur de change, preuve de visa, accompagnement, assurance, recours | recharges, RIB, virements, attestation (le front redirige vers `/app/compte-euro`) |
| Attente de paiement | dossier signé | + paiement d'ouverture (`/app/compte-euro/paiement`, reprise possible) | idem inscrit |
| Attente de validation | justificatif soumis | consultation du récapitulatif du paiement | idem inscrit, 422 sur une nouvelle soumission |
| Actif | paiement validé | RIB, recharges, virements, attestation (montant = solde, 422 si solde nul) | |
| Post-visa | `statutVisa = "verifie"` | usage complet, bannières post-visa | |

Ces verrous existent côté front (`lib/hooks/useCompteOuvert.ts`) mais doivent
être **réappliqués côté serveur** : la garde front n'est qu'un confort. Les
services payables à part (accompagnement, assurance, recours, preuve de visa)
restent accessibles quel que soit l'état du compte.

## Authentification (`lib/api/auth.ts`)

| Endpoint | Fonction mock | Rôle |
| --- | --- | --- |
| `POST /v1/auth/otp` | `demanderOtp(email)` | Envoie un code 6 chiffres par email. 409 si email déjà utilisé. |
| `POST /v1/auth/otp/verification` | `verifierOtp(email, code)` | Valide le code (expiration courte, essais limités). |
| `POST /v1/auth/inscription` | `creerCompte(brouillon)` | Crée l'utilisateur (`BrouillonInscription` : email, mot de passe, identité, téléphone). Renvoie la session. |
| `POST /v1/auth/connexion` | `seConnecter(email, mdp)` | Règle des 3 tentatives puis verrouillage temporaire (`tentativesRestantes` dans la réponse d'erreur). |
| `POST /v1/auth/deconnexion` | `seDeconnecter()` | Révoque le jeton. |
| `GET /v1/auth/session` | `sessionCourante()` | Restaure la session au démarrage. |
| `POST /v1/auth/mot-de-passe/oubli` | `reinitialiserMotDePasse(email)` | Email de réinitialisation. |

Biométrie / WebAuthn (écran d'activation) : phase ultérieure, `POST /v1/auth/webauthn/*`.

## Compte Euro (`lib/api/compte.ts`)

| Endpoint | Fonction mock | Rôle |
| --- | --- | --- |
| `GET /v1/compte` | `obtenirCompte()` | État complet : solde, `etatOuverture`, pack, `paiementOuverture`, `statutVisa`, progression profil, KYC. |
| `POST /v1/compte/ouverture` | `ouvrirCompteEuro(packId, kyc)` | Dossier d'ouverture : pack + `InfosKyc` (passeport, situation pro, revenus, patrimoine, certifications FATCA / PPE) + signature horodatée → `attente-paiement`. Déclenche la vérification KYC chez le prestataire ; la création du compte BaaS et l'émission de l'IBAN attendent la validation du paiement. |
| `GET /v1/compte/ouverture/paiement/simulation?canal=&montant=` | `fraisTransfertOuverture(canal, base)` | Décomposition du paiement d'ouverture : frais du pack + frais de transfert par canal (mock : espèces 2 %, virement local 1 %, virement Europe 0 % ; en réel, grille du partenaire money-in) + équivalent FCFA. |
| `POST /v1/compte/ouverture/paiement` | `soumettrePaiementOuverture(paiement)` | Payload `PaiementOuverture` : canal, pays du dépôt, montants (crédité / frais pack / frais transfert / total), `financeur` (type + identité + `documentId` de la pièce du tiers), `provenanceFonds`, `documentId` du justificatif → `attente-validation`. Référence de dossier `OUV-XXXXXXXX` à rapprocher du money-in. |
| `GET /v1/compte/rib` | `obtenirRibUtilisateur()` | IBAN personnel de l'utilisateur (écran Recevoir). Disponible une fois le compte actif. |
| `GET /v1/compte/transactions` | `compte.transactions` | Mouvements paginés (type, titre, montant, sens, date). |

**Validation du paiement d'ouverture (back-office, pas un endpoint public)** :
le justificatif est vérifié sous 15 min à 24 h ouvrées (mock : ~25 s dans
`obtenirCompte`). À la validation : création du compte chez le BaaS, émission
de l'IBAN, `etatOuverture = actif`, crédit de `montantCredite` (ligne
« XOF → EUR » en espèces, « Compte » en virement) et notification email/push.
Un refus (montant ou référence erronés) repasse le dossier en
`attente-paiement` avec motif. Fenêtre de paiement : 30 jours. Reconduction
annuelle du pack à dater de l'activation.

## Packs (`lib/api/packs.ts`)

| Endpoint | Fonction mock | Rôle |
| --- | --- | --- |
| `GET /v1/packs` | `PACKS` | Catalogue : compte 80 € / attestation 210 € (populaire) par an. Prix en config serveur. Le recours n'est plus un pack d'abonnement (service à part, voir Souscriptions). |
| `POST /v1/packs/souscription` | `souscrirePack(id)` | Rattache le pack au dossier d'ouverture. Aucun encaissement immédiat : les frais sont réglés dans le paiement d'ouverture. |
| `GET /v1/packs/souscription` | `packChoisi()` | Pack courant. |

## Recharges, money-in (`lib/api/recharge.ts`)

| Endpoint | Fonction mock | Rôle |
| --- | --- | --- |
| `GET /v1/recharges` | `listerRecharges()` | Historique (statuts `effectuee` / `en-cours`). |
| `POST /v1/recharges` | `creerRecharge({methode, montantEuros})` | Carte : intention PSP + 3DS, crédit au webhook. Virement : renvoie l'IBAN de collecte (`RIB_TREEPI`) + référence `TRP-XXXXXXXX`, `en-cours` jusqu'au rapprochement. Espèces : référence + points de dépôt partenaires. |
| `GET /v1/recharges/frais?montant=` | `fraisRecharge()` | Barème 1,5 %, minimum 1 € (config serveur). |

Webhooks : PSP (paiement carte confirmé) → crédit (`crediterImmediat`) ;
virement entrant rapproché par référence `TRP-*` → crédit + recharge
`effectuee` ; conversion XOF → EUR appliquée au crédit le cas échéant. Le même
rapprochement par référence sert au paiement d'ouverture (`OUV-*`), qui suit
son propre circuit de validation (voir Compte Euro).

## Virements sortants (`debiterCompte` + `/app/virement`)

| Endpoint | Fonction mock | Rôle |
| --- | --- | --- |
| `POST /v1/virements` | `debiterCompte(montant, nom)` | Payload `{ nomBeneficiaire, iban, montantEuros }`. Contrôles : IBAN valide, solde suffisant, SCA (PSD2), plafonds LCB-FT. |

Les mouvements retombent dans `GET /v1/compte/transactions`. Carnet de
bénéficiaires : pas encore côté front, prévoir `GET/POST /v1/beneficiaires`.

## Change (`lib/api/change.ts`)

Les taux courants ne sont plus fixes : `rafraichirTaux()` interroge en direct un
fournisseur public (open.er-api.com, base EUR, sans clé) et met à jour une table
vivante ; `DEVISES.tauxParEuro` ne sert plus que de valeur de repli. Le hook
`lib/hooks/useTaux.ts` déclenche la récupération au montage, rafraîchit toutes
les 5 min et au retour d'onglet, et abonne les écrans (`useSyncExternalStore`)
pour qu'ils se recalculent dès qu'un taux change. Consommé par le simulateur du
tableau de bord (affiche l'heure de mise à jour) et l'écran de recharge.

| Endpoint | Fonction mock | Rôle |
| --- | --- | --- |
| `GET /v1/change/devises` | `DEVISES` | Référentiel des devises proposées (afrique + destinations). |
| `GET /v1/change/taux?source=&cible=` | `tauxEntre()` / `rafraichirTaux()` | Taux courant temps réel. Brancher le backend = remplacer l'URL/le parsing de `rafraichirTaux()` par l'endpoint interne (mêmes codes ISO 4217, base EUR). |
| `GET /v1/change/historique?source=&cible=&jours=` | `historiqueTaux()` | Série pour le graphe du simulateur (30 points par défaut), ancrée sur le taux réel courant. À remplacer par l'historique réel du fournisseur. |

## Attestation de garantie financière (`lib/api/services.ts`)

| Endpoint | Fonction mock | Rôle |
| --- | --- | --- |
| `POST /v1/attestations` | `genererAttestation(infos)` | Payload `{ pays, motif, dateDepart, dateRetour }`. Le **montant garanti = solde au moment T, déterminé côté serveur** (jamais fourni par le client). Génère le PDF officiel signé, référence `ATT-XXXXXXXX`. Compte actif et solde positif requis. **Facturation selon le pack** : incluse (illimitée 1 an) avec le pack attestation ; avec le pack compte, option à 100 €/an (`PRIX_ATTESTATION_HORS_PACK`) à encaisser à la première génération (paiement carte, pas encore câblé côté front). |
| `GET /v1/attestations` | `listerAttestations()` | Historique. |
| `GET /v1/attestations/{id}/document` | `telecharger()` (front) | Le PDF (le mock produit un fichier texte). |
| `GET /verification/{reference}` (public) | | Page de vérification pour les consulats (QR code sur le PDF). Critique pour la valeur probante du document. |

## Preuve de visa (`soumettreVisa` + `soumettreDossierVisa`)

| Endpoint | Fonction mock | Rôle |
| --- | --- | --- |
| `POST /v1/visa` | `soumettreVisa(InfosVisa)` | Payload `{ debutValidite, finValidite, paysDelivrance, motifSejour, documentId, hebergement }`. `hebergement` porte le justificatif du séjour : `{ type: "reservation" \| "proche" \| "proprietaire", adresse, codePostal, ville, hote?, telephone?, documentId }` (`hote` pour un hébergement chez un proche, `telephone` pour une réservation d'hôtel/airbnb). Les deux `documentId` renvoient à des téléversements `POST /v1/documents`. Passe `statutVisa` à `verification`. |
| `GET /v1/visa` | `obtenirCompte().statutVisa` | État `aucun` / `verification` / `verifie`. Vérification manuelle (back-office) ou OCR ; à la validation, phase = post-visa. Le front sonde toutes les 5 s (mock : ~30 s) : prévoir aussi une notification push. |

## Accompagnement (`lib/api/services.ts`)

| Endpoint | Fonction mock | Rôle |
| --- | --- | --- |
| `GET /v1/accompagnement/formules` | `PACKS_ACCOMPAGNEMENT` | Solo 100 € / famille 150 € / parent 120 €. |
| `POST /v1/accompagnement/rendez-vous` | `reserverAccompagnement({canal, packId})` | Canal `telephone` / `bureau`, référence `RDV-XXXXXX`. Créneau via Calendly, paiement carte de la formule. |

## Souscriptions de services (`lib/api/services.ts`)

| Endpoint | Fonction mock | Rôle |
| --- | --- | --- |
| `GET /v1/services/souscriptions` | `servicesSouscrits()` | Services actifs. |
| `POST /v1/services/souscriptions` | `souscrireService(id)` | `recours` 500 €/an, `assurance` 90 €/an. Paiement carte, reconduction annuelle, police émise par l'assureur partenaire. |

## Transverses

| Endpoint | Fonction mock | Rôle |
| --- | --- | --- |
| `POST /v1/paiements/intentions` | `EtapePaiement` (composant) | Paiement carte des services (accompagnement, recours, assurance) : intention PSP + 3DS. Le PAN ne transite **jamais** par le backend (tokenisation PSP côté client). |
| `POST /v1/documents` | `ChampFichier` (composant) | Upload multipart (passeport, preuve de visa) : antivirus, JPEG / PNG / PDF, stockage chiffré UE, renvoie `documentId`. |
| `GET /v1/utilisateur` / `PATCH /v1/utilisateur` | écrans profil | Profil et statuts de vérification email / téléphone. Les volets pro / financier sont alimentés par le KYC (`compte.kyc`). |
| `GET /v1/referentiels/pays` | `lib/data/afrique.ts`, `suggestions.ts` | Référentiels v1 (pays africains + indicatifs + gabarits de numéros, pays Schengen, motifs, situations pro). Peut rester embarqué côté front en v1. |
| `GET /v1/notifications` | cloche (inerte) | Notifications + push (fin de vérification KYC / visa, crédit reçu). Phase 3. |

## Intégrations tierces à contractualiser

1. **BaaS / EMI** (comptes, IBAN, SEPA) : Swan, Treezor, Modulr... **Décision bloquante à prendre en premier**, elle conditionne l'ouverture de compte, le RIB et les webhooks money-in.
2. **PSP cartes** (Stripe, Checkout.com) : recharges carte + paiements de services.
3. **Vérification d'identité** (Ubble, Onfido, Sumsub) : KYC passeport + vivacité.
4. **Signature électronique** (Yousign...) : contrat d'ouverture (`signeLe`).
5. **Fournisseur de taux de change** + partenaire de conversion XOF → EUR.
6. **Réseau cash-in Afrique de l'Ouest** (dépôts en espèces).
7. **Assureur partenaire** (assurance voyage Schengen, recours visa).
8. **Calendly** (rendez-vous accompagnement), **emailing / SMS** (OTP).

## Exigences transverses

- **LCB-FT** : screening sanctions / PEP à l'ouverture (les champs sont déjà collectés : certifications FATCA / PPE, revenus, patrimoine), suivi des transactions.
- **Cantonnement des fonds (safeguarding)** : cœur de la promesse « preuve de fonds » vis-à-vis des consulats.
- **PSD2 / SCA** sur les virements sortants et paiements.
- **RGPD** : hébergement UE, chiffrement des documents d'identité, minimisation.
- Statut réglementaire : agent d'EMI (rapide) vs licence propre (long) ; à trancher avec le choix BaaS.

## Phasage proposé

- **Phase 1, MVP « compte + preuve de fonds »** : authentification, ouverture de compte (pack + KYC + signature), paiement d'ouverture par virement (justificatif + validation back-office + notification), recharges carte et virement, RIB, transactions, attestation PDF + page publique de vérification.
- **Phase 2, money-in élargi + visa** : dépôts en espèces via le réseau partenaire (recharges et paiement d'ouverture), conversion XOF, preuve de visa (vérification back-office + notification), accompagnement et paiements de services, taux de change temps réel, facturation de l'option attestation 100 €/an.
- **Phase 3, confort et échelle** : assurance / recours avec l'assureur, notifications push, WebAuthn, back-office complet, exports comptables.
