"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { useCompteOuvert } from "@/lib/hooks/useCompteOuvert";
import { convertir, tauxEntre } from "@/lib/api/change";
import { useTauxTempsReel } from "@/lib/hooks/useTaux";
import { RIB_TREEPI } from "@/lib/api/compte";
import { MethodeRecharge, creerRecharge, fraisRecharge, referenceRecharge } from "@/lib/api/recharge";
import { PAYS } from "@/lib/data/suggestions";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import CoquilleApp from "@/components/app/CoquilleApp";
import GabaritFlux from "@/components/app/flux/GabaritFlux";
import ChoixOption from "@/components/app/flux/ChoixOption";
import FeuilleBasse from "@/components/app/flux/FeuilleBasse";
import LigneCopiable from "@/components/app/flux/LigneCopiable";
import BoutonApp from "@/components/app/ui/BoutonApp";
import ChampTexte from "@/components/app/ui/ChampTexte";
import SelecteurListe from "@/components/app/ui/SelecteurListe";
import EcranSucces from "@/components/app/flux/EcranSucces";
import { IconeCarte, IconeEspeces, IconeGlobe, IconePin, IconeVirement } from "@/components/app/flux/icones";

/*
 * Flux « Recharge » du compte Euro (section « Recharger compte Euro » des
 * maquettes). Machine à états : consentement + choix de la méthode → montant
 * (avec équivalent FCFA, frais et total) → détails propres à la méthode
 * (carte / virement SEPA / dépôt en espèces) → écran de succès. La carte
 * crédite aussitôt, le virement et les espèces restent « en cours ».
 */

type Phase = "methode" | "montant" | "virement-origine" | "virement-rib" | "especes" | "recap" | "succes";

function versNombre(saisie: string): number {
  const n = parseFloat(saisie.replace(/\s/g, "").replace(",", "."));
  return Number.isNaN(n) ? 0 : n;
}

export default function PageRecharger() {
  const t = useTranslations("app.flux.recharge");
  const c = useTranslations("app.commun");
  const locale = useLocale();
  const router = useRouter();
  const { session, chargement } = useSession();
  const ouvert = useCompteOuvert();
  // Taux EUR→FCFA temps réel pour l'équivalent affiché sous le montant.
  useTauxTempsReel();

  const [phase, setPhase] = useState<Phase>("methode");
  const [methode, setMethode] = useState<MethodeRecharge | null>(null);
  const [infoOuverte, setInfoOuverte] = useState(true);
  const [consenti, setConsenti] = useState(false);
  const [montantStr, setMontantStr] = useState("");
  const [origine, setOrigine] = useState<"sepa" | "hors" | null>(null);
  const [pays, setPays] = useState("");
  const [carte, setCarte] = useState({ numero: "", exp: "", cvc: "", titulaire: "" });
  const [reference] = useState(referenceRecharge);
  const [envoi, setEnvoi] = useState(false);
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    if (!chargement && !session) router.replace("/app/bienvenue");
  }, [chargement, session, router]);

  if (!session || !ouvert) return null;

  const methodes = t.raw("methodes") as { cle: MethodeRecharge; titre: string; sous: string }[];
  const montant = versNombre(montantStr);
  const frais = fraisRecharge(montant);
  const total = montant + frais;
  const taux = tauxEntre("EUR", "XOF");

  const nf = (v: number, d = 2) => new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", { maximumFractionDigits: d }).format(v);
  const eur = (v: number) => `${nf(v)} €`;
  const fcfa = (v: number) => `${nf(convertir(v, "EUR", "XOF"), 0)} FCFA`;

  const quitter = () => router.push("/app/accueil");

  const retour = () => {
    const precedent: Record<Phase, Phase | null> = {
      methode: null,
      montant: "methode",
      "virement-origine": "montant",
      "virement-rib": "virement-origine",
      especes: "montant",
      recap: "montant",
      succes: null,
    };
    const p = precedent[phase];
    if (p) setPhase(p);
    else quitter();
  };

  const finaliser = async () => {
    if (!methode) return;
    setEnvoi(true);
    const r = await creerRecharge({ methode, montantEuros: montant, reference });
    setEnvoi(false);
    setEnCours(r.statut === "en-cours");
    setPhase("succes");
  };

  const etape = phase === "methode" ? 0 : phase === "montant" ? 1 : 2;
  const carteComplete = carte.numero.trim().length >= 12 && carte.exp.trim().length >= 4 && carte.cvc.trim().length >= 3;

  // Champ de montant avec suffixe devise (sans flèches natives).
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

  const iconeMethode = (cle: MethodeRecharge, cls: string) =>
    cle === "carte" ? <IconeCarte className={cls} /> : cle === "virement" ? <IconeVirement className={cls} /> : <IconeEspeces className={cls} />;
  const couleurMethode: Record<MethodeRecharge, string> = { carte: "#2f6df6", virement: "#09d1c7", especes: "#16a34a" };

  return (
    <EcranApp className="bg-grey-light">
      {phase !== "succes" && <FondApp />}

      <CoquilleApp barreMobile={false} flux>
      {phase === "succes" ? (
        <EcranSucces
          titreAvant={enCours ? t("succesEnCoursAvant") : t("succesInstantAvant")}
          titreCle={enCours ? t("succesEnCoursCle") : t("succesInstantCle")}
          texte={enCours ? t("succesEnCoursTexte", { montant: eur(montant) }) : t("succesInstantTexte", { montant: eur(montant) })}
          cta={t("accederCompte")}
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
          {/* Étape méthode. */}
          {phase === "methode" && (
            <div className="flex flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("question")}</h2>
              <div className="flex flex-col gap-3">
                {methodes.map((m) => (
                  <ChoixOption
                    key={m.cle}
                    icone={iconeMethode(m.cle, "size-5 text-white")}
                    couleurIcone={couleurMethode[m.cle]}
                    titre={m.titre}
                    sousTitre={m.sous}
                    onClick={() => {
                      setMethode(m.cle);
                      setPhase("montant");
                    }}
                  />
                ))}
              </div>

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
            </div>
          )}

          {/* Étape montant. */}
          {phase === "montant" && methode && (
            <div className="flex flex-1 flex-col gap-4">
              <span className="mx-auto rounded-full bg-grey-100 px-3 py-1 text-xs font-bold text-grey-700">
                {methodes.find((m) => m.cle === methode)?.titre}
              </span>
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">
                {t("montantAvant")}
                <span className="text-gradient-secondary">{t("montantCle")}</span>
                {t("montantApres")}
              </h2>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-dark">{t("montantLabel")}</span>
                {champMontant(montantStr, setMontantStr, "€")}
                {champMontant(montant ? nf(convertir(montant, "EUR", "XOF"), 0) : "", null, "FCFA")}
              </div>

              <div className="text-center text-[10px] leading-4 text-grey">
                <p>{t("equivalent")}</p>
                <p className="text-error">{t("taux", { taux: nf(taux, 3) })}</p>
              </div>

              <dl className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <dt className="font-bold text-dark">{t("fraisGestion")}</dt>
                  <dd className="text-dark">{eur(frais)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-bold text-dark">{t("montantTotal")}</dt>
                  <dd className="text-right text-dark">
                    {eur(total)}
                    <span className="block text-[10px] leading-4 text-grey">{t("soit", { valeur: fcfa(total) })}</span>
                  </dd>
                </div>
              </dl>

              <div className="mt-auto pt-4">
                <BoutonApp
                  disabled={montant <= 0}
                  onClick={() => setPhase(methode === "carte" ? "recap" : methode === "virement" ? "virement-origine" : "especes")}
                >
                  {t("suivant")}
                </BoutonApp>
              </div>
            </div>
          )}

          {/* Étape virement : origine des fonds. */}
          {phase === "virement-origine" && (
            <div className="flex flex-1 flex-col gap-4">
              <span className="mx-auto rounded-full bg-grey-100 px-3 py-1 text-xs font-bold text-grey-700">{methodes[1].titre}</span>
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("virementQuestion")}</h2>
              <div className="flex flex-col gap-3">
                <ChoixOption icone={<IconeGlobe className="size-5 text-primary-light" />} titre={t("virementSepa")} fin="radio" actif={origine === "sepa"} onClick={() => setOrigine("sepa")} />
                <ChoixOption icone={<IconePin className="size-5 text-grey-700" />} titre={t("virementHors")} fin="radio" actif={origine === "hors"} onClick={() => setOrigine("hors")} />
              </div>
              {origine && (
                <div className={"rounded-xl p-3 text-[11px] leading-4 " + (origine === "sepa" ? "bg-primary-lighter/40 text-primary-light" : "bg-error/10 text-error")}>
                  {origine === "sepa" ? t("sepaInfo") : t("horsSepaAvertissement")}
                </div>
              )}
              <div className="mt-auto pt-4">
                <BoutonApp disabled={origine !== "sepa"} onClick={() => setPhase("virement-rib")}>
                  {t("valider")}
                </BoutonApp>
              </div>
            </div>
          )}

          {/* Étape virement : coordonnées du compte de dépôt Treepi. */}
          {phase === "virement-rib" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">
                {t("ribAvant")}
                <span className="text-gradient-secondary">{t("ribCle")}</span>
              </h2>
              <p className="text-[11px] leading-4 text-grey">{t("ribInstruction")}</p>
              <div className="flex flex-col gap-3 rounded-2xl border border-grey-200 bg-white p-4">
                <LigneCopiable label={t("titulaireLabel")} valeur={RIB_TREEPI.titulaire} />
                <hr className="border-grey-100" />
                <LigneCopiable label={t("ibanLabel")} valeur={RIB_TREEPI.iban} />
                <hr className="border-grey-100" />
                <LigneCopiable label={t("bicLabel")} valeur={RIB_TREEPI.bic} />
                <hr className="border-grey-100" />
                <LigneCopiable label={t("referenceLabel")} valeur={reference} />
                <hr className="border-grey-100" />
                <LigneCopiable label={t("montantAEnvoyer")} valeur={eur(total)} />
              </div>
              <p className="text-[10px] leading-4 text-grey">{t("delais")}</p>
              <div className="mt-auto pt-4">
                <BoutonApp disabled={envoi} onClick={finaliser}>
                  {t("jaiEffectue")}
                </BoutonApp>
              </div>
            </div>
          )}

          {/* Étape espèces : pays + code de dépôt. */}
          {phase === "especes" && (
            <div className="flex flex-1 flex-col gap-4">
              <span className="mx-auto rounded-full bg-grey-100 px-3 py-1 text-xs font-bold text-grey-700">{methodes[2].titre}</span>
              <SelecteurListe label={t("especesPays")} name="pays" placeholder={t("paysPlaceholder")} options={PAYS} value={pays} onChange={setPays} />
              <p className="text-[11px] leading-4 text-grey">{t("especesInstruction")}</p>
              <div className="rounded-2xl border border-grey-200 bg-white p-4">
                <LigneCopiable label={t("especesCode")} valeur={reference} />
              </div>
              <div className="mt-auto pt-4">
                <BoutonApp disabled={!pays.trim() || envoi} onClick={finaliser}>
                  {t("valider")}
                </BoutonApp>
              </div>
            </div>
          )}

          {/* Étape carte : paiement + récapitulatif. */}
          {phase === "recap" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("cartePaiement")}</h2>
              <ChampTexte label={t("carteNumero")} name="num" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={carte.numero} onChange={(e) => setCarte({ ...carte, numero: e.target.value })} />
              <div className="flex gap-3">
                <ChampTexte label={t("carteExp")} name="exp" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" value={carte.exp} onChange={(e) => setCarte({ ...carte, exp: e.target.value })} />
                <ChampTexte label={t("carteCvc")} name="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={carte.cvc} onChange={(e) => setCarte({ ...carte, cvc: e.target.value })} />
              </div>
              <ChampTexte label={t("carteTitulaire")} name="titulaire" autoComplete="cc-name" placeholder="Awa Diallo" value={carte.titulaire} onChange={(e) => setCarte({ ...carte, titulaire: e.target.value })} />

              <div className="mt-2 flex flex-col gap-1 rounded-2xl border border-grey-200 bg-white p-4 text-sm">
                <div className="flex justify-between"><span className="text-grey">{t("recapMontant")}</span><span className="font-bold text-dark">{eur(montant)}</span></div>
                <div className="flex justify-between"><span className="text-grey">{t("recapFrais")}</span><span className="text-dark">{eur(frais)}</span></div>
                <hr className="my-1 border-grey-100" />
                <div className="flex justify-between"><span className="font-bold text-dark">{t("recapTotal")}</span><span className="font-bold text-primary-light">{eur(total)}</span></div>
              </div>

              <div className="mt-auto pt-4">
                <BoutonApp disabled={!carteComplete || envoi} onClick={finaliser}>
                  {t("confirmer")}
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
