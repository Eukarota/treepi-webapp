"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { PRIX_SERVICE, ServiceId, souscrireService } from "@/lib/api/services";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import CoquilleApp from "@/components/app/CoquilleApp";
import GabaritFlux from "@/components/app/flux/GabaritFlux";
import EtapePaiement from "@/components/app/flux/EtapePaiement";
import EcranSucces from "@/components/app/flux/EcranSucces";
import BoutonApp from "@/components/app/ui/BoutonApp";

/*
 * Flux de souscription à un service annuel (recours visa, assurance voyage).
 * Structure commune : présentation (avantages + prix) → paiement par carte →
 * confirmation. Le contenu (textes, avantages, prix affiché) provient du
 * namespace i18n fourni ; le montant réel vient de `PRIX_SERVICE`.
 */

type Phase = "intro" | "paiement" | "succes";

export default function FluxSouscription({
  namespace,
  serviceId,
  teinte = "turquoise",
}: {
  /** Namespace des messages (ex. « app.flux.recours »). */
  namespace: string;
  serviceId: ServiceId;
  teinte?: "turquoise" | "corail";
}) {
  const t = useTranslations(namespace);
  const locale = useLocale();
  const router = useRouter();
  const { session, chargement } = useSession();

  const [phase, setPhase] = useState<Phase>("intro");
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (!chargement && !session) router.replace("/app/bienvenue");
  }, [chargement, session, router]);

  if (!session) return null;

  const avantages = t.raw("avantages") as string[];
  const prix = PRIX_SERVICE[serviceId];
  const eur = (v: number) => `${new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB").format(v)} €`;

  const quitter = () => router.push("/app/accueil");
  const retour = () => (phase === "paiement" ? setPhase("intro") : quitter());

  const payer = async () => {
    setEnvoi(true);
    await souscrireService(serviceId);
    setEnvoi(false);
    setPhase("succes");
  };

  if (phase === "succes") {
    return (
      <EcranApp className="bg-grey-light">
        <CoquilleApp barreMobile={false} flux>
          <EcranSucces titreAvant={t("succesAvant")} titreCle={t("succesCle")} texte={t("succesTexte")} cta={t("succesCta")} onContinuer={quitter} teinte={teinte} />
        </CoquilleApp>
      </EcranApp>
    );
  }

  return (
    <EcranApp className="bg-grey-light">
      <FondApp />
      <CoquilleApp barreMobile={false} flux>
      <GabaritFlux titre={t("titre")} titreAvant={t("introAvant")} titreCle={t("introCle")} description={phase === "intro" ? t("introDescription") : undefined} onRetour={retour} onQuitter={quitter}>
        {phase === "intro" && (
          <div className="flex flex-1 flex-col gap-4">
            <div className="rounded-2xl border border-grey-200 bg-white p-4">
              <ul className="flex flex-col gap-2.5">
                {avantages.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-[13px] leading-[18px] text-dark">
                    <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-primary-lighter/50 text-primary-light">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-outfit text-4xl font-bold text-dark">{eur(prix)}</span>
              <span className="text-sm font-medium text-grey">{t("prixSuffixe")}</span>
            </div>
            <div className="mt-auto pt-4">
              <BoutonApp onClick={() => setPhase("paiement")}>{t("introCta")}</BoutonApp>
            </div>
          </div>
        )}

        {phase === "paiement" && (
          <EtapePaiement
            libelle={t("payer")}
            onPayer={payer}
            envoi={envoi}
            recap={
              <div className="mt-2 flex flex-col gap-1 rounded-2xl border border-grey-200 bg-white p-4 text-sm">
                <div className="flex justify-between"><span className="text-grey">{t("recapService")}</span><span className="font-bold text-dark">{eur(prix)}</span></div>
                <hr className="my-1 border-grey-100" />
                <div className="flex justify-between"><span className="font-bold text-dark">{t("recapTotal")}</span><span className="font-bold text-primary-light">{eur(prix)}</span></div>
              </div>
            }
          />
        )}
      </GabaritFlux>
      </CoquilleApp>
    </EcranApp>
  );
}
