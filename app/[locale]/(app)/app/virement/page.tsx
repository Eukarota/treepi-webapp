"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { debiterCompte, obtenirCompte } from "@/lib/api/compte";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import GabaritFlux from "@/components/app/flux/GabaritFlux";
import BoutonApp from "@/components/app/ui/BoutonApp";
import ChampTexte from "@/components/app/ui/ChampTexte";
import EcranSucces from "@/components/app/flux/EcranSucces";

/*
 * Flux « Virement » (Envoyer) : bénéficiaire (nom + IBAN) → montant (borné au
 * solde disponible) → récapitulatif → confirmation. Le compte est débité à la
 * validation et le mouvement apparaît dans les transactions.
 */

type Phase = "beneficiaire" | "montant" | "recap" | "succes";

function versNombre(s: string): number {
  const n = parseFloat(s.replace(/\s/g, "").replace(",", "."));
  return Number.isNaN(n) ? 0 : n;
}

export default function PageVirement() {
  const t = useTranslations("app.flux.virement");
  const locale = useLocale();
  const router = useRouter();
  const { session, chargement } = useSession();

  const [solde] = useState(() => (typeof window === "undefined" ? 0 : obtenirCompte().soldeEuros));
  const [phase, setPhase] = useState<Phase>("beneficiaire");
  const [nom, setNom] = useState("");
  const [iban, setIban] = useState("");
  const [montantStr, setMontantStr] = useState("");
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (!chargement && !session) router.replace("/app/bienvenue");
  }, [chargement, session, router]);

  if (!session) return null;

  const montant = versNombre(montantStr);
  const nf = (v: number) => new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", { maximumFractionDigits: 2 }).format(v);
  const eur = (v: number) => `${nf(v)} €`;
  const insuffisant = montant > solde;

  const quitter = () => router.push("/app/accueil");
  const retour = () => {
    const prec: Record<Phase, Phase | null> = { beneficiaire: null, montant: "beneficiaire", recap: "montant", succes: null };
    const p = prec[phase];
    if (p) setPhase(p);
    else quitter();
  };

  const confirmer = async () => {
    setEnvoi(true);
    await debiterCompte(montant, nom.trim(), "virement");
    setEnvoi(false);
    setPhase("succes");
  };

  const etape = phase === "beneficiaire" ? 0 : phase === "montant" ? 1 : 2;

  return (
    <EcranApp className="bg-grey-light">
      {phase !== "succes" && <FondApp />}

      {phase === "succes" ? (
        <EcranSucces
          titreAvant={t("succesAvant")}
          titreCle={t("succesCle")}
          texte={t("succesTexte", { montant: eur(montant), beneficiaire: nom.trim() })}
          cta={t("cta")}
          onContinuer={() => router.replace("/app/accueil")}
        />
      ) : (
        <GabaritFlux
          titre={t("titre")}
          etape={etape}
          totalEtapes={3}
          titreAvant={t("soustitreAvant")}
          titreCle={t("soustitreCle")}
          description={t("description")}
          onRetour={retour}
          onQuitter={quitter}
        >
          {phase === "beneficiaire" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("beneficiaireTitre")}</h2>
              <ChampTexte label={t("nomLabel")} name="nom" autoComplete="off" placeholder={t("nomPlaceholder")} value={nom} onChange={(e) => setNom(e.target.value)} />
              <ChampTexte label={t("ibanLabel")} name="iban" autoComplete="off" placeholder={t("ibanPlaceholder")} value={iban} onChange={(e) => setIban(e.target.value)} />
              <div className="mt-auto pt-4">
                <BoutonApp disabled={!nom.trim() || iban.replace(/\s/g, "").length < 14} onClick={() => setPhase("montant")}>
                  {t("suivant")}
                </BoutonApp>
              </div>
            </div>
          )}

          {phase === "montant" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">
                {t("montantAvant")}
                <span className="text-gradient-secondary">{t("montantCle")}</span>
                {t("montantApres")}
              </h2>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-dark">{t("montantLabel")}</span>
                <div className={"flex h-[46px] items-center gap-2 rounded-xl border bg-white px-3 focus-within:border-primary-light " + (insuffisant ? "border-error" : "border-grey-100")}>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={montantStr}
                    onChange={(e) => setMontantStr(e.target.value.replace(/[^\d.,\s]/g, ""))}
                    placeholder="0"
                    aria-label="€"
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium text-dark outline-none placeholder:text-grey-300"
                  />
                  <span className="shrink-0 text-sm font-bold text-grey">€</span>
                </div>
                <p className={"text-[11px] leading-4 " + (insuffisant ? "text-error" : "text-grey")}>
                  {insuffisant ? t("soldeInsuffisant") : t("soldeDispo", { solde: eur(solde) })}
                </p>
              </div>
              <div className="mt-auto pt-4">
                <BoutonApp disabled={montant <= 0 || insuffisant} onClick={() => setPhase("recap")}>
                  {t("suivant")}
                </BoutonApp>
              </div>
            </div>
          )}

          {phase === "recap" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">
                {t("recapAvant")}
                <span className="text-gradient-secondary">{t("recapCle")}</span>
              </h2>
              <div className="flex flex-col gap-3 rounded-2xl border border-grey-200 bg-white p-4 text-sm">
                <div className="flex justify-between gap-3"><span className="text-grey">{t("recapBeneficiaire")}</span><span className="truncate font-bold text-dark">{nom.trim()}</span></div>
                <hr className="border-grey-100" />
                <div className="flex justify-between gap-3"><span className="shrink-0 text-grey">{t("recapIban")}</span><span className="truncate font-bold text-dark">{iban}</span></div>
                <hr className="border-grey-100" />
                <div className="flex justify-between gap-3"><span className="text-grey">{t("recapMontant")}</span><span className="font-bold text-primary-light">{eur(montant)}</span></div>
              </div>
              <div className="mt-auto pt-4">
                <BoutonApp disabled={envoi} onClick={confirmer}>
                  {t("confirmer")}
                </BoutonApp>
              </div>
            </div>
          )}
        </GabaritFlux>
      )}
    </EcranApp>
  );
}
