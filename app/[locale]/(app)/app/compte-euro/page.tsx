"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { PACKS, PackId, souscrirePack, trouverPack } from "@/lib/api/packs";
import { ouvrirCompteEuro } from "@/lib/api/compte";
import { PAYS } from "@/lib/data/suggestions";
import Swirl from "@/components/ui/Swirl";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import CoquilleApp from "@/components/app/CoquilleApp";
import GabaritFlux from "@/components/app/flux/GabaritFlux";
import CartePack, { type SectionPack } from "@/components/app/flux/CartePack";
import ChampFichier from "@/components/app/flux/ChampFichier";
import EcranSucces from "@/components/app/flux/EcranSucces";
import ModaleApp from "@/components/app/ui/ModaleApp";
import BoutonApp from "@/components/app/ui/BoutonApp";
import ChampTexte from "@/components/app/ui/ChampTexte";
import ChampDate from "@/components/app/ui/ChampDate";
import SelecteurListe from "@/components/app/ui/SelecteurListe";
import { IconeBanque, IconeCle, IconeCrayon, IconeInfo, IconeMallette, IconeOeil, IconePersonne } from "@/components/app/flux/icones";

/*
 * Parcours d'ouverture du compte Euro (section Figma « Authentification
 * biométrique → Choix du pack → Renseignement des informations → Signature »).
 *
 * Machine à états : intro (« Tout est presque prêt ») → choix du pack (« De quoi
 * as-tu besoin ? ») → identité (passeport + justificatif) → situation
 * (professionnelle) → signature du contrat → succès. La signature clôt le
 * dossier : le compte est activé, le pack enregistré et le profil complété.
 *
 * Mobile : reproduction 1:1 des maquettes. Desktop : chaque étape est présentée
 * dans un panneau centré, comme le reste des flux (traitement de l'inscription).
 */

type Phase = "intro" | "pack" | "identite" | "pro" | "financier" | "certifications" | "recap" | "signature" | "succes";

/** Entrée de pack telle que décrite dans les messages i18n. */
interface PackTexte {
  id: PackId;
  nom: string;
  accroche: string;
  note?: string;
  sections: SectionPack[];
}

export default function PageCompteEuro() {
  const t = useTranslations("app.flux.compteEuro");
  const tp = useTranslations("app.flux.packs");
  const c = useTranslations("app.commun");
  const router = useRouter();
  const { session, chargement } = useSession();

  const [phase, setPhase] = useState<Phase>("intro");
  const [packSel, setPackSel] = useState<PackId | null>(null);
  const [ouverts, setOuverts] = useState<PackId[]>([]);
  const [plusTard, setPlusTard] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  // Étape identité (passeport).
  const [numero, setNumero] = useState("");
  const [pays, setPays] = useState("");
  const [expiration, setExpiration] = useState("");
  const [fichierOk, setFichierOk] = useState(false);

  // Étape professionnelle.
  const [situationPro, setSituationPro] = useState("");
  const [secteur, setSecteur] = useState("");
  // Étape financière.
  const [revenu, setRevenu] = useState("");
  const [patrimoine, setPatrimoine] = useState("");
  // Étape certifications.
  const [usPerson, setUsPerson] = useState(false);
  const [ppe, setPpe] = useState(false);

  useEffect(() => {
    if (!chargement && !session) router.replace("/app/bienvenue");
  }, [chargement, session, router]);

  if (!session) return null;
  const prenom = session.utilisateur.prenom;

  const packs = tp.raw("liste") as PackTexte[];
  const situations = t.raw("situations") as string[];
  const secteurs = t.raw("secteurs") as string[];
  const patrimoines = t.raw("patrimoines") as string[];

  const quitter = () => router.push("/app/accueil");
  const retour = () => {
    const prec: Record<Phase, Phase | null> = {
      intro: null,
      pack: "intro",
      identite: "pack",
      pro: "identite",
      financier: "pro",
      certifications: "financier",
      recap: "certifications",
      signature: "recap",
      succes: null,
    };
    const p = prec[phase];
    if (p) setPhase(p);
    else quitter();
  };

  const souscrire = async () => {
    if (!packSel) return;
    setEnvoi(true);
    await souscrirePack(packSel);
    setEnvoi(false);
    setPhase("identite");
  };

  const finaliser = async () => {
    if (!packSel) return;
    setSignModal(false);
    setEnvoi(true);
    await ouvrirCompteEuro(packSel, {
      passeportNumero: numero.trim(),
      paysDelivrance: pays.trim(),
      expiration: expiration.trim(),
      situationPro: situationPro.trim(),
      secteur: secteur.trim(),
      revenuMensuel: revenu.trim(),
      patrimoine: patrimoine.trim(),
      usPerson,
      ppe,
    });
    setEnvoi(false);
    setPhase("succes");
  };

  const identiteComplete = numero.trim().length >= 5 && pays.trim() !== "" && expiration.trim().length === 10 && fichierOk;
  const proComplete = situationPro.trim() !== "" && secteur.trim() !== "";
  const financierComplete = revenu.trim() !== "" && patrimoine.trim() !== "";
  const certifComplete = usPerson && ppe;

  // Panneau centré sur desktop (même traitement que GabaritFlux), pour les
  // écrans hors gabarit standard (intro, choix du pack).
  const panneau = (contenu: React.ReactNode, fond: string) => (
    <div className="relative flex flex-1 flex-col md:justify-center md:py-10">
      <div className={"relative flex flex-1 flex-col overflow-hidden md:mx-auto md:w-full md:max-w-md md:flex-none md:min-h-[600px] md:rounded-[28px] md:shadow-app " + fond}>
        {contenu}
      </div>
    </div>
  );

  // Case à cocher des certifications (fonction de rendu appelée en ligne pour
  // préserver le focus, cf. règles du compilateur React).
  const caseCoche = (coche: boolean, onToggle: () => void, libelle: string) => (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-grey-200 bg-white p-3">
      <input type="checkbox" checked={coche} onChange={onToggle} className="peer sr-only" />
      <span className={"mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors " + (coche ? "border-primary-light bg-primary-light" : "border-grey-200")}>
        {coche && (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-white">
            <path d="M11.5 4 6 9.5 3 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-sm leading-5 text-dark">{libelle}</span>
    </label>
  );

  // Ligne de section du récapitulatif (pastille + titre + sous-titre).
  const ligneRecap = (icone: React.ReactNode, titre: string, sousTitre: string) => (
    <div className="flex items-start gap-3 p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-lighter/40">{icone}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold leading-5 text-dark">{titre}</span>
        <span className="mt-0.5 block text-[11px] leading-4 text-grey">{sousTitre}</span>
      </span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-grey-300"><path d="m9 6 6 6-6 6" /></svg>
    </div>
  );

  // Icônes des trois points de l'écran de signature.
  const iconesSignature = [IconeOeil, IconeCle, IconeCrayon];

  return (
    <EcranApp className="bg-grey-light">
      {phase !== "succes" && phase !== "intro" && <FondApp />}

      <CoquilleApp barreMobile={false} flux>
      {/* Étape intro : « Tout est presque prêt ». */}
      {phase === "intro" &&
        panneau(
          <>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary-light to-primary">
              <Swirl className="absolute inset-0 h-full w-full" />
            </div>
            <button
              type="button"
              onClick={quitter}
              aria-label={c("fermer")}
              className="absolute right-5 top-10 z-20 transition-opacity hover:opacity-70"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app/icons/close-white.svg" alt="" width={28} height={28} />
            </button>

            <div className="relative z-10 px-6 pt-16">
              <h1 className="font-outfit text-[40px] font-bold leading-[1.1] text-white">
                {t("introHelloAvant")}
                <span className="text-gradient-secondary">{t("introHelloCle", { prenom })}</span>
              </h1>
            </div>
            <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app/illustrations/compte-euro.png" alt="" width={240} height={240} className="w-[230px] max-w-[64%]" />
            </div>
            <div className="relative z-10 rounded-t-[28px] bg-white px-6 pb-10 pt-8 text-center">
              <h2 className="font-outfit text-2xl font-bold leading-8 text-dark">{t("introTitre")}</h2>
              <p className="mx-auto mt-3 max-w-[280px] text-sm leading-[22px] text-grey">{t("introTexte")}</p>
              <div className="mt-6">
                <BoutonApp onClick={() => setPhase("pack")}>{t("introCta")}</BoutonApp>
              </div>
            </div>
          </>,
          "bg-primary-light"
        )}

      {/* Étape choix du pack : « De quoi as-tu besoin ? ». */}
      {phase === "pack" &&
        panneau(
          <div className="relative z-10 flex flex-1 flex-col">
            <div className="flex items-center justify-between px-6 pt-10">
              <button type="button" onClick={retour} aria-label={c("retour")} className="text-primary-light transition-opacity hover:opacity-70">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button type="button" onClick={quitter} aria-label={c("fermer")} className="text-primary-light transition-opacity hover:opacity-70">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="colonne-app flex flex-1 flex-col gap-4 pb-8 pt-4">
              <h1 className="font-outfit text-[28px] font-bold leading-9 text-dark">
                {tp("titreAvant")}
                <span className="text-gradient-secondary">{tp("titreCle")}</span>
                {tp("titreApres")}
              </h1>

              <div className="flex flex-col gap-4 pt-2">
                {PACKS.map((p) => {
                  const infos = packs.find((x) => x.id === p.id);
                  if (!infos) return null;
                  return (
                    <CartePack
                      key={p.id}
                      nom={infos.nom}
                      prix={`${trouverPack(p.id).prixAnnuel}${tp("parAn")}`}
                      accroche={infos.accroche}
                      note={infos.note}
                      populaire={p.populaire}
                      badgePopulaire={tp("populaire")}
                      sections={infos.sections}
                      selectionne={packSel === p.id}
                      ouvert={ouverts.includes(p.id)}
                      onSelectionner={() => setPackSel(p.id)}
                      onBasculer={() => setOuverts((o) => (o.includes(p.id) ? o.filter((x) => x !== p.id) : [...o, p.id]))}
                    />
                  );
                })}
              </div>

              <div className="mt-auto flex flex-col items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOuverts(PACKS.map((p) => p.id))}
                  className="text-sm font-bold text-dark underline underline-offset-4 transition-colors hover:text-primary-light"
                >
                  {tp("enSavoirPlus")}
                </button>
                <BoutonApp disabled={!packSel || envoi} onClick={souscrire}>
                  {tp("souscrire")}
                </BoutonApp>
                <button type="button" onClick={() => setPlusTard(true)} className="text-sm font-semibold text-grey transition-colors hover:text-dark">
                  {tp("plusTard")}
                </button>
              </div>
            </div>

            <ModaleApp ouverte={plusTard} onFermer={() => setPlusTard(false)} titreAvant={tp("modaleAvant")} titreCle={tp("modaleCle") + tp("modaleApres")} libelleFermer={c("fermer")}>
              <p>{tp("modaleTexte")}</p>
              <div className="flex flex-col gap-1">
                <BoutonApp onClick={quitter}>{tp("modaleConfirmer")}</BoutonApp>
                <BoutonApp variante="neutre" onClick={() => setPlusTard(false)}>{tp("modaleAnnuler")}</BoutonApp>
              </div>
            </ModaleApp>
          </div>,
          "bg-grey-light"
        )}

      {/* Étape identité (passeport). */}
      {phase === "identite" && (
        <GabaritFlux titre={t("titre")} etape={0} totalEtapes={6} titreAvant={t("identiteAvant")} titreCle={t("identiteCle")} description={t("identiteDescription")} onRetour={retour} onQuitter={quitter}>
          <div className="flex flex-1 flex-col gap-4">
            <ChampTexte label={t("numeroLabel")} name="passeport" autoComplete="off" placeholder={t("numeroPlaceholder")} value={numero} onChange={(e) => setNumero(e.target.value)} />
            <SelecteurListe label={t("paysLabel")} name="pays-delivrance" placeholder={t("paysPlaceholder")} options={PAYS} value={pays} onChange={setPays} />
            <ChampDate label={t("expirationLabel")} name="expiration" placeholder={t("expirationPlaceholder")} value={expiration} onChange={setExpiration} />
            <ChampFichier
              titre={t("fichierTitre")}
              sousTitre={t("fichierSousTitre")}
              accepteTitre={t("fichierAccepteTitre")}
              accepteItems={t.raw("fichierAccepteItems") as string[]}
              choisir={t("fichierChoisir")}
              formats={t("fichierFormats")}
              boutonPhoto={t("fichierPhoto")}
              boutonParcourir={t("fichierParcourir")}
              onChange={setFichierOk}
            />
            <div className="mt-auto pt-4">
              <BoutonApp disabled={!identiteComplete} onClick={() => setPhase("pro")}>
                {t("suivant")}
              </BoutonApp>
            </div>
          </div>
        </GabaritFlux>
      )}

      {/* Étape informations professionnelles. */}
      {phase === "pro" && (
        <GabaritFlux titre={t("titre")} etape={1} totalEtapes={6} titreAvant={t("situationAvant")} titreCle={t("situationCle")} description={t("situationDescription")} onRetour={retour} onQuitter={quitter}>
          <div className="flex flex-1 flex-col gap-4">
            <ChampTexte label={t("situationLabel")} name="situation" list="liste-situations" autoComplete="off" placeholder={t("situationLabel")} value={situationPro} onChange={(e) => setSituationPro(e.target.value)} />
            <datalist id="liste-situations">
              {situations.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            <ChampTexte label={t("secteurLabel")} name="secteur" list="liste-secteurs" autoComplete="off" placeholder={t("secteurLabel")} value={secteur} onChange={(e) => setSecteur(e.target.value)} />
            <datalist id="liste-secteurs">
              {secteurs.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            <div className="mt-auto pt-4">
              <BoutonApp disabled={!proComplete} onClick={() => setPhase("financier")}>
                {t("suivant")}
              </BoutonApp>
            </div>
          </div>
        </GabaritFlux>
      )}

      {/* Étape informations financières. */}
      {phase === "financier" && (
        <GabaritFlux titre={t("titre")} etape={2} totalEtapes={6} titreAvant={t("financierAvant")} titreCle={t("financierCle")} description={t("financierDescription")} onRetour={retour} onQuitter={quitter}>
          <div className="flex flex-1 flex-col gap-4">
            <ChampTexte label={t("revenuLabel")} name="revenu" inputMode="numeric" autoComplete="off" placeholder={t("revenuPlaceholder")} value={revenu} onChange={(e) => setRevenu(e.target.value.replace(/[^\d\s]/g, ""))} iconeDroite={<span className="text-sm font-bold text-grey">€</span>} />
            <ChampTexte
              label={t("patrimoineLabel")}
              name="patrimoine"
              list="liste-patrimoines"
              autoComplete="off"
              placeholder={patrimoines[0]}
              value={patrimoine}
              onChange={(e) => setPatrimoine(e.target.value)}
              iconeDroite={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-grey">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              }
            />
            <datalist id="liste-patrimoines">
              {patrimoines.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
            <div className="flex items-start gap-2 rounded-xl border border-error/40 bg-error/5 p-3 text-[11px] leading-4 text-error">
              <span aria-hidden className="mt-px font-bold">⚠</span>
              <p>{t("financierAvertissement")}</p>
            </div>
            <div className="mt-auto pt-4">
              <BoutonApp disabled={!financierComplete} onClick={() => setPhase("certifications")}>
                {t("suivant")}
              </BoutonApp>
            </div>
          </div>
        </GabaritFlux>
      )}

      {/* Étape certifications réglementaires. */}
      {phase === "certifications" && (
        <GabaritFlux titre={t("titre")} etape={3} totalEtapes={6} titreAvant={t("certifAvant")} titreCle={t("certifCle")} description={t("certifDescription")} onRetour={retour} onQuitter={quitter}>
          <div className="flex flex-1 flex-col gap-4">
            {caseCoche(usPerson, () => setUsPerson((v) => !v), t("certifUsPerson"))}
            {caseCoche(ppe, () => setPpe((v) => !v), t("certifPpe"))}
            <div className="flex items-start gap-2 rounded-xl border border-primary-light/40 bg-primary-lighter/30 p-3 text-[11px] leading-4 text-primary-light">
              <IconeInfo className="mt-px size-4 shrink-0" />
              <p>{t("certifConfirme")}</p>
            </div>
            <div className="mt-auto pt-4">
              <BoutonApp disabled={!certifComplete} onClick={() => setPhase("recap")}>
                {t("suivant")}
              </BoutonApp>
            </div>
          </div>
        </GabaritFlux>
      )}

      {/* Étape récapitulatif. */}
      {phase === "recap" && (
        <GabaritFlux titre={t("titre")} etape={4} totalEtapes={6} titreAvant={t("recapAvant")} titreCle={t("recapCle")} description={t("recapDescription")} onRetour={retour} onQuitter={quitter}>
          <div className="flex flex-1 flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("recapOffre")}</h2>
              {(() => {
                const infos = packs.find((x) => x.id === packSel);
                return (
                  <div className="rounded-2xl border border-grey-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-outfit text-[15px] font-bold leading-5 text-primary-light">{infos?.nom}</span>
                      <span className="shrink-0 font-outfit text-sm font-bold text-dark">
                        {packSel ? `${trouverPack(packSel).prixAnnuel}${tp("parAn")}` : ""}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-[18px] text-grey">{infos?.accroche}</p>
                  </div>
                );
              })()}
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("recapProfil")}</h2>
              <div className="flex flex-col rounded-2xl border border-grey-200 bg-white">
                {ligneRecap(<IconePersonne className="size-5 text-primary-light" />, t("recapPerso"), t("recapPersoSous"))}
                <hr className="border-grey-100" />
                {ligneRecap(<IconeMallette className="size-5 text-primary-light" />, t("recapPro"), t("recapProSous"))}
                <hr className="border-grey-100" />
                {ligneRecap(<IconeBanque className="size-5 text-primary-light" />, t("recapFin"), t("recapFinSous"))}
              </div>
            </div>

            <div className="mt-auto pt-4">
              <BoutonApp onClick={() => setPhase("signature")}>{t("confirmer")}</BoutonApp>
            </div>
          </div>
        </GabaritFlux>
      )}

      {/* Étape signature du contrat. */}
      {phase === "signature" && (
        <GabaritFlux titre={t("titre")} etape={5} totalEtapes={6} titreAvant={t("signatureAvant")} titreCle={t("signatureCle")} description={t("signatureDescription")} onRetour={retour} onQuitter={quitter}>
          <div className="flex flex-1 flex-col gap-5">
            <div className="mx-auto mt-2 flex aspect-square w-[150px] items-center justify-center rounded-full bg-primary-lighter/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app/illustrations/signature.png" alt="" width={150} height={150} className="w-[120px]" />
            </div>
            <p className="text-center font-outfit text-base font-bold leading-6 text-dark">{t("signatureTitre")}</p>
            <ul className="flex flex-col gap-3">
              {(t.raw("signaturePoints") as string[]).map((pt, i) => {
                const Icone = iconesSignature[i] ?? IconeCrayon;
                return (
                  <li key={pt} className="flex items-start gap-3 text-sm leading-[22px] text-dark">
                    <Icone className="mt-0.5 size-5 shrink-0 text-primary-light" />
                    <span>{pt}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto pt-4">
              <BoutonApp disabled={envoi} onClick={() => setSignModal(true)}>
                {t("signatureCta")}
              </BoutonApp>
            </div>
          </div>

          <ModaleApp ouverte={signModal} onFermer={() => setSignModal(false)} titreAvant={t("signatureModaleAvant")} titreCle={t("signatureModaleCle")} libelleFermer={c("fermer")}>
            <p>{t("signatureModaleTexte")}</p>
            <div className="flex flex-col gap-1">
              <BoutonApp disabled={envoi} onClick={finaliser}>{t("signatureModaleConfirmer")}</BoutonApp>
              <BoutonApp variante="neutre" onClick={() => setSignModal(false)}>{t("signatureModaleAnnuler")}</BoutonApp>
            </div>
          </ModaleApp>
        </GabaritFlux>
      )}

      {/* Étape succès. */}
      {phase === "succes" && (
        <EcranSucces
          titreAvant={t("succesAvant")}
          titreCle={t("succesCle")}
          texte={t("succesTexte", { prenom })}
          cta={t("succesCta")}
          onContinuer={() => router.replace("/app/accueil")}
        />
      )}
      </CoquilleApp>
    </EcranApp>
  );
}
