"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BrouillonInscription } from "@/lib/api/types";
import { NATIONALITES, PAYS, VILLES } from "@/lib/data/suggestions";
import GabaritEtape from "./GabaritEtape";
import BoutonApp from "@/components/app/ui/BoutonApp";
import ChampTexte from "@/components/app/ui/ChampTexte";
import ChampDate from "@/components/app/ui/ChampDate";
import SelecteurListe from "@/components/app/ui/SelecteurListe";

/** « JJ/MM/AAAA » -> ISO « AAAA-MM-JJ » (ou vide si incomplet). */
function dateVersIso(affiche: string): string {
  const m = affiche.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}

/*
 * Phase 3 de l'inscription : les informations personnelles (maquettes
 * « Inscription/Informations personnelles/Step1-3 »).
 *  – 1/3 : civilité (radios Homme/Femme), prénom, nom ;
 *  – 2/3 : date de naissance (calendrier en feuille basse) + ville de naissance ;
 *  – 3/3 : nationalité, pays de résidence, ville.
 */
export default function PhaseInfos({
  onTerminee,
  onRetour,
  onQuitter,
}: {
  onTerminee: (infos: Partial<BrouillonInscription>) => void;
  onRetour: () => void;
  onQuitter: () => void;
}) {
  const t = useTranslations("app.inscription");
  const [sousEtape, setSousEtape] = useState<0 | 1 | 2>(0);

  const [genre, setGenre] = useState<"homme" | "femme">();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  // Date de naissance saisie au format affiché JJ/MM/AAAA (convertie en ISO
  // au moment de valider le brouillon).
  const [dateNaissance, setDateNaissance] = useState("");
  const [villeNaissance, setVilleNaissance] = useState("");
  const [nationalite, setNationalite] = useState("");
  const [paysResidence, setPaysResidence] = useState("");
  const [villeResidence, setVilleResidence] = useState("");

  const complets = [
    Boolean(genre && prenom.trim() && nom.trim()),
    Boolean(dateNaissance.length === 10 && villeNaissance.trim()),
    Boolean(nationalite.trim() && paysResidence.trim() && villeResidence.trim()),
  ];

  const continuer = () => {
    if (sousEtape < 2) {
      setSousEtape((s) => (s + 1) as 1 | 2);
      return;
    }
    onTerminee({
      genre,
      prenom: prenom.trim(),
      nom: nom.trim(),
      dateNaissance: dateVersIso(dateNaissance),
      villeNaissance: villeNaissance.trim(),
      nationalite: nationalite.trim(),
      paysResidence: paysResidence.trim(),
      villeResidence: villeResidence.trim(),
    });
  };

  /** Radio de civilité : pastille turquoise quand sélectionnée. */
  const radioCivilite = (valeur: "homme" | "femme", libelle: string) => (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="radio"
        name="civilite"
        checked={genre === valeur}
        onChange={() => setGenre(valeur)}
        className="peer sr-only"
      />
      <span
        className={
          "flex size-5 items-center justify-center rounded-full border-2 transition-colors " +
          (genre === valeur ? "border-primary-light" : "border-grey-200 bg-grey-100")
        }
      >
        {genre === valeur && <span className="size-2.5 rounded-full bg-primary-light" />}
      </span>
      <span className="text-sm font-medium leading-[22px] text-dark">{libelle}</span>
    </label>
  );

  return (
    <GabaritEtape
      phase={2}
      titreAvant={t("phases.infos.titreAvant")}
      titreCle={t("phases.infos.titreCle")}
      description={t("phases.infos.description")}
      onRetour={() => (sousEtape === 0 ? onRetour() : setSousEtape((s) => (s - 1) as 0 | 1))}
      onQuitter={onQuitter}
    >
      {sousEtape === 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold leading-[22px] text-dark">{t("infos1.civilite")}</span>
            <div className="flex items-center gap-8">
              {radioCivilite("homme", t("infos1.homme"))}
              {radioCivilite("femme", t("infos1.femme"))}
            </div>
          </div>
          <ChampTexte
            label={t("infos1.prenom")}
            name="prenom"
            autoComplete="given-name"
            placeholder={t("infos1.prenomPlaceholder")}
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
          <ChampTexte
            label={t("infos1.nom")}
            name="nom"
            autoComplete="family-name"
            placeholder={t("infos1.nomPlaceholder")}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>
      )}

      {sousEtape === 1 && (
        <div className="flex flex-col gap-4">
          {/* Date de naissance : saisie manuelle JJ/MM/AAAA ou calendrier. */}
          <ChampDate
            label={t("infos2.dateNaissance")}
            name="dateNaissance"
            placeholder={t("infos2.datePlaceholder")}
            value={dateNaissance}
            onChange={setDateNaissance}
          />
          <ChampTexte
            label={t("infos2.villeNaissance")}
            name="villeNaissance"
            list="liste-villes"
            autoComplete="off"
            placeholder={t("infos2.villePlaceholder")}
            value={villeNaissance}
            onChange={(e) => setVilleNaissance(e.target.value)}
          />
        </div>
      )}

      {sousEtape === 2 && (
        <div className="flex flex-col gap-4">
          <ChampTexte
            label={t("infos3.nationalite")}
            name="nationalite"
            list="liste-nationalites"
            autoComplete="off"
            placeholder={t("infos3.nationalitePlaceholder")}
            value={nationalite}
            onChange={(e) => setNationalite(e.target.value)}
          />
          <SelecteurListe
            label={t("infos3.pays")}
            name="paysResidence"
            placeholder={t("infos3.paysPlaceholder")}
            options={PAYS}
            value={paysResidence}
            onChange={setPaysResidence}
          />
          <ChampTexte
            label={t("infos3.ville")}
            name="villeResidence"
            list="liste-villes"
            autoComplete="off"
            placeholder={t("infos3.villePlaceholder")}
            value={villeResidence}
            onChange={(e) => setVilleResidence(e.target.value)}
          />
        </div>
      )}

      {/* Listes de propositions (autocomplétion native, saisie libre gardée). */}
      <datalist id="liste-villes">
        {VILLES.map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>
      <datalist id="liste-nationalites">
        {NATIONALITES.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>

      <div className="mt-auto pt-8">
        <BoutonApp disabled={!complets[sousEtape]} onClick={continuer}>
          {t("continuer")}
        </BoutonApp>
      </div>
    </GabaritEtape>
  );
}
