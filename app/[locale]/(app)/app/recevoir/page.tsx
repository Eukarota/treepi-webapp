"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { obtenirRibUtilisateur } from "@/lib/api/compte";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import GabaritFlux from "@/components/app/flux/GabaritFlux";
import LigneCopiable from "@/components/app/flux/LigneCopiable";
import BoutonApp from "@/components/app/ui/BoutonApp";
import { IconeInfo } from "@/components/app/flux/icones";

/*
 * Écran « Recevoir » : coordonnées du compte Euro de l'utilisateur (RIB/IBAN
 * personnel) à communiquer pour recevoir un virement. Copie ligne à ligne,
 * partage natif si disponible, et rappel des délais SEPA/SWIFT.
 */
export default function PageRecevoir() {
  const t = useTranslations("app.flux.recevoir");
  const router = useRouter();
  const { session, chargement } = useSession();

  useEffect(() => {
    if (!chargement && !session) router.replace("/app/bienvenue");
  }, [chargement, session, router]);

  if (!session) return null;

  const rib = obtenirRibUtilisateur(session.utilisateur);
  const quitter = () => router.push("/app/accueil");

  const partager = async () => {
    const texte = `${rib.titulaire}\nIBAN : ${rib.iban}\nBIC : ${rib.bic}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Treepi", text: texte });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(texte);
      }
    } catch {
      // Annulé ou indisponible : sans effet.
    }
  };

  return (
    <EcranApp className="bg-grey-light">
      <FondApp />
      <GabaritFlux
        titre={t("titre")}
        titreAvant={t("soustitreAvant")}
        titreCle={t("soustitreCle")}
        description={t("description")}
        onRetour={quitter}
        onQuitter={quitter}
      >
        <div className="flex flex-1 flex-col gap-4">
          <p className="text-[11px] leading-4 text-grey">{t("intro")}</p>

          <div className="flex flex-col gap-3 rounded-2xl border border-grey-200 bg-white p-4">
            <LigneCopiable label={t("titulaireLabel")} valeur={rib.titulaire} />
            <hr className="border-grey-100" />
            <LigneCopiable label={t("ibanLabel")} valeur={rib.iban} />
            <hr className="border-grey-100" />
            <LigneCopiable label={t("bicLabel")} valeur={rib.bic} />
            <hr className="border-grey-100" />
            <LigneCopiable label={t("banqueLabel")} valeur={rib.banque} />
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-primary-lighter/40 p-3 text-[11px] leading-4 text-primary-light">
            <IconeInfo className="mt-px size-4 shrink-0" />
            <div className="flex flex-col gap-1">
              <p>{t("delais")}</p>
              <p>{t("avertissement")}</p>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <BoutonApp onClick={partager}>{t("partager")}</BoutonApp>
          </div>
        </div>
      </GabaritFlux>
    </EcranApp>
  );
}
