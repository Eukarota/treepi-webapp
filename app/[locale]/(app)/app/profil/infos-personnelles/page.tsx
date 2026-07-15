"use client";

import { useTranslations } from "next-intl";
import { useSession } from "@/components/app/SessionProvider";
import GabaritProfil from "@/components/app/profil/GabaritProfil";
import RangeeInfo from "@/components/app/profil/RangeeInfo";

/*
 * Volet « Info personnelles » du profil : nom, prénom, civilité, numéro de
 * téléphone (statut « à vérifier » orange tant que le SMS n'existe pas) et
 * adresse email (validée par l'OTP de l'inscription).
 */
export default function PageInfosPersonnelles() {
  const t = useTranslations("app.profil");
  const { session } = useSession();
  if (!session) return <GabaritProfil retourVers="/app/profil">{null}</GabaritProfil>;

  const u = session.utilisateur;
  const valeur = (v: string) => v || t("aRenseigner");

  return (
    <GabaritProfil retourVers="/app/profil">
      <h2 className="mt-6 font-outfit text-base font-bold leading-6 text-dark">{t("perso.titre")}</h2>
      <div className="mt-2 rounded-lg border border-grey-200 bg-white">
        <RangeeInfo bordure={false} titre={t("perso.nom")} lignes={[valeur(u.nom)]} />
        <RangeeInfo titre={t("perso.prenom")} lignes={[valeur(u.prenom)]} />
        <RangeeInfo
          titre={t("perso.civilite")}
          lignes={[u.genre === "femme" ? t("perso.femme") : t("perso.homme")]}
        />
        <RangeeInfo titre={t("perso.telephone")} lignes={[valeur(u.telephone)]} statut="attention" />
        <RangeeInfo titre={t("perso.email")} lignes={[u.email]} statut="valide" />
      </div>
    </GabaritProfil>
  );
}
