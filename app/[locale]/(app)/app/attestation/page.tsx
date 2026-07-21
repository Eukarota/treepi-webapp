"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { obtenirCompte } from "@/lib/api/compte";
import { useCompteOuvert } from "@/lib/hooks/useCompteOuvert";
import { Attestation, genererAttestation } from "@/lib/api/services";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import CoquilleApp from "@/components/app/CoquilleApp";
import GabaritFlux from "@/components/app/flux/GabaritFlux";
import EcranSucces from "@/components/app/flux/EcranSucces";
import BoutonApp from "@/components/app/ui/BoutonApp";
import ChampDate from "@/components/app/ui/ChampDate";
import SelecteurListe from "@/components/app/ui/SelecteurListe";
import { IconeBouclier, IconeInfo } from "@/components/app/flux/icones";

/*
 * Flux « Attestation de garantie financière » : présentation → formulaire
 * (montant garanti = solde, infos de séjour) → génération → écran de succès
 * avec téléchargement et partage du document. L'encart de l'intro dépend du
 * pack souscrit (maquettes « compris / non compris dans le pack ») : incluse
 * avec le pack preuve (« Bonne nouvelle »), option payante à 100 €/an avec le
 * pack compte (« Frais »).
 */

type Phase = "intro" | "form" | "succes";

export default function PageAttestation() {
  const t = useTranslations("app.flux.attestation");
  const locale = useLocale();
  const router = useRouter();
  const { session, chargement } = useSession();
  const ouvert = useCompteOuvert();

  const [solde] = useState(() => (typeof window === "undefined" ? 0 : obtenirCompte().soldeEuros));
  // Le pack preuve (« attestation ») inclut la génération ; le pack compte non.
  const [incluse] = useState(() => (typeof window === "undefined" ? true : obtenirCompte().packId === "attestation"));
  const [phase, setPhase] = useState<Phase>("intro");
  const [pays, setPays] = useState("");
  const [motif, setMotif] = useState("");
  const [depart, setDepart] = useState("");
  const [retour, setRetour] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [doc, setDoc] = useState<Attestation | null>(null);

  useEffect(() => {
    if (!chargement && !session) router.replace("/app/bienvenue");
  }, [chargement, session, router]);

  if (!session || !ouvert) return null;
  const u = session.utilisateur;

  const motifs = t.raw("motifs") as string[];
  // L'attestation de garantie financière ne vaut que pour un séjour Schengen :
  // on restreint la destination aux seuls États membres de l'espace.
  const paysSchengen = t.raw("paysSchengen") as string[];
  const nf = (v: number) => new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", { maximumFractionDigits: 2 }).format(v);
  const eur = (v: number) => `${nf(v)} €`;
  const complete = pays.trim() !== "" && motif.trim() !== "" && depart.trim().length === 10 && retour.trim().length === 10;

  const quitter = () => router.push("/app/accueil");
  const retourNav = () => (phase === "form" ? setPhase("intro") : quitter());

  const generer = async () => {
    setEnvoi(true);
    const a = await genererAttestation({ montant: solde, pays: pays.trim(), motif: motif.trim(), dateDepart: depart.trim(), dateRetour: retour.trim() });
    setEnvoi(false);
    setDoc(a);
    setPhase("succes");
  };

  const telecharger = () => {
    if (!doc) return;
    const contenu = [
      "ATTESTATION DE GARANTIE FINANCIÈRE",
      "",
      `Référence : ${doc.reference}`,
      `Titulaire : ${u.prenom} ${u.nom}`,
      `Montant garanti : ${eur(doc.montant)}`,
      `Pays de destination : ${doc.pays}`,
      `Motif du séjour : ${doc.motif}`,
      `Départ : ${doc.dateDepart}`,
      `Retour : ${doc.dateRetour}`,
      "",
      "Treepi Payments — document généré à titre de démonstration.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([contenu], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.reference}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const partager = async () => {
    if (!doc) return;
    const texte = `${t("titre")} Treepi — ${doc.reference} — ${eur(doc.montant)}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) await navigator.share({ title: "Treepi", text: texte });
      else if (typeof navigator !== "undefined" && navigator.clipboard) await navigator.clipboard.writeText(texte);
    } catch {
      // Annulé ou indisponible.
    }
  };

  return (
    <EcranApp className="bg-grey-light">
      {phase !== "succes" && <FondApp />}

      <CoquilleApp barreMobile={false} flux>
      {phase === "succes" ? (
        <EcranSucces
          titreAvant={t("succesAvant")}
          titreCle={t("succesCle")}
          texte={t("succesTexte")}
          cta={t("telecharger")}
          onContinuer={telecharger}
          ctaSecondaire={t("partager")}
          onSecondaire={partager}
          teinte="corail"
        />
      ) : (
        <GabaritFlux titre={t("titre")} titreAvant={t("introAvant")} titreCle={t("introCle")} description={phase === "intro" ? t("introDescription") : undefined} onRetour={retourNav} onQuitter={quitter}>
          {phase === "intro" && (
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-start gap-2 rounded-xl bg-primary-lighter/40 p-3 text-[11px] leading-4 text-primary-light">
                <IconeBouclier className="mt-px size-4 shrink-0" />
                <p>{t("introReconnue")}</p>
              </div>
              {incluse ? (
                <div className="rounded-xl bg-peach/60 p-3 text-[11px] leading-4 text-dark">{t("introGratuite")}</div>
              ) : (
                <div className="rounded-xl bg-gradient-to-r from-secondary-light to-secondary p-3 text-[11px] leading-4 text-white">{t("introFrais")}</div>
              )}
              <div className="mt-auto pt-4">
                <BoutonApp onClick={() => setPhase("form")}>{t("introCta")}</BoutonApp>
              </div>
            </div>
          )}

          {phase === "form" && (
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-dark">{t("montantLabel")}</p>
                <div className="self-start rounded-xl bg-gradient-to-r from-primary-light to-primary px-5 py-2.5 font-outfit text-xl font-bold text-white shadow-app">
                  {eur(solde)}
                </div>
                <div className="flex items-start gap-2 text-[11px] leading-4 text-grey">
                  <IconeInfo className="mt-px size-3.5 shrink-0" />
                  <p>{t("montantAvertissement")}</p>
                </div>
              </div>

              <h2 className="mt-1 font-outfit text-base font-bold leading-6 text-dark">{t("sejourTitre")}</h2>
              <SelecteurListe label={t("paysLabel")} name="pays" placeholder={t("paysPlaceholder")} options={paysSchengen} value={pays} onChange={setPays} />
              <SelecteurListe label={t("motifLabel")} name="motif" placeholder={t("motifLabel")} options={motifs} value={motif} onChange={setMotif} />
              <ChampDate label={t("departLabel")} name="depart" placeholder={t("datePlaceholder")} value={depart} onChange={setDepart} />
              <ChampDate label={t("retourLabel")} name="retour" placeholder={t("datePlaceholder")} value={retour} onChange={setRetour} />

              {/* Repère de budget quotidien à prévoir pour le consulat. */}
              <div className="flex items-start gap-2 rounded-xl border border-primary-lighter bg-primary-lighter/40 p-3 text-xs leading-5 text-primary-light">
                <IconeInfo className="mt-0.5 size-4 shrink-0" />
                <p>{t("budgetInfo")}</p>
              </div>

              <div className="mt-auto pt-4">
                <BoutonApp disabled={!complete || envoi} onClick={generer}>
                  {t("genererCta")}
                </BoutonApp>
              </div>
            </div>
          )}
        </GabaritFlux>
      )}
      </CoquilleApp>
    </EcranApp>
  );
}
