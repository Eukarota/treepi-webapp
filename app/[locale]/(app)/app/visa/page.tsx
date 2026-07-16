"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { soumettreVisa } from "@/lib/api/services";
import { PAYS } from "@/lib/data/suggestions";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import CoquilleApp from "@/components/app/CoquilleApp";
import GabaritFlux from "@/components/app/flux/GabaritFlux";
import ChoixOption from "@/components/app/flux/ChoixOption";
import ChampFichier from "@/components/app/flux/ChampFichier";
import EcranSucces from "@/components/app/flux/EcranSucces";
import BoutonApp from "@/components/app/ui/BoutonApp";
import ChampDate from "@/components/app/ui/ChampDate";
import SelecteurListe from "@/components/app/ui/SelecteurListe";
import { IconeCheck, IconeInfo, IconeMaison, IconePasseport } from "@/components/app/flux/icones";

/*
 * Flux « Obtention de visa » : dépôt du dossier de visa. Écran pivot listant
 * deux volets à compléter (informations de visa, justificatif d'hébergement),
 * chacun étant un sous-formulaire. Une fois les deux volets remplis, la
 * soumission fait basculer le tableau de bord en phase post-visa (accès total).
 */

type Phase = "hub" | "visa" | "hebergement" | "succes";
type Hebergement = "reservation" | "proche" | "proprietaire";
interface OptionHeb {
  id: Hebergement;
  titre: string;
  sous: string;
}

export default function PageVisa() {
  const t = useTranslations("app.flux.visa");
  const router = useRouter();
  const { session, chargement } = useSession();

  const [phase, setPhase] = useState<Phase>("hub");
  const [envoi, setEnvoi] = useState(false);

  // Volet informations de visa.
  const [typeVisa, setTypeVisa] = useState("");
  const [pays, setPays] = useState("");
  const [entree, setEntree] = useState("");
  const [sortie, setSortie] = useState("");
  const [visaFait, setVisaFait] = useState(false);

  // Volet justificatif d'hébergement.
  const [hebergement, setHebergement] = useState<Hebergement | null>(null);
  const [fichierOk, setFichierOk] = useState(false);
  const [hebFait, setHebFait] = useState(false);

  useEffect(() => {
    if (!chargement && !session) router.replace("/app/bienvenue");
  }, [chargement, session, router]);

  if (!session) return null;

  const typesVisa = t.raw("visaTypes") as string[];
  const optionsHeb = t.raw("hebergementOptions") as OptionHeb[];

  const visaComplet = typeVisa.trim() !== "" && pays.trim() !== "" && entree.trim().length === 10 && sortie.trim().length === 10;
  const hebComplet = hebergement !== null && fichierOk;

  const quitter = () => router.push("/app/accueil");
  const retour = () => (phase === "hub" ? quitter() : setPhase("hub"));

  const soumettre = async () => {
    setEnvoi(true);
    await soumettreVisa();
    setEnvoi(false);
    setPhase("succes");
  };

  // Ligne de volet du dossier (avec état « complété »).
  const ligneSection = (icone: React.ReactNode, titre: string, fait: boolean, onClick: () => void) => (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-grey-200 bg-white p-3.5 text-left transition-all hover:shadow-app">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-lighter/40 text-primary-light">{icone}</span>
      <span className="min-w-0 flex-1 text-sm font-bold text-dark">{titre}</span>
      {fait ? (
        <span className="flex items-center gap-1 text-[11px] font-bold text-success">
          <IconeCheck className="size-4" />
          {t("fait")}
        </span>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-grey-300"><path d="m9 6 6 6-6 6" /></svg>
      )}
    </button>
  );

  if (phase === "succes") {
    return (
      <EcranApp className="bg-grey-light">
        <CoquilleApp barreMobile={false} flux>
          <EcranSucces titreAvant={t("succesAvant")} titreCle={t("succesCle")} texte={t("succesTexte")} cta={t("succesCta")} onContinuer={() => router.replace("/app/accueil")} teinte="corail" />
        </CoquilleApp>
      </EcranApp>
    );
  }

  return (
    <EcranApp className="bg-grey-light">
      <FondApp />
      <CoquilleApp barreMobile={false} flux>
      <GabaritFlux titre={t("titre")} titreAvant={t("introAvant")} titreCle={t("introCle")} description={t("introDescription")} onRetour={retour} onQuitter={quitter}>
        {phase === "hub" && (
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("infoTitre")}</h2>
            <div className="flex items-start gap-2 rounded-xl bg-primary-lighter/40 p-3 text-[11px] leading-4 text-primary-light">
              <IconeInfo className="mt-px size-4 shrink-0" />
              <p>{t("avertissement")}</p>
            </div>
            {ligneSection(<IconePasseport className="size-5" />, t("sectionVisa"), visaFait, () => setPhase("visa"))}
            {ligneSection(<IconeMaison className="size-5" />, t("sectionHebergement"), hebFait, () => setPhase("hebergement"))}
            <div className="mt-auto pt-4">
              <BoutonApp disabled={!visaFait || !hebFait || envoi} onClick={soumettre}>
                {t("valider")}
              </BoutonApp>
            </div>
          </div>
        )}

        {phase === "visa" && (
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("sectionVisa")}</h2>
            <SelecteurListe label={t("visaTypeLabel")} name="type-visa" placeholder={t("visaTypeLabel")} options={typesVisa} value={typeVisa} onChange={setTypeVisa} />
            <SelecteurListe label={t("visaPaysLabel")} name="pays-visa" placeholder={t("visaPaysPlaceholder")} options={PAYS} value={pays} onChange={setPays} />
            <ChampDate label={t("visaDepartLabel")} name="entree" placeholder={t("datePlaceholder")} value={entree} onChange={setEntree} />
            <ChampDate label={t("visaRetourLabel")} name="sortie" placeholder={t("datePlaceholder")} value={sortie} onChange={setSortie} />
            <div className="mt-auto pt-4">
              <BoutonApp
                disabled={!visaComplet}
                onClick={() => {
                  setVisaFait(true);
                  setPhase("hub");
                }}
              >
                {t("enregistrer")}
              </BoutonApp>
            </div>
          </div>
        )}

        {phase === "hebergement" && (
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("hebergementTitre")}</h2>
            <div className="flex flex-col gap-3">
              {optionsHeb.map((o) => (
                <ChoixOption key={o.id} icone={<IconeMaison className="size-5 text-primary-light" />} titre={o.titre} sousTitre={o.sous} fin="radio" actif={hebergement === o.id} onClick={() => setHebergement(o.id)} />
              ))}
            </div>
            <ChampFichier
              titre={t("hebergementFichierTitre")}
              sousTitre={t("hebergementFichierSous")}
              accepteTitre={t("hebergementAccepteTitre")}
              accepteItems={t.raw("hebergementAccepteItems") as string[]}
              choisir={t("hebergementChoisir")}
              formats={t("hebergementFormats")}
              boutonPhoto={t("hebergementPhoto")}
              boutonParcourir={t("hebergementParcourir")}
              onChange={setFichierOk}
            />
            <div className="mt-auto pt-4">
              <BoutonApp
                disabled={!hebComplet}
                onClick={() => {
                  setHebFait(true);
                  setPhase("hub");
                }}
              >
                {t("enregistrer")}
              </BoutonApp>
            </div>
          </div>
        )}
      </GabaritFlux>
      </CoquilleApp>
    </EcranApp>
  );
}
