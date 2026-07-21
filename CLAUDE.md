@AGENTS.md

# Treepi (webapp)

## Le produit

Treepi est une néobanque pour voyageurs et candidats à un visa : compte Euro,
carte virtuelle, transferts XOF/EUR, attestations de garantie financière et
accompagnement dans les démarches de visa. Le dépôt sur le compte Euro sert
de preuve de ressources auprès des services consulaires.

Ce dépôt réunit deux surfaces dans un même projet Next.js :

- **Le site marketing** (`app/[locale]/(site)`) : landing, tarifs, blog, pages
  produit (compte Euro, carte, recharge, assurances, attestation). Terminé, en
  production.
- **L'app** (`app/[locale]/(app)/app`) : l'application connectée, reproduite au
  pixel depuis un fichier Figma haute fidélité. En cours.

## Objectif de la phase app

Reproduire les maquettes Figma au pixel sur mobile, puis en livrer une vraie
version desktop (mise en page repensée, jamais du mobile élargi). Le backend
n'existe pas encore : l'auth et les données sont simulées dans `lib/api/` avec
des signatures prêtes pour un vrai branchement API plus tard.

## À quoi ça ressemble

- **Univers de marque** : turquoise (primary) et corail (secondary), dégradés
  doux, fond clair `grey-light` orné d'une volute (Swirl). Cartes blanches
  arrondies, ombres légères, pilules de 46px. Police Outfit pour les titres,
  Inter pour le texte. Illustrations plates exportées de Figma (jamais recréées
  en CSS ni en emoji).
- **Coquille** : chaque écran connecté est un `EcranApp` (fond plein écran) posé
  sur `FondApp`, enveloppé par `CoquilleApp` qui porte la navigation.
- **Mobile** : barre de navigation basse à 5 entrées (Virement, Recharger,
  Accueil, Voyage, Carte). Utilisable dès 375px (iPhone SE), zéro débordement.
- **Desktop** : tableau de bord SaaS. Colonne latérale repliable (repliée par
  défaut, choix conservé si l'utilisateur agit dessus, raccourci profil en bas),
  en-tête pleine largeur (salutation + date + cloche + avatar), puis grille 2/3
  (solde, bannières, transactions, visa) et 1/3 (services, simulateur, support).
- **Atomes** (`components/app/ui` et proches) : BoutonApp, ChampTexte, ChampOtp,
  IndicateurEtapes, ModaleApp, CalendrierApp, FondApp, EcranApp, CoquilleApp,
  NavBarApp. À réutiliser avant d'en créer.

## Source de vérité (Figma)

Fichier « Treepi App » : `https://www.figma.com/design/fJcrSCBEFd58UgjS8xv8dO/Treepi-App?node-id=2621-292357`
(fileKey `fJcrSCBEFd58UgjS8xv8dO`, page V7 = node `2621:292357`). MCP Figma en
local : `figma-desktop` sur `http://127.0.0.1:3845/mcp`. Utilise
`get_design_context` sur le node avant de coder un écran.

## Stack et conventions

- **Next.js 16** (App Router, Turbopack). Conventions différentes de ce que tu
  connais : lis `node_modules/next/dist/docs/` avant d'écrire du code.
- **next-intl v4** : segment `[locale]`, FR par défaut (sans préfixe), EN sous
  `/en`. Tout texte de l'app vit dans `messages/fr.json` + `en.json`, namespace
  `app`. Jamais de texte en dur.
- **Tailwind v4** + design system maison (jetons dans `app/globals.css` et la
  config).
- **Mock API** `lib/api/` : `auth.ts` (MODE TEST `AUTH_TOUJOURS_OK`, toute
  connexion réussit), `compte.ts` (solde, transactions, phase pré/post-visa),
  `client.ts` (persistance localStorage préfixe `treepi.mock.`), `types.ts`.
  Chaque fonction imite le futur backend.

## Règles de craft (non négociables)

- **Jamais de tiret cadratin « — »** nulle part (signature d'IA). Seule
  exception : le corps des articles de blog publiés.
- Pas de faux eyebrows en police mono / majuscules espacées (slop d'IA).
- Visuels et illustrations exportés depuis Figma, jamais recréés. Rendu soigné.
- **Commentaires de code en français**, précis et utiles.
- Composants atomiques, on s'appuie vraiment sur le design system.
- **Mobile-first** : utilisable sur iPhone SE (375px), zéro débordement.
- **Communication en français.**

## Flux utilisateur (tous, avec avancement)

Statut : `Fait` (livré et testé), `À faire` (maquette identifiée, pas encore
codée). Les node-id renvoient à la page V7 du Figma.

### Machine à états du compte

`inscrit → dossier signé (pack + KYC + signature) → paiement soumis (justificatif) → actif (après validation) → post-visa`

Le compte Euro n'est jamais créé d'office : c'est un produit payant dont
l'ouverture suit la checklist Figma « Compléter tes infos, Signer ton contrat,
Effectuer ton paiement, Bienvenue sur Treepi ». État persisté dans
`compte.etatOuverture` : `aucun → attente-paiement → attente-validation → actif`
(`compte.ouvert` reste le booléen « compte actif »).

- **Inscrit (`aucun`)** : accueil « découverte » (hero `CarteOuverture`,
  transactions masquées). Recharger, Recevoir, Virement et Attestation
  redirigent vers `/app/compte-euro` (`lib/hooks/useCompteOuvert.ts`). Les
  services payables à part (accompagnement, assurance, recours, dossier visa)
  restent accessibles quel que soit l'état du compte.
- **Deux packs** (le pack 3 « Recours » est retiré de l'offre ; le service
  `/app/recours` existe toujours) :
  - **Pack « Compte Euro » (80 €/an)** : à l'étape paiement on ne règle que les
    frais de gestion (dépôt d'espèces avec choix du pays, virement local ou
    virement Europe, puis justificatif à charger). Activation à solde 0 €,
    aucune transaction. L'attestation n'est PAS incluse : 100 €/an, encart
    « Frais » sur l'intro de `/app/attestation`.
  - **Pack « Compte Euro + preuve » (210 €/an)** : l'étape paiement EST la
    première recharge « Financer mon voyage » : montant à recharger simulé
    (montant crédité + frais du pack + frais de transfert = total à virer ou
    déposer, équivalent FCFA), engagement que l'argent finance le voyage,
    conformité (« Qui finance ton voyage ? » moi-même / famille / entreprise /
    autre avec identité et pièce du financeur tiers, puis « Provenance des
    fonds »), enfin justificatif de paiement. Activation avec
    solde = montant crédité (ligne « XOF → EUR » en espèces, « Compte » en
    virement). Attestation incluse (encart « Bonne nouvelle », génération
    illimitée pendant un an).
- **Validation asynchrone du paiement** : 15 minutes à 24 h ouvrées en réel,
  ~25 s simulées dans le mock (bascule dans `obtenirCompte`). Pendant
  `attente-paiement`, l'accueil propose de finaliser le paiement (reprise via
  `/app/compte-euro/paiement`) ; pendant `attente-validation`, bannière sablier
  « justificatif en cours de vérification ». À l'activation, l'accueil redirige
  une fois vers `/app/activation` (félicitations) puis propose le tutoriel.
- **Aucun prélèvement différé** : les frais du pack sont payés pendant
  l'onboarding (seuls pour le pack 1, fondus dans le total de la première
  recharge pour le pack 2). Jamais de ligne « Abonnement Treepi » sur le solde.

Contrat backend complet (endpoints, webhooks, intégrations, phasage) :
**`docs/BACKEND.md`**, à tenir à jour à chaque évolution de `lib/api/`.

### Onboarding et authentification

| Flux | Écran / Route | Statut | Rôle |
| --- | --- | --- | --- |
| Lancement | `/app` | Fait | Splash de démarrage, redirige vers l'entrée du parcours. |
| Walkthrough | `/app/decouverte` | Fait | Carrousel de présentation (3 écrans). |
| Bienvenue (SignUp/Login) | `/app/bienvenue` | Fait | Choix « créer un compte » ou « se connecter ». |
| Inscription | `/app/inscription` | Fait | Formulaire multi-étapes : email, mot de passe, infos, téléphone. Treepi v1 cible les voyageurs africains : nationalité, pays de résidence et indicatifs téléphoniques limités à l'Afrique (référentiel `lib/data/afrique.ts`, drapeaux + gabarits de numéros par pays). |
| Bravo | composant `EcranBravo` | Fait | Confirmation de fin d'inscription. |
| Connexion | `/app/connexion` | Fait | Login email + mot de passe (MODE TEST : réussit toujours). |
| Activation du compte | `/app/activation` | Fait | Retour post-validation du paiement : biométrie simulée puis « Félicitations, ton compte Euro a été créé » et accès au dashboard (0 € pack 1, crédité pack 2). L'accueil y redirige une seule fois quand le compte devient actif (`treepi.activation-vue`). Le fast-forward démo reste dans l'API (`activerCompte`). |
| Reconnexion | node `1716:549351` | À faire | Retour d'un utilisateur connu (biométrie / code court). |

### Compte Euro et prise en main

| Flux | Écran / Route | Statut | Rôle |
| --- | --- | --- | --- |
| Ouverture compte Euro / KYC | `/app/compte-euro` | Fait | Parcours : intro → choix du pack (« De quoi as-tu besoin ? », 2 packs) → identité (passeport) → infos pro → infos financières → certifications → récapitulatif → signature. Clôt le dossier (`ouvrirCompteEuro` → `attente-paiement`, enregistre pack + KYC) puis enchaîne sur le paiement d'ouverture. Entrées : hero de l'accueil découverte, bannière du profil et redirections des routes argent. Si un dossier existe déjà, la route renvoie vers le paiement ou l'accueil selon l'état. |
| Paiement d'ouverture | `/app/compte-euro/paiement` | Fait | Étape « Effectue ton paiement » de la checklist. Pack 1 : frais de gestion (espèces avec pays / virement local / virement Europe → récap FCFA → instructions RIB Treepi + fenêtre de 30 jours → justificatif). Pack 2 : « Financer mon voyage » (engagement fonds dédiés → canal → montant simulé avec frais → instructions → qui finance + pièce du tiers → provenance des fonds → justificatif). Soumission (`soumettrePaiementOuverture` → `attente-validation`) puis écran sablier (vérification 15 min à 24 h ouvrées). |
| Tutoriel (facultatif) | `/app/tutoriel` | Fait | Visite guidée du dashboard, projecteur en 3 étapes (solde, services, simulateur). Proposé au premier accès à l'accueil une fois le compte actif (après l'écran d'activation). |

### Tableau de bord et opérations

| Flux | Écran / Route | Statut | Rôle |
| --- | --- | --- | --- |
| Dashboard / Homepage | `/app/accueil` | Fait | Solde Euro, actions rapides, bannières pré/post-visa (carrousel auto-play 5 s en boucle infinie, pause au survol), transactions, carte « Ajouter mon visa » dépliable à 3 états (`statutVisa` : action requise / vérification en cours / vérifié), services, simulateur de transfert, support. Rendus selon `etatOuverture` : hero `CarteOuverture` (`aucun`), reprise du paiement (`attente-paiement`), bannière sablier avec re-lecture périodique (`attente-validation`), redirection unique vers `/app/activation` au passage à `actif`, puis dashboard complet (bannière « Ajoute de l'argent » à solde nul). |
| Recharger le compte Euro | `/app/recharger` | Fait | Consentement → méthode (carte / virement SEPA / espèces) → montant (équiv. FCFA + frais) → détails → succès. Carte = crédit immédiat, virement/espèces = « en cours ». Cible des boutons « Recharger » et bannières. Compte actif requis (`useCompteOuvert`). |
| Recevoir (RIB / IBAN) | `/app/recevoir` | Fait | Coordonnées du compte Euro perso (IBAN déterministe) : copie ligne à ligne, partage natif, délais SEPA/SWIFT. Cible de l'action rapide « RIB ». Compte ouvert requis. |
| Envoyer (virement) | `/app/virement` | Fait | Bénéficiaire (nom + IBAN) → montant (borné au solde) → récap → débit. Cible de l'entrée nav « Virement ». Compte ouvert requis. |
| Commande de carte | node `1724:572089` | Hors scope | Non développé (feature « carte » exclue). Entrée nav « Carte » inerte. |

### Services voyage et visa (`/app/voyage` = hub, entrée nav « Voyage »)

| Flux | Écran / Route | Statut | Rôle |
| --- | --- | --- | --- |
| Hub services | `/app/voyage` | Fait | Liste les 5 services visa/voyage. Cible de la nav « Voyage » et du « Voir tout ». |
| Obtention de visa | `/app/visa` | Fait | Collecte du visa obtenu puis du justificatif d'hébergement, en 7 étapes : « Avez-vous obtenu votre visa ? » (Oui/Non, Non ramène à l'accueil) → dates de validité → pays de délivrance Schengen + motif du séjour → preuve à charger → type d'hébergement (réservation / proche / propriétaire) + adresse adaptée au type → justificatif d'hébergement à charger (documents acceptés variables selon le type) → récapitulatif dépliable des deux volets. Soumission (`soumettreVisa`, payload `InfosVisa` + `hebergement`) → statut « vérification » (~30 s simulées dans `obtenirCompte`) puis bascule post-visa. Entrée : carte « Ajouter mon visa ». |
| Attestation de garantie financière | `/app/attestation` | Fait | Présentation (encart selon le pack : « Bonne nouvelle, incluse dans ton forfait » pour le pack preuve, « Frais : 100 €/an » pour le pack Compte Euro) → formulaire (montant = solde, infos séjour) → génération → succès avec téléchargement + partage. Compte actif requis. |
| Accompagnement | `/app/accompagnement` | Fait | Présentation (1 h offerte) → RDV (téléphone / bureau + Calendly) → formule (solo 100 € / famille 150 € / parent 120 €) → paiement → confirmation. |
| Recours visa | `/app/recours` | Fait | Souscription du service (500 €/an) : présentation → paiement → confirmation. N'est plus proposé comme pack d'abonnement. |
| Assurance voyage Schengen | `/app/assurance` | Fait | Souscription (90 €/an) : présentation → paiement → confirmation. |
| Choix du pack (abonnement) | intégré à `/app/compte-euro` | Fait | Deux packs : « Compte Euro » 80 €/an et « Compte Euro + preuve » 210 €/an, cartes dépliables et modale « Peut-être plus tard ». |

### Profil

| Flux | Écran / Route | Statut | Rôle |
| --- | --- | --- | --- |
| Profil (hub) | `/app/profil` | Fait | Stats de voyage, accès aux trois volets d'infos. |
| Infos personnelles | `/app/profil/infos-personnelles` | Fait | Nom, prénom, civilité, téléphone, email (statuts de vérification). |
| Infos professionnelles | `/app/profil/infos-professionnelles` | Fait (placeholders) | Situation, contrat, secteur, organisme. Champs « À renseigner » en attendant le KYC. |
| Infos financières | `/app/profil/infos-financieres` | Fait (placeholders) | Ressources, certifications (US person, PPE), infos fiscales. |

## Architecture des flux (`components/app/flux/`)

Toute la logique de flux repose sur des fondations partagées (mobile 1:1,
desktop = panneau centré, comme l'inscription) :

- `GabaritFlux` : coquille (bandeau turquoise + volute, TopNav, `IndicateurEtapes`
  optionnel, sous-titre corail, feuille grise).
- `ChoixOption` (option cliquable radio/chevron), `CartePack` (carte de pack
  dépliable), `ChampFichier` (téléversement KYC), `FeuilleBasse` (bottom sheet),
  `EcranSucces` (succès générique + action secondaire), `LigneCopiable`,
  `EtapePaiement` (carte bancaire), `FluxSouscription` (recours / assurance),
  `icones.tsx`.
- API mock : `packs.ts` (2 packs), `services.ts`, `recharge.ts`, `change.ts` et
  `compte.ts` étendu (`ouvrirCompteEuro` → dossier, `soumettrePaiementOuverture`
  → validation simulée, `crediter/debiter`, `RIB_TREEPI`, `InfosKyc`,
  `PaiementOuverture` avec financeur et provenance des fonds). Garde partagée
  `lib/hooks/useCompteOuvert.ts` sur les routes argent.
- Messages sous `app.flux.*` (recharge, recevoir, virement, packs, compteEuro,
  paiement, attestation, accompagnement, visa, recours, assurance) + `app.voyage`.

## Statut global et placeholders

Les deux grandes features sont livrées et vérifiées (mobile 375px + desktop
1440px, build prod vert, zéro débordement) : **Compte Euro** (Ouverture/KYC,
Recharger, Recevoir, Envoyer) et **Assurance voyage + recours visa** (Obtention
de visa, Attestation, Accompagnement, Recours, Assurance, hub Voyage).

Chaîne testable réelle : inscription → accueil découverte → `/app/compte-euro`
(pack + KYC + signature) → `/app/compte-euro/paiement` (frais seuls ou première
recharge avec conformité selon le pack, justificatif) → attente de validation
(~25 s simulées) → `/app/activation` (félicitations) → dashboard. Raccourci
démo : appeler `activerCompte()` (`lib/api/compte.ts`) qui pose d'un coup
l'état actif complet du pack preuve (2750 €, dossier signé, KYC).

Éléments encore volontairement inertes (`title` « Bientôt disponible »), hors
périmètre ou en attente du backend :

- Entrée de navigation « Carte » et commande de carte (hors scope).
- Burger (Menu), cloche (notifications), actions rapides « Convertir » /
  « Abonnement », CTA « Recharger » des bannières post-visa.
- Volets profil pro / financières : encore en « À renseigner » (le KYC stocke
  déjà les données via `compte.kyc`, branchement d'affichage à faire).
