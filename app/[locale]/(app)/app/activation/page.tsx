"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { seConnecter } from "@/lib/api/auth";
import { activerCompte } from "@/lib/api/compte";
import { useSession } from "@/components/app/SessionProvider";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import BoutonApp from "@/components/app/ui/BoutonApp";
import ChampTexte from "@/components/app/ui/ChampTexte";
import PiedLegal from "@/components/app/ui/PiedLegal";
import Swirl from "@/components/ui/Swirl";

/*
 * Activation du compte Euro (section « Activation compte » des maquettes) :
 *  1. reconnexion avec proposition biométrique (« Ou utilise l'empreinte
 *     digitale ou faciale ») ; la biométrie est simulée et réussit toujours ;
 *  2. écran « Félicitations ton compte Euro a été créé » (dégradé orange,
 *     high-five, arche blanche) ; « J'accède à mon compte Euro » crédite le
 *     compte (maquette Pack 2 option dépôt) puis lance le tutoriel.
 */
export default function PageActivation() {
  const t = useTranslations("app");
  const router = useRouter();
  const { ouvrirSession, session } = useSession();

  const [etape, setEtape] = useState<"login" | "felicitations">("login");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [enCours, setEnCours] = useState(false);

  /** Connexion classique ou biométrique (toujours acceptée en mode test). */
  const connecter = async (biometrie: boolean) => {
    setEnCours(true);
    const resultat = await seConnecter(
      biometrie ? (session?.utilisateur.email ?? "demo@treepi.app") : email,
      biometrie ? "" : motDePasse
    );
    setEnCours(false);
    if (resultat.ok) {
      ouvrirSession(resultat.donnees);
      setEtape("felicitations");
    }
  };

  /** Crédite le compte activé puis enchaîne sur le tutoriel facultatif. */
  const accederAuCompte = async () => {
    setEnCours(true);
    await activerCompte();
    router.replace("/app/tutoriel");
  };

  if (etape === "felicitations") {
    return (
      <EcranApp>
        <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-secondary-light to-secondary">
          <Swirl className="absolute inset-0 h-full w-full mix-blend-soft-light" />

          {/* High-five (mêmes calques que l'écran « Bravo ! »). */}
          <div className="relative mx-auto mt-16 aspect-[254/272] w-[254px] max-w-[65%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/illustrations/highfive/graphics.svg" alt="" className="absolute" style={{ left: "0.11%", top: "2.87%", width: "99.78%", height: "91.68%" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/illustrations/highfive/lines.svg" alt="" className="absolute" style={{ left: "15.15%", top: "0.31%", width: "66.9%", height: "51.71%" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/illustrations/highfive/hand-2.svg" alt="" className="absolute" style={{ left: "43.42%", top: "5.42%", width: "56.26%", height: "94.48%" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/illustrations/highfive/hand-1.svg" alt="" className="absolute" style={{ left: "10.53%", top: "7.48%", width: "44.27%", height: "92.42%" }} />
          </div>

          <div className="relative mt-auto flex justify-center">
            <div className="w-[178%] max-w-none rounded-t-[50%] bg-white pb-10 pt-14 md:w-[120%]">
              <div className="mx-auto w-full max-w-[272px] md:max-w-md md:px-6">
                <h1 className="font-outfit text-2xl font-bold leading-8 text-dark">
                  {t("activation.felicitationsAvant")}
                  <span className="text-gradient-primary">{t("activation.felicitationsCle")}</span>
                  {t("activation.felicitationsApres")}
                </h1>
                <p className="mt-2 text-sm leading-[22px] text-dark">{t("activation.sousTitre")}</p>
                <div className="mt-8">
                  <BoutonApp onClick={accederAuCompte} disabled={enCours}>
                    {t("activation.acceder")}
                  </BoutonApp>
                </div>
              </div>
            </div>
          </div>
        </div>
      </EcranApp>
    );
  }

  return (
    <EcranApp className="md:justify-center">
      <FondApp />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          connecter(false);
        }}
        className="colonne-app relative z-10 pb-8 md:py-16"
      >
        <h1 className="mt-[4.5rem] text-center font-outfit text-2xl font-bold leading-8 text-dark md:mt-0">
          {t("commun.bienvenueSur")}
          <br />
          <span className="text-gradient-secondary">{t("commun.treepi")}</span>
        </h1>

        <div className="mt-10 flex flex-col gap-2">
          <ChampTexte
            label={t("connexion.identifiant")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("connexion.identifiantPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ChampTexte
            label={t("connexion.motDePasse")}
            name="motDePasse"
            type="password"
            autoComplete="current-password"
            placeholder={t("connexion.motDePassePlaceholder")}
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
        </div>

        {/* Alternative biométrique simulée (maquette « Activation »). */}
        <button
          type="button"
          onClick={() => connecter(true)}
          className="mt-4 text-center text-sm leading-[22px] text-primary-light hover:underline"
        >
          {t("activation.biometrie")}
        </button>

        <div className="mt-auto md:mt-12">
          <BoutonApp type="submit" disabled={!email || !motDePasse || enCours}>
            {t("connexion.connecter")}
          </BoutonApp>
        </div>
        <div className="mt-8">
          <PiedLegal />
        </div>
      </form>
    </EcranApp>
  );
}
