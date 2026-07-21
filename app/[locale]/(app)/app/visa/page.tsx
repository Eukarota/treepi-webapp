"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { soumettreVisa } from "@/lib/api/services";
import type { TypeHebergement } from "@/lib/api/compte";
import { PAYS_AFRIQUE, chiffresAttendus, formaterNumero } from "@/lib/data/afrique";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import CoquilleApp from "@/components/app/CoquilleApp";
import GabaritFlux from "@/components/app/flux/GabaritFlux";
import ChampFichier, { type FichierChoisi, type LigneDocument } from "@/components/app/flux/ChampFichier";
import EcranSucces from "@/components/app/flux/EcranSucces";
import BoutonApp from "@/components/app/ui/BoutonApp";
import ChampDate from "@/components/app/ui/ChampDate";
import ChampTexte from "@/components/app/ui/ChampTexte";
import SelecteurListe from "@/components/app/ui/SelecteurListe";
import SelecteurIndicatif from "@/components/app/ui/SelecteurIndicatif";
import { IconeInfo } from "@/components/app/flux/icones";

/*
 * Flux « Obtention de visa » (maquettes « Obtention de visa » x4) : collecte
 * du visa obtenu puis du justificatif d'hébergement du séjour, en 7 étapes
 * suivies par l'indicateur du bandeau :
 *  1. « Avez-vous obtenu votre visa ? » (Oui/Non ; Non ramène à l'accueil) ;
 *  2. dates de début et de fin de validité du visa ;
 *  3. pays de délivrance du visa Schengen + motif du séjour (avec rappel de
 *     cohérence avec l'attestation de blocage de fonds) ;
 *  4. téléversement de la preuve d'obtention (consignes + fichier) ;
 *  5. justificatif d'hébergement : type d'hébergement (réservation / proche /
 *     propriétaire) et adresse adaptée au type choisi ;
 *  6. téléversement du justificatif d'hébergement (documents acceptés variables
 *     selon le type) ;
 *  7. récapitulatif dépliable des deux volets avant validation.
 * La soumission place le compte en « vérification en cours » ; la bascule
 * post-visa intervient à la validation (simulée côté lib/api).
 */

type Phase = "question" | "dates" | "infos" | "preuve" | "hebergement" | "justificatif" | "recap" | "succes";

/** Ordre des étapes du flux (pour l'indicateur du bandeau). */
const ETAPES: Phase[] = ["question", "dates", "infos", "preuve", "hebergement", "justificatif", "recap"];

/** « JJ/MM/AAAA » -> ISO « AAAA-MM-JJ » (ou vide si incomplet). */
function dateVersIso(affiche: string): string {
  const m = affiche.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}

/** Poids lisible d'un fichier (o / Ko / Mo), aligné sur ChampFichier. */
function formaterPoids(o: number): string {
  return o < 1024 ? `${o} o` : o < 1024 * 1024 ? `${Math.round(o / 1024)} Ko` : `${(o / 1024 / 1024).toFixed(1)} Mo`;
}

export default function PageVisa() {
  const t = useTranslations("app.flux.visa");
  const c = useTranslations("app.commun");
  const router = useRouter();
  const { session, chargement } = useSession();

  const [phase, setPhase] = useState<Phase>("question");
  const [envoi, setEnvoi] = useState(false);

  // Volet « Obtention de visa ».
  const [obtenu, setObtenu] = useState<"oui" | "non" | null>(null);
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
  const [pays, setPays] = useState("");
  const [motif, setMotif] = useState("");
  const [fichierVisa, setFichierVisa] = useState<FichierChoisi | null>(null);

  // Volet « Justificatif d'hébergement ».
  const [typeHeb, setTypeHeb] = useState<TypeHebergement | null>(null);
  const [hote, setHote] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille] = useState("");
  // Téléphone de l'hôtel/airbnb : même composant que l'inscription (indicatifs
  // africains, Côte d'Ivoire par défaut, premier marché de Treepi).
  const [telIso, setTelIso] = useState("CI");
  const [telNumero, setTelNumero] = useState("");
  const [fichierHeb, setFichierHeb] = useState<FichierChoisi | null>(null);

  // Récapitulatif : volets dépliables (fermés à l'ouverture, comme la maquette).
  const [recapVisaOuvert, setRecapVisaOuvert] = useState(false);
  const [recapHebOuvert, setRecapHebOuvert] = useState(false);

  useEffect(() => {
    if (!chargement && !session) router.replace("/app/bienvenue");
  }, [chargement, session, router]);

  if (!session) return null;

  const paysSchengen = t.raw("paysSchengen") as string[];
  const motifs = t.raw("motifs") as string[];

  // Métadonnées téléphoniques du pays choisi (placeholder, formatage, validation).
  const paysTel = PAYS_AFRIQUE.find((p) => p.iso === telIso) ?? PAYS_AFRIQUE[0];
  const telValide = telNumero.replace(/\D/g, "").length === chiffresAttendus(paysTel.gabarit);

  /** Changement de pays du téléphone : reformate la saisie selon le gabarit. */
  const changerPaysTel = (nouvelIso: string) => {
    setTelIso(nouvelIso);
    const gabarit = (PAYS_AFRIQUE.find((p) => p.iso === nouvelIso) ?? paysTel).gabarit;
    setTelNumero((n) => formaterNumero(n, gabarit));
  };

  // Validité du volet hébergement selon le type.
  const adresseComplete = adresse.trim() !== "" && codePostal.trim() !== "" && ville.trim() !== "";
  const hoteComplet = typeHeb !== "proche" || hote.trim() !== "";
  const telComplet = typeHeb !== "reservation" || telValide;
  const hebergementComplet = typeHeb !== null && adresseComplete && hoteComplet && telComplet;

  // Documents acceptés + adresse : libellés adaptés au type d'hébergement.
  const docsHeb = typeHeb
    ? (t.raw(`hebergementDocs.${typeHeb}`) as { items: LigneDocument[]; note?: string })
    : { items: [] as LigneDocument[], note: undefined };
  const adresseLabel =
    typeHeb === "reservation"
      ? t("adresseReservationLabel", { pays })
      : typeHeb === "proprietaire"
        ? t("adresseProprietaireLabel", { pays })
        : t("adresseProcheLabel", { pays });
  const codePostalLabel = typeHeb === "reservation" ? t("codePostalReservationLabel") : t("codePostalLabel");
  const libelleType =
    typeHeb === "reservation"
      ? t("recapTypeReservation")
      : typeHeb === "proche"
        ? t("recapTypeProche")
        : typeHeb === "proprietaire"
          ? t("recapTypeProprietaire")
          : "";

  const quitter = () => router.push("/app/accueil");
  const retour = () => {
    const index = ETAPES.indexOf(phase);
    if (index <= 0) quitter();
    else setPhase(ETAPES[index - 1]);
  };

  const soumettre = async () => {
    setEnvoi(true);
    await soumettreVisa({
      debutValidite: dateVersIso(debut),
      finValidite: dateVersIso(fin),
      paysDelivrance: pays,
      motifSejour: motif,
      preuve: fichierVisa?.nom,
      hebergement: {
        type: typeHeb!,
        ...(typeHeb === "proche" ? { hote: hote.trim() } : {}),
        adresse: adresse.trim(),
        codePostal: codePostal.trim(),
        ville: ville.trim(),
        ...(typeHeb === "reservation" ? { telephone: `${paysTel.indicatif} ${telNumero.trim()}` } : {}),
        justificatif: fichierHeb?.nom,
      },
    });
    setEnvoi(false);
    setPhase("succes");
  };

  /** Radio Oui / Non (pastille turquoise pleine quand sélectionnée). */
  const radio = (valeur: "oui" | "non", libelle: string) => (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="radio"
        name="visa-obtenu"
        checked={obtenu === valeur}
        onChange={() => setObtenu(valeur)}
        className="sr-only"
      />
      <span
        className={
          "flex size-5 items-center justify-center rounded-full border-2 transition-colors " +
          (obtenu === valeur ? "border-primary-light" : "border-grey-200 bg-grey-100")
        }
      >
        {obtenu === valeur && <span className="size-2.5 rounded-full bg-primary-light" />}
      </span>
      <span className="text-sm font-medium leading-[22px] text-dark">{libelle}</span>
    </label>
  );

  /** Radio du type d'hébergement (ligne pleine largeur). */
  const radioHeb = (valeur: TypeHebergement, libelle: string) => (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="radio"
        name="type-hebergement"
        checked={typeHeb === valeur}
        onChange={() => setTypeHeb(valeur)}
        className="sr-only"
      />
      <span
        className={
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors " +
          (typeHeb === valeur ? "border-primary-light" : "border-grey-200 bg-grey-100")
        }
      >
        {typeHeb === valeur && <span className="size-2.5 rounded-full bg-primary-light" />}
      </span>
      <span className="text-sm font-medium leading-[22px] text-dark">{libelle}</span>
    </label>
  );

  if (phase === "succes") {
    return (
      <EcranApp className="bg-grey-light">
        <CoquilleApp barreMobile={false} flux>
          <EcranSucces
            titreAvant={t("succesAvant")}
            titreCle={t("succesCle")}
            texte={t("succesTexte")}
            cta={t("succesCta")}
            onContinuer={() => router.replace("/app/accueil")}
            teinte="corail"
          />
        </CoquilleApp>
      </EcranApp>
    );
  }

  // L'en-tête bascule sur le sous-titre « Justificatif d'hébergement » pendant
  // les deux étapes du volet hébergement ; sinon il reste sur le visa.
  const enteteHebergement = phase === "hebergement" || phase === "justificatif";

  return (
    <EcranApp className="bg-grey-light">
      <FondApp />
      <CoquilleApp barreMobile={false} flux>
        <GabaritFlux
          titre={t("titre")}
          etape={ETAPES.indexOf(phase)}
          totalEtapes={ETAPES.length}
          titreAvant={enteteHebergement ? t("hebergementIntroAvant") : t("introAvant")}
          titreCle={enteteHebergement ? t("hebergementIntroCle") : t("introCle")}
          description={enteteHebergement ? t("hebergementIntroDescription") : t("introDescription")}
          onRetour={retour}
          onQuitter={quitter}
        >
          {phase === "question" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("infoTitre")}</h2>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold leading-[22px] text-dark">{t("questionObtenu")}</span>
                <div className="flex items-center gap-8">
                  {radio("oui", t("oui"))}
                  {radio("non", t("non"))}
                </div>
              </div>
              {/* Pas encore de visa : on encourage à revenir plus tard. */}
              {obtenu === "non" && (
                <div className="flex items-start gap-2 rounded-xl bg-primary-lighter/40 p-3 text-[11px] leading-4 text-primary-light">
                  <IconeInfo className="mt-px size-4 shrink-0" />
                  <p>{t("pasEncoreTexte")}</p>
                </div>
              )}
              <div className="mt-auto pt-4">
                {obtenu === "non" ? (
                  <BoutonApp onClick={quitter}>{t("retourAccueil")}</BoutonApp>
                ) : (
                  <BoutonApp disabled={obtenu === null} onClick={() => setPhase("dates")}>
                    {c("continuer")}
                  </BoutonApp>
                )}
              </div>
            </div>
          )}

          {phase === "dates" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("infoTitre")}</h2>
              <ChampDate label={t("debutLabel")} name="debut-validite" placeholder={t("datePlaceholder")} value={debut} onChange={setDebut} />
              <ChampDate label={t("finLabel")} name="fin-validite" placeholder={t("datePlaceholder")} value={fin} onChange={setFin} />
              <div className="mt-auto pt-4">
                <BoutonApp disabled={debut.length !== 10 || fin.length !== 10} onClick={() => setPhase("infos")}>
                  {c("continuer")}
                </BoutonApp>
              </div>
            </div>
          )}

          {phase === "infos" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("infoTitre")}</h2>
              <SelecteurListe label={t("paysLabel")} name="pays-delivrance" placeholder={t("paysPlaceholder")} options={paysSchengen} value={pays} onChange={setPays} />
              <SelecteurListe label={t("motifLabel")} name="motif-sejour" placeholder={t("motifPlaceholder")} options={motifs} value={motif} onChange={setMotif} />
              {/* Rappel : cohérence avec l'attestation de blocage de fonds. */}
              <div className="flex items-start gap-2 rounded-xl border border-primary-lighter bg-primary-lighter/40 p-3 text-xs leading-5 text-primary-light">
                <IconeInfo className="mt-0.5 size-4 shrink-0" />
                <p>{t("attestationInfo")}</p>
              </div>
              <div className="mt-auto pt-4">
                <BoutonApp disabled={!pays || !motif} onClick={() => setPhase("preuve")}>
                  {c("continuer")}
                </BoutonApp>
              </div>
            </div>
          )}

          {phase === "preuve" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">
                {t("preuveTitreAvant")}
                <span className="text-gradient-secondary">{t("preuveTitreCle")}</span>
              </h2>
              {/* Consignes de prise de vue, numéros en rouge comme la maquette. */}
              <ol className="flex flex-col gap-3">
                {(t.raw("consignes") as string[]).map((consigne, i) => (
                  <li key={consigne} className="flex gap-2 text-sm leading-[22px] text-dark">
                    <span className="font-bold text-error">{i + 1}.</span>
                    {consigne}
                  </li>
                ))}
              </ol>
              <ChampFichier
                titre={t("fichierTitre")}
                sousTitre={t("fichierSous")}
                accepteTitre={t("accepteTitre")}
                accepteItems={t.raw("accepteItems") as string[]}
                choisir={t("choisir")}
                formats={t("formats")}
                boutonPhoto={t("photo")}
                boutonParcourir={t("parcourir")}
                fichierInitial={fichierVisa}
                onFichier={setFichierVisa}
              />
              <div className="mt-auto pt-4">
                <BoutonApp disabled={!fichierVisa} onClick={() => setPhase("hebergement")}>
                  {t("suivant")}
                </BoutonApp>
              </div>
            </div>
          )}

          {phase === "hebergement" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">
                {t.rich("hebergementTitre", {
                  pays,
                  c: (chunks) => <span className="text-secondary">{chunks}</span>,
                })}
              </h2>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold leading-[22px] text-dark">{t("typeLabel")}</span>
                {radioHeb("reservation", t("typeReservation"))}
                {radioHeb("proche", t("typeProche"))}
                {radioHeb("proprietaire", t("typeProprietaire"))}
              </div>

              {typeHeb && (
                <div className="flex flex-col gap-4">
                  {/* Hébergement chez un proche : nom + prénom + étage obligatoires. */}
                  {typeHeb === "proche" && (
                    <div className="flex flex-col gap-1">
                      <ChampTexte label={t("hoteLabel")} name="hote" placeholder={t("hotePlaceholder")} value={hote} onChange={(e) => setHote(e.target.value)} />
                      <p className="text-[11px] leading-4 text-grey">{t("hoteAide")}</p>
                    </div>
                  )}
                  <ChampTexte label={adresseLabel} name="adresse" placeholder={t("adressePlaceholder")} value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                  <ChampTexte label={codePostalLabel} name="code-postal" inputMode="numeric" placeholder={t("codePostalPlaceholder")} value={codePostal} onChange={(e) => setCodePostal(e.target.value)} />
                  <ChampTexte label={t("villeLabel")} name="ville" placeholder={t("villePlaceholder")} value={ville} onChange={(e) => setVille(e.target.value)} />
                  {/* Téléphone de l'hôtel/airbnb (réservation uniquement). */}
                  {typeHeb === "reservation" && (
                    <div className="flex w-full flex-col gap-2">
                      <label htmlFor="tel-hebergement" className="text-xs font-bold leading-[22px] text-dark">
                        {t("telephoneLabel")}
                      </label>
                      <div className="flex gap-2">
                        <SelecteurIndicatif valeur={telIso} onChange={changerPaysTel} />
                        <input
                          id="tel-hebergement"
                          type="tel"
                          inputMode="tel"
                          placeholder={paysTel.gabarit}
                          maxLength={paysTel.gabarit.length}
                          value={telNumero}
                          onChange={(e) => setTelNumero(formaterNumero(e.target.value, paysTel.gabarit))}
                          className="h-[42px] min-w-0 flex-1 rounded-xl border border-grey-100 bg-white p-3 text-sm font-medium leading-[22px] text-dark outline-none transition-colors placeholder:text-grey-300 focus:border-primary-light"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-auto pt-4">
                <BoutonApp disabled={!hebergementComplet} onClick={() => setPhase("justificatif")}>
                  {t("suivant")}
                </BoutonApp>
              </div>
            </div>
          )}

          {phase === "justificatif" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">
                {t("justificatifTitreAvant")}
                <span className="text-gradient-secondary">{t("justificatifTitreCle")}</span>
              </h2>
              <ol className="flex flex-col gap-3">
                {(t.raw("consignes") as string[]).map((consigne, i) => (
                  <li key={consigne} className="flex gap-2 text-sm leading-[22px] text-dark">
                    <span className="font-bold text-error">{i + 1}.</span>
                    {consigne}
                  </li>
                ))}
              </ol>
              <ChampFichier
                titre={t("fichierTitre")}
                sousTitre={t("fichierSous")}
                accepteTitre={t("accepteTitre")}
                accepteItems={docsHeb.items}
                note={docsHeb.note}
                choisir={t("choisir")}
                formats={t("formats")}
                boutonPhoto={t("photo")}
                boutonParcourir={t("parcourir")}
                fichierInitial={fichierHeb}
                onFichier={setFichierHeb}
              />
              <div className="mt-auto pt-4">
                <BoutonApp disabled={!fichierHeb} onClick={() => setPhase("recap")}>
                  {t("suivant")}
                </BoutonApp>
              </div>
            </div>
          )}

          {phase === "recap" && (
            <div className="flex flex-1 flex-col gap-4">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("recapTitre")}</h2>
              <div className="flex items-start gap-2 rounded-xl border border-primary-lighter bg-primary-lighter/40 p-3 text-xs leading-5 text-primary-light">
                <IconeInfo className="mt-0.5 size-4 shrink-0" />
                <p>{t("recapAvertissement")}</p>
              </div>

              <VoletRecap titre={t("recapSectionVisa")} ouvert={recapVisaOuvert} onBascule={() => setRecapVisaOuvert((o) => !o)}>
                <LigneRecap label={t("recapObtenu")} valeur={t("oui")} />
                <LigneRecap label={t("recapDebut")} valeur={debut} />
                <LigneRecap label={t("recapFin")} valeur={fin} />
                <LigneRecap label={t("recapPays")} valeur={pays} />
                <LigneRecap label={t("recapMotif")} valeur={motif} />
                <LigneFichierRecap label={t("recapPreuve")} fichier={fichierVisa} />
              </VoletRecap>

              <VoletRecap titre={t("recapSectionHebergement")} ouvert={recapHebOuvert} onBascule={() => setRecapHebOuvert((o) => !o)}>
                <LigneRecap label={t("recapType")} valeur={libelleType} />
                {typeHeb === "proche" && <LigneRecap label={t("recapHote")} valeur={hote} />}
                <LigneRecap label={t("recapAdresse")} valeur={adresse} />
                <LigneRecap label={t("recapCodePostal")} valeur={codePostal} />
                <LigneRecap label={t("recapVille")} valeur={ville} />
                {typeHeb === "reservation" && <LigneRecap label={t("recapTelephone")} valeur={`${paysTel.indicatif} ${telNumero}`} />}
                <LigneFichierRecap label={t("recapJustificatif")} fichier={fichierHeb} />
              </VoletRecap>

              <div className="mt-auto pt-4">
                <BoutonApp disabled={envoi} onClick={soumettre}>
                  {t("valider")}
                </BoutonApp>
              </div>
            </div>
          )}
        </GabaritFlux>
      </CoquilleApp>
    </EcranApp>
  );
}

/* Volet dépliable du récapitulatif (titre turquoise + chevron, corps label/valeur). */
function VoletRecap({ titre, ouvert, onBascule, children }: { titre: string; ouvert: boolean; onBascule: () => void; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white">
      <button type="button" onClick={onBascule} aria-expanded={ouvert} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <span className="text-sm font-bold leading-5 text-primary-light">{titre}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={"shrink-0 text-primary-light transition-transform " + (ouvert ? "rotate-180" : "")}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {ouvert && <div className="flex flex-col gap-2.5 border-t border-grey-100 p-4">{children}</div>}
    </div>
  );
}

/* Ligne label (gras) + valeur du récapitulatif. */
function LigneRecap({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-xs font-bold leading-[18px] text-dark">{label}</span>
      <span className="max-w-[55%] break-words text-right text-xs leading-[18px] text-grey">{valeur}</span>
    </div>
  );
}

/* Ligne « fichier » du récapitulatif : label + pastille PDF (nom + poids). */
function LigneFichierRecap({ label, fichier }: { label: string; fichier: FichierChoisi | null }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold leading-[18px] text-dark">{label}</span>
      {fichier && (
        <div className="flex items-center gap-3 rounded-xl bg-grey-light p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-error/10 text-[9px] font-bold text-error">PDF</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-bold text-dark">{fichier.nom}</span>
            <span className="block text-[10px] leading-4 text-grey">{formaterPoids(fichier.taille)}</span>
          </span>
        </div>
      )}
    </div>
  );
}
