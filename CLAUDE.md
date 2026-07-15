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
| Création compte Euro / KYC | node `1716:528606` | À faire | Ouverture du compte Euro : renseignement des infos, vérification d'identité. Alimentera les champs « À renseigner » du profil. |
| Tutoriel (facultatif) | `/app/tutoriel` | Fait | Visite guidée du dashboard, projecteur en 3 étapes (solde, services, simulateur). |

### Tableau de bord et opérations

| Flux | Écran / Route | Statut | Rôle |
| --- | --- | --- | --- |
| Dashboard / Homepage | `/app/accueil` | Fait | Solde Euro, actions rapides, bannières pré/post-visa, transactions, « Ajouter mon visa », services, simulateur de transfert, support. Gère l'état vide « Frais de gestion ». |
| Menu + RIB-IBAN | nodes `1724:563679`, `1724:563828` | À faire | Menu latéral, coordonnées du compte (RIB / IBAN). Cible du burger. |
| Recharger le compte Euro | node `1724:564078` | À faire | Ajout d'argent (virement, dépôt). Cible des boutons « Recharger ». |
| Commande de carte | node `1724:572089` | À faire | Commande d'une carte. Cible de l'entrée « Carte ». |

### Services voyage et visa

| Flux | Écran / Route | Statut | Rôle |
| --- | --- | --- | --- |
| Attestations | nodes `1724:566850`, `1724:567219` | À faire | Attestation de garantie financière. |
| Obtention de visa | node `1724:567560` | À faire | Accompagnement de la démarche de visa. |
| Accompagnement | node `1724:571549` | À faire | Coaching / accompagnement par un expert. |
| Paiement des Packs 1/2/3 | maquettes Packs | À faire | Souscription aux offres et abonnements. |

### Profil

| Flux | Écran / Route | Statut | Rôle |
| --- | --- | --- | --- |
| Profil (hub) | `/app/profil` | Fait | Stats de voyage, accès aux trois volets d'infos. |
| Infos personnelles | `/app/profil/infos-personnelles` | Fait | Nom, prénom, civilité, téléphone, email (statuts de vérification). |
| Infos professionnelles | `/app/profil/infos-professionnelles` | Fait (placeholders) | Situation, contrat, secteur, organisme. Champs « À renseigner » en attendant le KYC. |
| Infos financières | `/app/profil/infos-financieres` | Fait (placeholders) | Ressources, certifications (US person, PPE), infos fiscales. |

## Statut global et placeholders

Chaîne testable de bout en bout : `/app/activation` (empreinte simulée) puis
« J'accède à mon compte Euro » crédite 2750 € et enchaîne le tutoriel, qui mène
au dashboard. Build de prod statique, suite fonctionnelle marketing verte.

Éléments volontairement inertes (afficher `title` « Bientôt disponible »), en
attente des flux « À faire » et du backend :

- Entrées de navigation Virement, Recharger, Voyage, Carte.
- Burger (Menu), cloche (notifications), « Voir tout », actions rapides de la
  carte, cartes de services, CTA « Recharger » des bannières.
- Volets profil pro et financières : valeurs en « À renseigner ».
