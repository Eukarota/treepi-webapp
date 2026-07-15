"use client";

import { useTranslations } from "next-intl";
import GabaritProfil from "@/components/app/profil/GabaritProfil";
import RangeeInfo from "@/components/app/profil/RangeeInfo";

/*
 * Volet « Info financières » du profil : ressources, certifications de
 * statut (US person, personne politiquement exposée) et informations
 * fiscales. Alimenté plus tard par le flux KYC (TODO) ; les certifications
 * sont le texte exact des maquettes.
 */
export default function PageInfosFinancieres() {
  const t = useTranslations("app.profil");

  return (
    <GabaritProfil retourVers="/app/profil">
      <h2 className="mt-6 font-outfit text-base font-bold leading-6 text-dark">{t("fi.titre")}</h2>
      <div className="mt-2 rounded-lg border border-grey-200 bg-white">
        <RangeeInfo
          bordure={false}
          titre={t("fi.ressources")}
          lignes={[
            <>{t("fi.revenu")}{t("aRenseigner")}</>,
            <>{t("fi.patrimoine")}{t("aRenseigner")}</>,
          ]}
        />
        <RangeeInfo
          titre={t("fi.statut")}
          lignes={[<>• {t("fi.statutUs")}</>, <>• {t("fi.statutPpe")}</>]}
        />
        <RangeeInfo
          titre={t("fi.fiscales")}
          lignes={[
            <>{t("fi.paysFiscal")}{t("aRenseigner")}</>,
            <>{t("fi.niu")}{t("aRenseigner")}</>,
            <>{t("fi.attestation")}</>,
          ]}
        />
      </div>
    </GabaritProfil>
  );
}
