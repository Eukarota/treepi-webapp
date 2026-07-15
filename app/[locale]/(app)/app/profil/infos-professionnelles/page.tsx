"use client";

import { useTranslations } from "next-intl";
import GabaritProfil from "@/components/app/profil/GabaritProfil";
import RangeeInfo from "@/components/app/profil/RangeeInfo";

/*
 * Volet « Info professionnelles » du profil : situation, type de contrat,
 * secteur d'activité et organisme. Ces champs seront alimentés par le flux
 * « Renseignement des informations » de la création du compte Euro (TODO) ;
 * en attendant ils affichent « À renseigner ».
 */
export default function PageInfosProfessionnelles() {
  const t = useTranslations("app.profil");

  return (
    <GabaritProfil retourVers="/app/profil">
      <h2 className="mt-6 font-outfit text-base font-bold leading-6 text-dark">{t("pro.titre")}</h2>
      <div className="mt-2 rounded-lg border border-grey-200 bg-white">
        <RangeeInfo bordure={false} titre={t("pro.situation")} lignes={[t("aRenseigner")]} />
        <RangeeInfo titre={t("pro.contrat")} lignes={[t("aRenseigner")]} />
        <RangeeInfo titre={t("pro.secteur")} lignes={[t("aRenseigner")]} />
        <RangeeInfo
          titre={t("pro.organisme")}
          lignes={[
            <>{t("pro.organismeNom")}{t("aRenseigner")}</>,
            <>{t("pro.organismeDepuis")}{t("aRenseigner")}</>,
          ]}
        />
      </div>
    </GabaritProfil>
  );
}
