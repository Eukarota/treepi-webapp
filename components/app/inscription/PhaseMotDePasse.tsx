"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import GabaritEtape from "./GabaritEtape";
import BoutonApp from "@/components/app/ui/BoutonApp";
import ChampTexte from "@/components/app/ui/ChampTexte";

/*
 * Phase 2 de l'inscription : le mot de passe (maquette « Inscription/Mot de
 * passe » et ses 4 états). Jauge de sécurité + liste de règles :
 *  – 0 règle  : jauge vide, texte d'aide initial ;
 *  – 1 règle  : jauge courte corail (« trop faible ») ;
 *  – 2 règles : jauge turquoise aux 2/3 (« mieux mais pas encore assez ») ;
 *  – 3 règles : jauge pleine turquoise (« Bien joué 🎉 »), bouton actif.
 */

/** Règles de la maquette : longueur, majuscule, caractère spécial. */
const REGLES: ((mdp: string) => boolean)[] = [
  (mdp) => mdp.length >= 8,
  (mdp) => /[A-Z]/.test(mdp),
  (mdp) => /[^A-Za-z0-9]/.test(mdp),
];

export default function PhaseMotDePasse({
  onTerminee,
  onRetour,
  onQuitter,
}: {
  onTerminee: (motDePasse: string) => void;
  onRetour: () => void;
  onQuitter: () => void;
}) {
  const t = useTranslations("app.inscription");
  const [motDePasse, setMotDePasse] = useState("");

  const validees = REGLES.map((regle) => regle(motDePasse));
  const score = validees.filter(Boolean).length;

  // Apparence de la jauge et texte d'aide selon le score.
  const jauge = [
    { largeur: "w-0", couleur: "", aide: t("motDePasse.aideInitiale") },
    { largeur: "w-1/4", couleur: "bg-gradient-to-r from-secondary to-secondary-light", aide: t("motDePasse.aideFaible") },
    { largeur: "w-2/3", couleur: "bg-primary-light", aide: t("motDePasse.aideMoyenne") },
    { largeur: "w-full", couleur: "bg-primary-light", aide: t("motDePasse.aideForte") },
  ][score];

  const regles = t.raw("motDePasse.regles") as string[];

  return (
    <GabaritEtape
      phase={1}
      titreAvant={t("phases.motDePasse.titreAvant")}
      titreCle={t("phases.motDePasse.titreCle")}
      description={t("phases.motDePasse.description")}
      onRetour={onRetour}
      onQuitter={onQuitter}
    >
      <ChampTexte
        label={t("motDePasse.label")}
        name="motDePasse"
        type="password"
        autoComplete="new-password"
        placeholder={t("motDePasse.placeholder")}
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
      />

      {/* Jauge de sécurité et texte d'aide. */}
      <div className="mt-5 flex flex-col gap-2">
        <span className="text-xs font-bold leading-[22px] text-dark">{t("motDePasse.securite")}</span>
        <div className="h-[5px] w-full overflow-hidden rounded-full bg-grey-100">
          <div className={`h-full rounded-full transition-all duration-300 ${jauge.largeur} ${jauge.couleur}`} />
        </div>
        <p className={"text-sm leading-[22px] " + (score === 1 ? "text-dark" : "text-grey")}>{jauge.aide}</p>
      </div>

      {/* Liste des règles avec coche verte quand satisfaites. */}
      <div className="mt-5 flex flex-col gap-3">
        <span className="text-xs font-bold leading-[22px] text-dark">{t("motDePasse.doitContenir")}</span>
        {regles.map((regle, i) => (
          <div key={regle} className="flex items-center gap-2">
            <span
              className={
                "flex size-5 items-center justify-center rounded-full text-[11px] font-bold text-white transition-colors " +
                (validees[i] ? "bg-success" : "bg-grey-100")
              }
            >
              {validees[i] ? "✓" : ""}
            </span>
            <span className="text-sm leading-[22px] text-grey-700">{regle}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <BoutonApp disabled={score < REGLES.length} onClick={() => onTerminee(motDePasse)}>
          {t("continuer")}
        </BoutonApp>
      </div>
    </GabaritEtape>
  );
}
