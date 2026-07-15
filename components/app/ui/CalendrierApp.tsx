"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

/*
 * Calendrier en feuille basse (maquette « Tes informations personnelles » /
 * sélection de la date de naissance) : poignée de glissement, titre du mois,
 * en-tête des jours (week-end en rouge), grille avec jour sélectionné en
 * pastille turquoise, bouton « Sélectionner ».
 *
 * Navigation ajoutée par rapport à la maquette (nécessaire au web) :
 * flèches mois précédent/suivant et sélecteur d'année.
 */
export default function CalendrierApp({
  ouverte,
  valeur,
  onFermer,
  onSelectionner,
}: {
  ouverte: boolean;
  /** Date sélectionnée (ISO AAAA-MM-JJ) ou vide. */
  valeur?: string;
  onFermer: () => void;
  onSelectionner: (iso: string) => void;
}) {
  const t = useTranslations("app.inscription.infos2");
  const locale = useLocale();

  // Mois affiché : celui de la valeur, sinon un défaut plausible (1995).
  const initiale = valeur ? new Date(valeur) : new Date(1995, 0, 1);
  const [annee, setAnnee] = useState(initiale.getFullYear());
  const [mois, setMois] = useState(initiale.getMonth());
  const [choix, setChoix] = useState<string | undefined>(valeur);

  if (!ouverte) return null;

  // Grille du mois : indices lundi=0 ... dimanche=6 (maquette M T W T F S S).
  const premierJour = (new Date(annee, mois, 1).getDay() + 6) % 7;
  const nbJours = new Date(annee, mois + 1, 0).getDate();
  const titreMois = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(annee, mois, 1)
  );
  // Initiales des jours, semaine commençant lundi.
  const jours = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(new Date(2024, 0, i + 1))
  );

  const precedant = () => (mois === 0 ? (setMois(11), setAnnee(annee - 1)) : setMois(mois - 1));
  const suivant = () => (mois === 11 ? (setMois(0), setAnnee(annee + 1)) : setMois(mois + 1));
  const iso = (jour: number) =>
    `${annee}-${String(mois + 1).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-dark/40" onClick={onFermer}>
      <div
        className="animate-fade-in rounded-t-[28px] bg-white px-6 pb-8 pt-3 shadow-app"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Poignée de glissement de la feuille basse. */}
        <div className="mx-auto h-1 w-10 rounded-full bg-grey-200" />

        <div className="mt-4 flex items-center justify-between">
          <button type="button" onClick={precedant} aria-label={t("moisPrecedent")} className="flex size-8 items-center justify-center rounded-full text-lg text-dark hover:bg-grey-light">
            ‹
          </button>
          <p className="font-outfit text-base font-bold capitalize text-dark">{titreMois}</p>
          <button type="button" onClick={suivant} aria-label={t("moisSuivant")} className="flex size-8 items-center justify-center rounded-full text-lg text-dark hover:bg-grey-light">
            ›
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-y-2 text-center">
          {jours.map((j, i) => (
            <span key={i} className={"text-sm font-bold " + (i >= 5 ? "text-error" : "text-dark")}>
              {j}
            </span>
          ))}
          {Array.from({ length: premierJour }, (_, i) => (
            <span key={`v${i}`} />
          ))}
          {Array.from({ length: nbJours }, (_, i) => {
            const jour = i + 1;
            const selectionne = choix === iso(jour);
            const weekend = (premierJour + i) % 7 >= 5;
            return (
              <button
                key={jour}
                type="button"
                onClick={() => setChoix(iso(jour))}
                className={
                  "mx-auto flex size-8 items-center justify-center rounded-full text-sm transition-colors " +
                  (selectionne
                    ? "bg-primary-light font-bold text-white"
                    : (weekend ? "text-error" : "text-dark") + " hover:bg-grey-light")
                }
              >
                {jour}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!choix}
          onClick={() => choix && onSelectionner(choix)}
          className="mt-6 inline-flex h-[46px] w-full items-center justify-center rounded-full bg-primary-light text-sm font-bold text-white transition-all hover:brightness-105 disabled:bg-primary-lighter"
        >
          {t("selectionner")}
        </button>
      </div>
    </div>
  );
}
