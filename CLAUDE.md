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

### Onboarding et authentification

| Flux | Écran / Route | Statut | Rôle |
| --- | --- | --- | --- |
| Lancement | `/app` | Fait | Splash de démarrage, redirige vers l'entrée du parcours. |
| Walkthrough | `/app/decouverte` | Fait | Carrousel de présentation (3 écrans). |
| Bienvenue (SignUp/Login) | `/app/bienvenue` | Fait | Choix « créer un compte » ou « se connecter ». |
| Inscription | `/app/inscription` | Fait | Formulaire multi-étapes : email, mot de passe, téléphone (OTP), infos. |
| Bravo | composant `EcranBravo` | Fait | Confirmation de fin d'inscription. |
| Connexion | `/app/connexion` | Fait | Login email + mot de passe (MODE TEST : réussit toujours). |
| Activation du compte | `/app/activation` | Fait | Login biométrie simulée, écran « félicitations », crédite 2750 € et enchaîne le tutoriel. |
| Reconnexion | node `1716:549351` | À faire | Retour d'un utilisateur connu (biométrie / code court). |

### Compte Euro et prise en main

| Flux | Écran / Route | Statut | Rôle |
| --- | --- | --- | --- |
| Ouverture compte Euro / KYC | `/app/compte-euro` | Fait | Parcours en 6 étapes : intro → choix du pack (« De quoi as-tu besoin ? ») → identité (passeport) → infos pro → infos financières → certifications → récapitulatif → signature. Clôt le dossier (`ouvrirCompteEuro`) : active le compte, enregistre le pack et le KYC, complète le profil. Entrée : bannière du profil quand `!compte.ouvert`. |
| Tutoriel (facultatif) | `/app/tutoriel` | Fait | Visite guidée du dashboard, projecteur en 3 étapes (solde, services, simulateur). |

### Tableau de bord et opérations

| Flux | Écran / Route | Statut | Rôle |
| --- | --- | --- | --- |
| Dashboard / Homepage | `/app/accueil` | Fait | Solde Euro, actions rapides, bannières pré/post-visa, transactions, « Ajouter mon visa », services, simulateur de transfert, support. Gère l'état vide « Frais de gestion ». |
| Recharger le compte Euro | `/app/recharger` | Fait | Consentement → méthode (carte / virement SEPA / espèces) → montant (équiv. FCFA + frais) → détails → succès. Carte = crédit immédiat, virement/espèces = « en cours ». Cible des boutons « Recharger » et bannières. |
| Recevoir (RIB / IBAN) | `/app/recevoir` | Fait | Coordonnées du compte Euro perso (IBAN déterministe) : copie ligne à ligne, partage natif, délais SEPA/SWIFT. Cible de l'action rapide « RIB ». |
| Envoyer (virement) | `/app/virement` | Fait | Bénéficiaire (nom + IBAN) → montant (borné au solde) → récap → débit. Cible de l'entrée nav « Virement ». |
| Commande de carte | node `1724:572089` | Hors scope | Non développé (feature « carte » exclue). Entrée nav « Carte » inerte. |

### Services voyage et visa (`/app/voyage` = hub, entrée nav « Voyage »)

| Flux | Écran / Route | Statut | Rôle |
| --- | --- | --- | --- |
| Hub services | `/app/voyage` | Fait | Liste les 5 services visa/voyage. Cible de la nav « Voyage » et du « Voir tout ». |
| Obtention de visa | `/app/visa` | Fait | Dossier pivot : volet visa (type, pays, dates) + volet justificatif d'hébergement (réservation / proche / propriétaire + upload) → soumission → bascule en phase post-visa (`soumettreVisa`). Entrée : carte « Ajouter mon visa ». |
| Attestation de garantie financière | `/app/attestation` | Fait | Présentation → formulaire (montant = solde, infos séjour) → génération → succès avec téléchargement + partage. |
| Accompagnement | `/app/accompagnement` | Fait | Présentation (1 h offerte) → RDV (téléphone / bureau + Calendly) → formule (solo 100 € / famille 150 € / parent 120 €) → paiement → confirmation. |
| Recours visa | `/app/recours` | Fait | Souscription (Pack 3, 500 €/an) : présentation → paiement → confirmation. Maquette « Non dispo », reprise du Pack 3. |
| Assurance voyage Schengen | `/app/assurance` | Fait | Souscription (90 €/an) : présentation → paiement → confirmation. |
| Choix du pack (abonnement) | intégré à `/app/compte-euro` | Fait | Packs 80/210/500 €/an (compte / attestation / recours) avec cartes dépliables et modale « Peut-être plus tard ». |

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
- API mock : `packs.ts`, `services.ts`, `recharge.ts`, `change.ts` et `compte.ts`
  étendu (`ouvrirCompteEuro`, `crediter/debiter`, `RIB_TREEPI`, `InfosKyc`).
- Messages sous `app.flux.*` (recharge, recevoir, virement, packs, compteEuro,
  paiement, attestation, accompagnement, visa, recours, assurance) + `app.voyage`.

## Statut global et placeholders

Les deux grandes features sont livrées et vérifiées (mobile 375px + desktop
1440px, build prod vert, zéro débordement) : **Compte Euro** (Ouverture/KYC,
Recharger, Recevoir, Envoyer) et **Assurance voyage + recours visa** (Obtention
de visa, Attestation, Accompagnement, Recours, Assurance, hub Voyage).

Chaîne testable : `/app/activation` (empreinte simulée) crédite 2750 € et mène au
dashboard ; le profil propose « Ouvre ton compte Euro » (`/app/compte-euro`) tant
que le dossier n'est pas complété.

Éléments encore volontairement inertes (`title` « Bientôt disponible »), hors
périmètre ou en attente du backend :

- Entrée de navigation « Carte » et commande de carte (hors scope).
- Burger (Menu), cloche (notifications), actions rapides « Convertir » /
  « Abonnement », CTA « Recharger » des bannières post-visa.
- Volets profil pro / financières : encore en « À renseigner » (le KYC stocke
  déjà les données via `compte.kyc`, branchement d'affichage à faire).
