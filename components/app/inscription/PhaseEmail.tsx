"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { demanderOtp, verifierOtp } from "@/lib/api/auth";
import GabaritEtape from "./GabaritEtape";
import BoutonApp from "@/components/app/ui/BoutonApp";
import ChampTexte from "@/components/app/ui/ChampTexte";
import ChampOtp from "@/components/app/ui/ChampOtp";

/*
 * Phase 1 de l'inscription : l'email (maquettes « Inscription/Email/Step1-3 »).
 *  – 1/3 : saisie de l'adresse email ;
 *  – 2/3 : confirmation d'envoi du code (conseil anti-spam, expiration) ;
 *  – 3/3 : saisie du code OTP à 6 chiffres.
 * L'envoi et la vérification passent par la couche lib/api simulée.
 */
export default function PhaseEmail({
  emailInitial,
  onTerminee,
  onAbandon,
  onQuitter,
}: {
  emailInitial?: string;
  /** Appelée avec l'email vérifié quand le code OTP est validé. */
  onTerminee: (email: string) => void;
  /** Retour arrière depuis la première sous-étape (écran précédent). */
  onAbandon: () => void;
  onQuitter: () => void;
}) {
  const t = useTranslations("app.inscription");
  const [sousEtape, setSousEtape] = useState<0 | 1 | 2>(0);
  const [email, setEmail] = useState(emailInitial ?? "");
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /** 1/3 → 2/3 : demande d'envoi du code à l'adresse saisie. */
  const envoyerCode = async () => {
    setEnCours(true);
    setErreur(null);
    const resultat = await demanderOtp(email);
    setEnCours(false);
    if (!resultat.ok) {
      setErreur(t("email1.erreurExistant"));
      return;
    }
    setSousEtape(1);
  };

  /** 3/3 : vérification du code OTP saisi. */
  const verifierCode = async () => {
    setEnCours(true);
    setErreur(null);
    const resultat = await verifierOtp(email, code);
    setEnCours(false);
    if (!resultat.ok) {
      setErreur(t("email3.erreur"));
      return;
    }
    onTerminee(email);
  };

  /** Renvoi simulé du code : repart d'un code vide, sans erreur. */
  const renvoyerCode = () => {
    setCode("");
    setErreur(null);
  };

  return (
    <GabaritEtape
      phase={0}
      titreAvant={t("phases.email.titreAvant")}
      titreCle={t("phases.email.titreCle")}
      description={t("phases.email.description")}
      bulle={`${sousEtape + 1}/3`}
      onRetour={() => (sousEtape === 0 ? onAbandon() : setSousEtape((s) => (s - 1) as 0 | 1))}
      onQuitter={onQuitter}
    >
      {sousEtape === 0 && (
        <>
          <ChampTexte
            label={t("email1.label")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("email1.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            erreur={erreur ?? undefined}
          />
          <div className="mt-auto pt-8">
            <BoutonApp disabled={!emailValide || enCours} onClick={envoyerCode}>
              {t("continuer")}
            </BoutonApp>
          </div>
        </>
      )}

      {sousEtape === 1 && (
        <>
          <div className="flex flex-col gap-5 text-sm leading-[22px] text-dark">
            <p>{t("email2.envoye")}</p>
            <p className="text-center font-bold">{email}</p>
            <p>
              {t("email2.spamAvant")}
              <span className="text-primary-light">{t("email2.spamMarque")}</span>
              {t("email2.spamApres")}
            </p>
            <p className="font-bold text-error">{t("email2.expiration")}</p>
          </div>
          <div className="mt-8 flex flex-col gap-2">
            <BoutonApp onClick={() => setSousEtape(2)}>{t("email2.entrerCode")}</BoutonApp>
            <BoutonApp variante="neutre" onClick={renvoyerCode}>
              {t("email2.renvoyer")}
            </BoutonApp>
          </div>
          <button
            type="button"
            onClick={() => setSousEtape(0)}
            className="mt-auto self-center text-xs leading-4 text-grey-700 underline hover:text-dark"
          >
            {t("email2.mauvaiseAdresse")}
          </button>
        </>
      )}

      {sousEtape === 2 && (
        <>
          <p className="text-sm leading-[22px] text-dark">{t("email3.consigne")}</p>
          <div className="mt-6 flex flex-col gap-2">
            <span className="text-xs font-bold leading-[22px] text-dark">{t("email3.label")}</span>
            <ChampOtp valeur={code} onChange={setCode} />
            {erreur && <p className="text-xs leading-4 text-error">{erreur}</p>}
          </div>
          <div className="mt-auto flex flex-col gap-2 pt-8">
            <BoutonApp disabled={code.length < 6 || enCours} onClick={verifierCode}>
              {t("email3.verifier")}
            </BoutonApp>
            <BoutonApp variante="neutre" onClick={renvoyerCode}>
              {t("email3.renvoyer")}
            </BoutonApp>
          </div>
        </>
      )}
    </GabaritEtape>
  );
}
