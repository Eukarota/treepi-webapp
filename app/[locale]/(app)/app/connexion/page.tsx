"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { seConnecter, reinitialiserMotDePasse, MAX_TENTATIVES } from "@/lib/api/auth";
import { useSession } from "@/components/app/SessionProvider";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import BoutonApp from "@/components/app/ui/BoutonApp";
import ChampTexte from "@/components/app/ui/ChampTexte";
import ModaleApp from "@/components/app/ui/ModaleApp";
import PiedLegal from "@/components/app/ui/PiedLegal";

/*
 * Écran de connexion (maquettes « Login » et variantes d'erreur
 * Tentative1/3 à 3/3, plus les deux modales « Mot de passe oublié »).
 *
 * États reproduits :
 *  – bouton désactivé (turquoise clair) tant que les champs sont vides ;
 *  – erreur : champs bordés de rouge, messages sous chaque champ et rappel
 *    du nombre de tentatives restantes en gras ;
 *  – compte verrouillé après 3 échecs (simulation lib/api) ;
 *  – modale 1 : proposition de réinitialisation ; modale 2 : confirmation
 *    d'envoi avec l'adresse saisie.
 */
export default function PageConnexion() {
  const t = useTranslations("app.connexion");
  const tCommun = useTranslations("app.commun");
  const router = useRouter();
  const { ouvrirSession } = useSession();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [enCours, setEnCours] = useState(false);
  /** null = pas d'erreur ; sinon détail de l'échec pour l'affichage. */
  const [erreur, setErreur] = useState<{ verrouille: boolean; restantes: number } | null>(null);
  /** Étape de la modale « mot de passe oublié » (0 = fermée). */
  const [modale, setModale] = useState<0 | 1 | 2>(0);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    const resultat = await seConnecter(email, motDePasse);
    setEnCours(false);
    if (resultat.ok) {
      ouvrirSession(resultat.donnees);
      router.replace("/app/accueil");
      return;
    }
    setErreur({
      verrouille: resultat.code === "compte-verrouille",
      restantes: resultat.tentativesRestantes ?? MAX_TENTATIVES,
    });
  };

  /** Confirme la réinitialisation (modale 1 → 2), envoi simulé. */
  const confirmerReset = async () => {
    await reinitialiserMotDePasse(email);
    setModale(2);
  };

  return (
    <EcranApp className="md:justify-center">
      <FondApp />
      <form onSubmit={soumettre} className="colonne-app relative z-10 pb-8 md:py-16">
        {/* Titre : « Bienvenue sur Treepi » (Treepi au dégradé corail). */}
        <h1 className="mt-[4.5rem] text-center font-outfit text-2xl font-bold leading-8 text-dark">
          {tCommun("bienvenueSur")}
          <br />
          <span className="text-gradient-secondary">{tCommun("treepi")}</span>
        </h1>

        <div className="mt-10 flex flex-col gap-2">
          <ChampTexte
            label={t("identifiant")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("identifiantPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            erreur={erreur && !erreur.verrouille ? t("erreurEmail") : undefined}
          />
          <div className="flex flex-col gap-1">
            <ChampTexte
              label={t("motDePasse")}
              name="motDePasse"
              type="password"
              autoComplete="current-password"
              placeholder={t("motDePassePlaceholder")}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              erreur={erreur && !erreur.verrouille ? t("erreurMotDePasse") : undefined}
            />
            <button
              type="button"
              onClick={() => setModale(1)}
              className="self-end text-xs leading-[22px] text-primary-light hover:underline"
            >
              {t("oublie")}
            </button>
          </div>

          {/* Rappel des tentatives restantes ou compte verrouillé. */}
          {erreur && !erreur.verrouille && (
            <p className="text-xs leading-4 text-error">
              {t.rich("tentativesRestantes", {
                restantes: erreur.restantes,
                b: (contenu) => <b>{contenu}</b>,
              })}
            </p>
          )}
          {erreur?.verrouille && <p className="text-xs leading-4 text-error">{t("compteVerrouille")}</p>}
        </div>

        <div className="mt-auto md:mt-12">
          <BoutonApp type="submit" disabled={!email || !motDePasse || enCours}>
            {t("connecter")}
          </BoutonApp>
        </div>
        <div className="mt-8">
          <PiedLegal />
        </div>
      </form>

      {/* Modale 1 : proposition de réinitialisation du mot de passe. */}
      <ModaleApp
        ouverte={modale === 1}
        onFermer={() => setModale(0)}
        titreAvant={t("modalResetTitreAvant")}
        titreCle={t("modalResetTitreCle")}
        libelleFermer={t("fermer")}
      >
        <p>{t("modalResetCorps")}</p>
        <BoutonApp onClick={confirmerReset}>{t("modalResetBouton")}</BoutonApp>
      </ModaleApp>

      {/* Modale 2 : confirmation d'envoi des instructions. */}
      <ModaleApp
        ouverte={modale === 2}
        onFermer={() => setModale(0)}
        titreAvant={t("modalEmailTitreAvant")}
        titreCle={t("modalEmailTitreCle")}
        libelleFermer={t("fermer")}
      >
        <p>
          {t("modalEmailCorpsAvant")}
          <b>{email || "email@exemple.com"}</b>.
        </p>
        <BoutonApp onClick={() => setModale(0)}>{t("modalEmailBouton")}</BoutonApp>
      </ModaleApp>
    </EcranApp>
  );
}
