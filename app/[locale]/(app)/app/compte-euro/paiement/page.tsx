"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { genererId } from "@/lib/api/client";
import { trouverPack, type PackId } from "@/lib/api/packs";
import {
  RIB_TREEPI,
  fraisTransfertOuverture,
  obtenirCompte,
  soumettrePaiementOuverture,
  type CanalPaiement,
  type CompteEuro,
  type TypeFinanceur,
} from "@/lib/api/compte";
import { convertir, tauxEntre } from "@/lib/api/change";
import { useTauxTempsReel } from "@/lib/hooks/useTaux";
import { nomsPaysAfrique } from "@/lib/data/afrique";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import CoquilleApp from "@/components/app/CoquilleApp";
import GabaritFlux from "@/components/app/flux/GabaritFlux";
import ChoixOption from "@/components/app/flux/ChoixOption";
import FeuilleBasse from "@/components/app/flux/FeuilleBasse";
import LigneCopiable from "@/components/app/flux/LigneCopiable";
import ChampFichier, { type FichierChoisi } from "@/components/app/flux/ChampFichier";
import EcranSucces from "@/components/app/flux/EcranSucces";
import BoutonApp from "@/components/app/ui/BoutonApp";
import ChampTexte from "@/components/app/ui/ChampTexte";
import SelecteurListe from "@/components/app/ui/SelecteurListe";
import { IconeEspeces, IconeGlobe, IconeInfo, IconeMallette, IconePersonne, IconePin, IconeVirement } from "@/components/app/flux/icones";

/*
 * Paiement d'ouverture du compte Euro : l'étape « Effectue ton paiement » de la
 * checklist, entre la signature du dossier et l'activation (sections Figma
 * « Paiement Pack 1 (compte euro + carte) » et « Paiement Pack 2 (attestation
 * de solde) »). Le canal est toujours un money-in avec justificatif (dépôt
 * d'espèces auprès d'une banque partenaire, virement local ou virement
 * Europe), jamais une carte.
 *
 *  – Pack « compte » (Frais de gestion de compte) : on ne règle que les frais
 *    annuels du pack ; le compte s'activera à solde nul.
 *  – Pack « attestation » (Financer mon voyage) : le paiement EST la première
 *    recharge ; le montant crédité constitue la preuve de fonds, les frais du
 *    pack sont fondus dans le total, et le volet conformité s'ajoute (qui
 *    finance le voyage, pièce du financeur tiers, provenance des fonds).
 *
 * La soumission du justificatif place le compte en `attente-validation`
 * (écran « pris en compte », vérification simulée ~25 s côté mock).
 */

type Phase =
  | "canal"
  | "origine"
  | "pays"
  | "montant"
  | "instructions"
  | "financeur"
  | "financeur-details"
  | "provenance"
  | "justificatif"
  | "soumis";

/** Choix de premier niveau du canal (le virement se précise ensuite). */
type CanalChoix = "virement" | "especes";

function versNombre(saisie: string): number {
  const n = parseFloat(saisie.replace(/\s/g, "").replace(",", "."));
  return Number.isNaN(n) ? 0 : n;
}

export default function PagePaiementOuverture() {
  const t = useTranslations("app.flux.paiementOuverture");
  const c = useTranslations("app.commun");
  const locale = useLocale();
  const router = useRouter();
  const { session, chargement } = useSession();
  // Taux EUR→FCFA temps réel pour les équivalents affichés.
  useTauxTempsReel();

  // Dossier lu au montage : la page ne sert qu'en `attente-paiement` ; la
  // progression locale (phase « soumis ») ne relit pas cet état initial.
  const [dossier] = useState<CompteEuro | null>(() => (typeof window === "undefined" ? null : obtenirCompte()));
  const etatInitial = dossier?.etatOuverture ?? "aucun";

  const [phase, setPhase] = useState<Phase>("canal");
  const [canal, setCanal] = useState<CanalChoix | null>(null);
  const [origine, setOrigine] = useState<"local" | "europe" | null>(null);
  const [paysDepot, setPaysDepot] = useState("");
  const [infoOuverte, setInfoOuverte] = useState(true);
  const [consenti, setConsenti] = useState(false);
  const [montantStr, setMontantStr] = useState("");
  const [financeurType, setFinanceurType] = useState<TypeFinanceur | null>(null);
  const [fNom, setFNom] = useState("");
  const [fPrenom, setFPrenom] = useState("");
  const [fLien, setFLien] = useState("");
  const [fRaison, setFRaison] = useState("");
  const [fTelephone, setFTelephone] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPrecision, setFPrecision] = useState("");
  const [fPiece, setFPiece] = useState<FichierChoisi | null>(null);
  const [provenance, setProvenance] = useState("");
  const [justif, setJustif] = useState<FichierChoisi | null>(null);
  const [reference] = useState(() => "OUV-" + genererId().slice(0, 8).toUpperCase());
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (!chargement && !session) {
      router.replace("/app/bienvenue");
      return;
    }
    // Pas de dossier signé : retour au parcours d'ouverture ; déjà soumis ou
    // actif : retour à l'accueil (bannière d'attente ou dashboard).
    if (etatInitial === "aucun") router.replace("/app/compte-euro");
    else if (etatInitial !== "attente-paiement") router.replace("/app/accueil");
  }, [chargement, session, router, etatInitial]);

  if (!session || etatInitial !== "attente-paiement") return null;

  const packId: PackId = dossier?.packId ?? "compte";
  const estPreuve = packId === "attestation";
  const fraisPack = trouverPack(packId).prixAnnuel;

  const canalFinal: CanalPaiement | null =
    canal === "especes" ? "especes" : canal === "virement" && origine ? (origine === "local" ? "virement-local" : "virement-europe") : null;
  const montantCredite = estPreuve ? versNombre(montantStr) : 0;
  const base = montantCredite + fraisPack;
  const fraisTransfert = canalFinal ? fraisTransfertOuverture(canalFinal, base) : 0;
  const total = Math.round((base + fraisTransfert) * 100) / 100;
  const taux = tauxEntre("EUR", "XOF");

  const nf = (v: number, d = 2) => new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", { maximumFractionDigits: d }).format(v);
  const eur = (v: number) => `${nf(v)} €`;
  const fcfa = (v: number) => `${nf(convertir(v, "EUR", "XOF"), 0)} FCFA`;

  // Ordre des étapes pour l'indicateur : « pays » partage l'index d'« origine »
  // et le détail du financeur celui du choix du financeur.
  const ordre: Phase[] = estPreuve
    ? ["canal", "origine", "montant", "instructions", "financeur", "provenance", "justificatif"]
    : ["canal", "origine", "montant", "instructions", "justificatif"];
  const phaseIndicateur = phase === "pays" ? "origine" : phase === "financeur-details" ? "financeur" : phase;
  const etape = Math.max(0, ordre.indexOf(phaseIndicateur));

  const quitter = () => router.push("/app/accueil");
  const retour = () => {
    const prec: Record<Phase, Phase | null> = {
      canal: null,
      origine: "canal",
      pays: "canal",
      montant: canal === "especes" ? "pays" : "origine",
      instructions: "montant",
      financeur: "instructions",
      "financeur-details": "financeur",
      provenance: financeurType === "moi" ? "financeur" : "financeur-details",
      justificatif: estPreuve ? "provenance" : "instructions",
      soumis: null,
    };
    const p = prec[phase];
    if (p) setPhase(p);
    else quitter();
  };

  const financeurValide =
    financeurType === "moi" ||
    (financeurType === "famille" && fNom.trim() !== "" && fPrenom.trim() !== "" && fLien.trim() !== "" && fPiece !== null) ||
    (financeurType === "entreprise" && fRaison.trim() !== "" && fPiece !== null) ||
    (financeurType === "autre" && fPrecision.trim() !== "" && fPiece !== null);

  const soumettre = async () => {
    if (!canalFinal || !justif) return;
    setEnvoi(true);
    await soumettrePaiementOuverture({
      canal: canalFinal,
      paysDepot: canal === "especes" ? paysDepot.trim() : undefined,
      montantCredite,
      fraisPack,
      fraisTransfert,
      total,
      financeur:
        estPreuve && financeurType
          ? {
              type: financeurType,
              nom: fNom.trim() || undefined,
              prenom: fPrenom.trim() || undefined,
              lienParente: fLien.trim() || undefined,
              raisonSociale: fRaison.trim() || undefined,
              telephone: fTelephone.trim() || undefined,
              email: fEmail.trim() || undefined,
              precision: fPrecision.trim() || undefined,
              piece: fPiece?.nom,
            }
          : undefined,
      provenanceFonds: estPreuve ? provenance.trim() : undefined,
      justificatif: justif.nom,
    });
    setEnvoi(false);
    setPhase("soumis");
  };

  // Champ de montant avec suffixe devise (même gabarit que la recharge).
  const champMontant = (valeur: string, onCh: ((v: string) => void) | null, devise: string) => (
    <div className={"flex h-[46px] items-center gap-2 rounded-xl border border-grey-100 bg-white px-3 " + (onCh ? "focus-within:border-primary-light" : "opacity-90")}>
      <input
        type="text"
        inputMode="decimal"
        value={valeur}
        readOnly={!onCh}
        onChange={onCh ? (e) => onCh(e.target.value.replace(/[^\d.,\s]/g, "")) : undefined}
        placeholder="0"
        aria-label={devise}
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-dark outline-none placeholder:text-grey-300"
      />
      <span className="shrink-0 text-sm font-bold text-grey">{devise}</span>
    </div>
  );

  // Décomposition du paiement (montant crédité, frais du pack, transfert, total).
  const lignesMontant = () => (
    <dl className="flex flex-col gap-1 text-sm">
      {estPreuve && (
        <div className="flex justify-between">
          <dt className="font-bold text-dark">{t("ligneCredite")}</dt>
          <dd className="text-dark">{eur(montantCredite)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="font-bold text-dark">{t("ligneFraisPack")}</dt>
        <dd className="text-dark">{eur(fraisPack)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="font-bold text-dark">{t("ligneFraisTransfert")}</dt>
        <dd className="text-dark">{eur(fraisTransfert)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="font-bold text-dark">{canal === "especes" ? t("ligneTotalDepot") : t("ligneTotalVirement")}</dt>
        <dd className="text-right text-dark">
          <span className="font-bold text-primary-light">{eur(total)}</span>
          <span className="block text-[10px] leading-4 text-grey">{t("soit", { valeur: fcfa(total) })}</span>
        </dd>
      </div>
    </dl>
  );

  // Alerte réglementaire : montant exact, référence, fenêtre de 30 jours.
  const alerte = () => (
    <div className="flex items-start gap-2 rounded-xl border border-error/40 bg-error/5 p-3 text-[11px] leading-4 text-error">
      <span aria-hidden className="mt-px font-bold">⚠</span>
      <p>{t("alerte")}</p>
    </div>
  );

  const iconeFinanceur = (cle: TypeFinanceur, cls: string) =>
    cle === "entreprise" ? <IconeMallette className={cls} /> : cle === "autre" ? <IconeInfo className={cls} /> : <IconePersonne className={cls} />;

  const financeurs = t.raw("financeurs") as { cle: TypeFinanceur; titre: string; sous: string }[];
  const provenances = t.raw("provenances") as string[];
  const paysAfrique = nomsPaysAfrique(locale);

  const proprietesFichier = {
    accepteTitre: t("accepteTitre"),
    choisir: t("fichierChoisir"),
    formats: t("fichierFormats"),
    boutonPhoto: t("fichierPhoto"),
    boutonParcourir: t("fichierParcourir"),
  };

  return (
    <EcranApp className="bg-grey-light">
      {phase !== "soumis" && <FondApp />}

      <CoquilleApp barreMobile={false} flux>
      {phase === "soumis" ? (
        <EcranSucces
          titreAvant={t("soumisAvant")}
          titreCle={t("soumisCle")}
          texte={t("soumisTexte")}
          cta={t("soumisCta")}
          onContinuer={() => router.replace("/app/accueil")}
          teinte="corail"
        />
      ) : (
        <GabaritFlux
          titre={t("titre")}
          etape={etape}
          totalEtapes={ordre.length}
          titreAvant={estPreuve ? t("pack2TitreAvant") : t("pack1TitreAvant")}
          titreCle={estPreuve ? t("pack2TitreCle") : t("pack1TitreCle")}
          description={estPreuve ? t("pack2Description") : t("pack1Description")}
          onRetour={retour}
          onQuitter={quitter}
        >
          {/* Étape canal : virement ou dépôt d'espèces. */}
          {phase === "canal" && (
            <div className="flex flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">
                {estPreuve ? t("canalQuestionPack2") : t("canalQuestionPack1")}
              </h2>
              <div className="flex flex-col gap-3">
                <ChoixOption
                  icone={<IconeVirement className="size-5 text-white" />}
                  couleurIcone="#09d1c7"
                  titre={t("canalVirement")}
                  sousTitre={t("canalVirementSous")}
                  onClick={() => {
                    setCanal("virement");
                    setPhase("origine");
                  }}
                />
                <ChoixOption
                  icone={<IconeEspeces className="size-5 text-white" />}
                  couleurIcone="#16a34a"
                  titre={t("canalEspeces")}
                  sousTitre={t("canalEspecesSous")}
                  onClick={() => {
                    setCanal("especes");
                    setPhase("pays");
                  }}
                />
              </div>

              {/* Pack preuve : engagement « fonds dédiés au voyage » avant tout. */}
              {estPreuve && (
                <FeuilleBasse ouverte={infoOuverte} onFermer={quitter} titreAvant={t("infoAvant")} titreCle={t("infoCle")}>
                  <div className="flex flex-col gap-4 text-sm leading-[22px] text-dark">
                    <p>{t("infoTexte1")}</p>
                    <p>{t("infoTexte2")}</p>
                    <label className="flex cursor-pointer items-start gap-2">
                      <input type="checkbox" checked={consenti} onChange={(e) => setConsenti(e.target.checked)} className="peer sr-only" />
                      <span className={"mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors " + (consenti ? "border-primary-light bg-primary-light" : "border-grey-200")}>
                        {consenti && (
                          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-white">
                            <path d="M11.5 4L6 9.5 3 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="text-xs leading-4 text-dark">{t("consentement")}</span>
                    </label>
                    <BoutonApp disabled={!consenti} onClick={() => setInfoOuverte(false)}>
                      {c("continuer")}
                    </BoutonApp>
                  </div>
                </FeuilleBasse>
              )}
            </div>
          )}

          {/* Étape origine du virement : compte local ou Europe (SEPA). */}
          {phase === "origine" && (
            <div className="flex flex-1 flex-col gap-4">
              <span className="mx-auto rounded-full bg-grey-100 px-3 py-1 text-xs font-bold text-grey-700">{t("canalVirement")}</span>
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("origineQuestion")}</h2>
              <div className="flex flex-col gap-3">
                <ChoixOption icone={<IconePin className="size-5 text-grey-700" />} titre={t("origineLocal")} fin="radio" actif={origine === "local"} onClick={() => setOrigine("local")} />
                <ChoixOption icone={<IconeGlobe className="size-5 text-primary-light" />} titre={t("origineEurope")} fin="radio" actif={origine === "europe"} onClick={() => setOrigine("europe")} />
              </div>
              <div className="mt-auto pt-4">
                <BoutonApp disabled={!origine} onClick={() => setPhase("montant")}>
                  {c("continuer")}
                </BoutonApp>
              </div>
            </div>
          )}

          {/* Étape pays du dépôt d'espèces. */}
          {phase === "pays" && (
            <div className="flex flex-1 flex-col gap-4">
              <span className="mx-auto rounded-full bg-grey-100 px-3 py-1 text-xs font-bold text-grey-700">{t("canalEspeces")}</span>
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("paysQuestion")}</h2>
              <SelecteurListe label={t("paysLabel")} name="pays-depot" placeholder={t("paysPlaceholder")} options={paysAfrique} value={paysDepot} onChange={setPaysDepot} />
              <div className="mt-auto pt-4">
                <BoutonApp disabled={!paysDepot.trim()} onClick={() => setPhase("montant")}>
                  {c("continuer")}
                </BoutonApp>
              </div>
            </div>
          )}

          {/* Étape montant : saisie simulée (pack preuve) ou récapitulatif des
              frais (pack compte), avec équivalent FCFA et décomposition. */}
          {phase === "montant" && (
            <div className="flex flex-1 flex-col gap-4">
              {estPreuve ? (
                <>
                  <h2 className="font-outfit text-base font-bold leading-6 text-dark">
                    {t("montantTitreAvant")}
                    <span className="text-gradient-secondary">{t("montantTitreCle")}</span>
                    {t("montantTitreApres")}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-dark">{t("montantLabel")}</span>
                    {champMontant(montantStr, setMontantStr, "€")}
                    {champMontant(montantCredite ? nf(convertir(montantCredite, "EUR", "XOF"), 0) : "", null, "FCFA")}
                  </div>
                  <div className="text-center text-[10px] leading-4 text-grey">
                    <p>{t("equivalent")}</p>
                    <p className="text-error">{t("taux", { taux: nf(taux, 3) })}</p>
                  </div>
                  <div className="flex items-start gap-2 rounded-xl border border-primary-lighter bg-primary-lighter/40 p-3 text-[11px] leading-4 text-primary-light">
                    <IconeInfo className="mt-px size-4 shrink-0" />
                    <p>{t("montantInfo")}</p>
                  </div>
                </>
              ) : (
                <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("recapTitre")}</h2>
              )}

              {lignesMontant()}

              <div className="mt-auto pt-4">
                <BoutonApp disabled={estPreuve && montantCredite <= 0} onClick={() => setPhase("instructions")}>
                  {t("suivant")}
                </BoutonApp>
              </div>
            </div>
          )}

          {/* Étape instructions : références du paiement selon le canal. */}
          {phase === "instructions" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("instructionsTitre")}</h2>
              <p className="text-[11px] leading-4 text-grey">{canal === "especes" ? t("instructionsEspeces") : t("instructionsVirement")}</p>

              <div className="flex flex-col gap-3 rounded-2xl border border-grey-200 bg-white p-4">
                {canal !== "especes" && (
                  <>
                    <LigneCopiable label={t("titulaireLabel")} valeur={RIB_TREEPI.titulaire} />
                    <hr className="border-grey-100" />
                    <LigneCopiable label={t("ibanLabel")} valeur={RIB_TREEPI.iban} />
                    <hr className="border-grey-100" />
                    <LigneCopiable label={t("bicLabel")} valeur={RIB_TREEPI.bic} />
                    <hr className="border-grey-100" />
                  </>
                )}
                <LigneCopiable label={t("referenceLabel")} valeur={reference} />
                <hr className="border-grey-100" />
                <LigneCopiable label={t("totalLabel")} valeur={`${eur(total)} (${fcfa(total)})`} />
              </div>

              <p className="text-[10px] leading-4 text-grey">{t("delais")}</p>
              {alerte()}

              <div className="mt-auto pt-4">
                <BoutonApp onClick={() => setPhase(estPreuve ? "financeur" : "justificatif")}>{t("jaiPaye")}</BoutonApp>
              </div>
            </div>
          )}

          {/* Étape conformité : qui finance le voyage (pack preuve). */}
          {phase === "financeur" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("financeurQuestion")}</h2>
              <div className="flex flex-col gap-3">
                {financeurs.map((f) => (
                  <ChoixOption
                    key={f.cle}
                    icone={iconeFinanceur(f.cle, "size-5 text-primary-light")}
                    titre={f.titre}
                    sousTitre={f.sous}
                    fin="radio"
                    actif={financeurType === f.cle}
                    onClick={() => setFinanceurType(f.cle)}
                  />
                ))}
              </div>
              <div className="mt-auto pt-4">
                <BoutonApp
                  disabled={!financeurType}
                  onClick={() => setPhase(financeurType === "moi" ? "provenance" : "financeur-details")}
                >
                  {c("continuer")}
                </BoutonApp>
              </div>
            </div>
          )}

          {/* Étape conformité : identité et pièce du financeur tiers. */}
          {phase === "financeur-details" && financeurType && (
            <div className="flex flex-1 flex-col gap-4">
              <span className="mx-auto rounded-full bg-grey-100 px-3 py-1 text-xs font-bold text-grey-700">
                {financeurs.find((f) => f.cle === financeurType)?.titre}
              </span>
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("detailsTitre")}</h2>

              {financeurType === "famille" && (
                <>
                  <ChampTexte label={t("nomLabel")} name="f-nom" autoComplete="off" placeholder={t("nomLabel")} value={fNom} onChange={(e) => setFNom(e.target.value)} />
                  <ChampTexte label={t("prenomLabel")} name="f-prenom" autoComplete="off" placeholder={t("prenomLabel")} value={fPrenom} onChange={(e) => setFPrenom(e.target.value)} />
                  <ChampTexte label={t("lienLabel")} name="f-lien" autoComplete="off" placeholder={t("lienPlaceholder")} value={fLien} onChange={(e) => setFLien(e.target.value)} />
                </>
              )}
              {financeurType === "entreprise" && (
                <ChampTexte label={t("raisonLabel")} name="f-raison" autoComplete="off" placeholder={t("raisonLabel")} value={fRaison} onChange={(e) => setFRaison(e.target.value)} />
              )}
              {financeurType === "autre" && (
                <ChampTexte label={t("precisionLabel")} name="f-precision" autoComplete="off" placeholder={t("precisionPlaceholder")} value={fPrecision} onChange={(e) => setFPrecision(e.target.value)} />
              )}

              <ChampTexte label={t("telephoneLabel")} name="f-telephone" type="tel" inputMode="tel" autoComplete="off" placeholder={t("telephoneLabel")} value={fTelephone} onChange={(e) => setFTelephone(e.target.value)} />
              <ChampTexte label={t("emailLabel")} name="f-email" type="email" autoComplete="off" placeholder={t("emailLabel")} value={fEmail} onChange={(e) => setFEmail(e.target.value)} />

              <ChampFichier
                titre={t("pieceTitre")}
                sousTitre={t("pieceSousTitre")}
                accepteItems={t.raw("pieceAccepteItems") as string[]}
                fichierInitial={fPiece}
                onFichier={setFPiece}
                {...proprietesFichier}
              />

              <div className="mt-auto pt-4">
                <BoutonApp disabled={!financeurValide} onClick={() => setPhase("provenance")}>
                  {c("continuer")}
                </BoutonApp>
              </div>
            </div>
          )}

          {/* Étape conformité : provenance des fonds (pack preuve). */}
          {phase === "provenance" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("provenanceQuestion")}</h2>
              <SelecteurListe label={t("provenanceLabel")} name="provenance" placeholder={t("provenancePlaceholder")} options={provenances} value={provenance} onChange={setProvenance} />
              <div className="mt-auto pt-4">
                <BoutonApp disabled={!provenance.trim()} onClick={() => setPhase("justificatif")}>
                  {c("continuer")}
                </BoutonApp>
              </div>
            </div>
          )}

          {/* Étape justificatif de paiement, puis soumission du dossier. */}
          {phase === "justificatif" && (
            <div className="flex flex-1 flex-col gap-4">
              <ChampFichier
                titre={t("justifTitre")}
                sousTitre={t("justifSousTitre")}
                accepteItems={t.raw("justifAccepteItems") as string[]}
                fichierInitial={justif}
                onFichier={setJustif}
                {...proprietesFichier}
              />
              {lignesMontant()}
              <div className="mt-auto pt-4">
                <BoutonApp disabled={!justif || envoi} onClick={soumettre}>
                  {t("soumettreCta")}
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
