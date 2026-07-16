"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { CanalRdv, PACKS_ACCOMPAGNEMENT, PackAccId, reserverAccompagnement, trouverPackAcc } from "@/lib/api/services";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import CoquilleApp from "@/components/app/CoquilleApp";
import GabaritFlux from "@/components/app/flux/GabaritFlux";
import ChoixOption from "@/components/app/flux/ChoixOption";
import EtapePaiement from "@/components/app/flux/EtapePaiement";
import EcranSucces from "@/components/app/flux/EcranSucces";
import BoutonApp from "@/components/app/ui/BoutonApp";
import { IconeCalendrier, IconePin, IconeTelephone } from "@/components/app/flux/icones";

/*
 * Flux « Accompagnement expert » : présentation de l'offre → prise de
 * rendez-vous (téléphone / bureau + créneau) → choix de la formule (solo,
 * famille, parent) → paiement → confirmation. La 1re heure de coaching est
 * offerte ; le paiement porte sur la formule d'accompagnement retenue.
 */

type Phase = "intro" | "rdv" | "tarifs" | "paiement" | "succes";
interface PackTexte {
  id: PackAccId;
  nom: string;
  sous: string;
}

export default function PageAccompagnement() {
  const t = useTranslations("app.flux.accompagnement");
  const locale = useLocale();
  const router = useRouter();
  const { session, chargement } = useSession();

  const [phase, setPhase] = useState<Phase>("intro");
  const [canal, setCanal] = useState<CanalRdv | null>(null);
  const [packSel, setPackSel] = useState<PackAccId | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (!chargement && !session) router.replace("/app/bienvenue");
  }, [chargement, session, router]);

  if (!session) return null;

  const packs = t.raw("packs") as PackTexte[];
  const offreItems = t.raw("offreItems") as string[];
  const nf = (v: number) => new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", { maximumFractionDigits: 0 }).format(v);
  const eur = (v: number) => `${nf(v)} €`;
  const prix = packSel ? trouverPackAcc(packSel).prix : 0;

  const quitter = () => router.push("/app/accueil");
  const retour = () => {
    const prec: Record<Phase, Phase | null> = { intro: null, rdv: "intro", tarifs: "rdv", paiement: "tarifs", succes: null };
    const p = prec[phase];
    if (p) setPhase(p);
    else quitter();
  };

  const payer = async () => {
    if (!canal || !packSel) return;
    setEnvoi(true);
    const r = await reserverAccompagnement({ canal, packId: packSel });
    setEnvoi(false);
    setReference(r.reference);
    setPhase("succes");
  };

  // Puce turquoise des avantages inclus.
  const puce = () => (
    <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-primary-lighter/50 text-primary-light">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
    </span>
  );

  if (phase === "succes") {
    return (
      <EcranApp className="bg-grey-light">
        <CoquilleApp barreMobile={false} flux>
          <EcranSucces titreAvant={t("succesAvant")} titreCle={t("succesCle")} texte={t("succesTexte", { reference })} cta={t("succesCta")} onContinuer={quitter} />
        </CoquilleApp>
      </EcranApp>
    );
  }

  const sousTitre =
    phase === "intro"
      ? { avant: t("introAvant"), cle: t("introCle"), apres: t("introApres") }
      : phase === "rdv"
        ? { avant: t("rdvAvant"), cle: t("rdvCle"), apres: "" }
        : { avant: t("tarifsAvant"), cle: t("tarifsCle"), apres: "" };

  return (
    <EcranApp className="bg-grey-light">
      <FondApp />
      <CoquilleApp barreMobile={false} flux>
      <GabaritFlux titre={t("titre")} onRetour={retour} onQuitter={quitter}>
        {/* Sous-titre commun (corail sur le mot-clé), rendu dans la feuille. */}
        <h1 className="font-outfit text-lg font-bold leading-[26px] text-dark">
          {sousTitre.avant}
          <span className="text-gradient-secondary">{sousTitre.cle}</span>
          {sousTitre.apres}
        </h1>

        {phase === "intro" && (
          <div className="mt-4 flex flex-1 flex-col gap-4">
            <div className="rounded-xl bg-peach/60 p-3 text-xs leading-4 text-dark">{t("introBadge")}</div>
            <div className="rounded-2xl border border-grey-200 bg-white p-4">
              <p className="text-sm font-bold text-dark">{t("offreTitre")}</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {offreItems.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-[13px] leading-[18px] text-dark">
                    {puce()}
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-4">
              <BoutonApp onClick={() => setPhase("rdv")}>{t("introCta")}</BoutonApp>
            </div>
          </div>
        )}

        {phase === "rdv" && (
          <div className="mt-4 flex flex-1 flex-col gap-3">
            <ChoixOption icone={<IconeTelephone className="size-5 text-primary-light" />} titre={t("canalTelephone")} sousTitre={t("canalTelephoneSous")} fin="radio" actif={canal === "telephone"} onClick={() => setCanal("telephone")} />
            <ChoixOption icone={<IconePin className="size-5 text-secondary" />} couleurIcone="#ffe8e8" titre={t("canalBureau")} sousTitre={t("canalBureauSous")} fin="radio" actif={canal === "bureau"} onClick={() => setCanal("bureau")} />
            <p className="mt-2 text-sm font-bold text-dark">{t("reserveTitre")}</p>
            <ChoixOption icone={<IconeCalendrier className="size-5 text-primary-light" />} titre={t("calendly")} sousTitre={t("calendlySous")} fin="chevron" />
            <div className="mt-auto pt-4">
              <BoutonApp disabled={!canal} onClick={() => setPhase("tarifs")}>
                {t("rdvCta")}
              </BoutonApp>
            </div>
          </div>
        )}

        {phase === "tarifs" && (
          <div className="mt-4 flex flex-1 flex-col gap-3">
            {PACKS_ACCOMPAGNEMENT.map((p) => {
              const infos = packs.find((x) => x.id === p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPackSel(p.id);
                    setPhase("paiement");
                  }}
                  className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-light to-primary p-4 text-left text-white shadow-app transition-transform hover:-translate-y-0.5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-outfit text-base font-bold leading-6">{infos?.nom}</span>
                    <span className="mt-0.5 block text-[11px] leading-4 text-white/90">{infos?.sous}</span>
                  </span>
                  <span className="shrink-0 font-outfit text-lg font-bold">{eur(p.prix)}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="m9 6 6 6-6 6" /></svg>
                </button>
              );
            })}
          </div>
        )}

        {phase === "paiement" && packSel && (
          <div className="mt-4 flex flex-1 flex-col">
            <EtapePaiement
              libelle={t("payer", { montant: eur(prix) })}
              onPayer={payer}
              envoi={envoi}
              recap={
                <div className="mt-2 flex flex-col gap-1 rounded-2xl border border-grey-200 bg-white p-4 text-sm">
                  <div className="flex justify-between"><span className="text-grey">{t("recapService")}</span><span className="font-bold text-dark">{packs.find((x) => x.id === packSel)?.nom}</span></div>
                  <hr className="my-1 border-grey-100" />
                  <div className="flex justify-between"><span className="font-bold text-dark">{t("recapTotal")}</span><span className="font-bold text-primary-light">{eur(prix)}</span></div>
                </div>
              }
            />
          </div>
        )}
      </GabaritFlux>
      </CoquilleApp>
    </EcranApp>
  );
}
