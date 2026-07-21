"use client";

import { useRef, useState } from "react";
import { IconeCheck, IconeTeleversement } from "./icones";

/*
 * Champ de téléversement de document (maquettes KYC « Charger un fichier »).
 * Carte blanche : en-tête, liste des documents acceptés, zone en pointillés
 * avec « Prendre une photo » / « Parcourir », puis, une fois un fichier choisi,
 * une pastille nom + poids avec croix de retrait. La simulation ne téléverse
 * rien : elle mémorise juste le nom du fichier et prévient le parent.
 */

export interface FichierChoisi {
  nom: string;
  taille: number;
}

/*
 * Ligne de la liste des documents acceptés. Une simple chaîne rend une puce
 * grise ; un objet permet de varier la marque selon la maquette d'hébergement :
 *  – « check » : coche verte (réservation d'hôtel/airbnb) ;
 *  – « plus »  : « + » vert (justificatifs cumulés d'un hébergement chez un proche) ;
 *  – « separateur » : mention « OU » corail entre deux justificatifs équivalents ;
 *  – « puce » (défaut) : puce grise.
 */
export type MarqueDocument = "puce" | "check" | "plus" | "separateur";
export interface LigneDocument {
  texte: string;
  marque?: MarqueDocument;
}

export default function ChampFichier({
  titre,
  sousTitre,
  accepteTitre,
  accepteItems,
  note,
  choisir,
  formats,
  boutonPhoto,
  boutonParcourir,
  fichierInitial,
  onChange,
  onFichier,
}: {
  titre: string;
  sousTitre: string;
  accepteTitre: string;
  accepteItems: readonly (string | LigneDocument)[];
  /** Mention complémentaire sous la liste (ex. « un seul document PDF »), corail. */
  note?: string;
  /** Titre de la zone de dépôt (ex. « Choisis un fichier »). */
  choisir: string;
  /** Ligne de formats acceptés (ex. « JPEG, PNG, PDF, jusqu'à 50MB »). */
  formats: string;
  boutonPhoto: string;
  boutonParcourir: string;
  /** Fichier déjà choisi (pour réhydrater le champ au retour arrière du flux). */
  fichierInitial?: FichierChoisi | null;
  /** Prévient le parent qu'un fichier est présent (pour activer « Continuer »). */
  onChange?: (present: boolean) => void;
  /** Transmet le fichier choisi (nom + poids) pour le récapitulatif. */
  onFichier?: (fichier: FichierChoisi | null) => void;
}) {
  // Réhydraté depuis le parent : le champ est rendu conditionnellement dans les
  // flux, donc l'état vivrait et mourrait avec l'étape sans cette graine.
  const [fichier, setFichier] = useState<FichierChoisi | null>(fichierInitial ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const surSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const choisi = { nom: f.name, taille: f.size };
    setFichier(choisi);
    onChange?.(true);
    onFichier?.(choisi);
  };

  const retirer = () => {
    setFichier(null);
    onChange?.(false);
    onFichier?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const poids = (o: number) => (o < 1024 ? `${o} o` : o < 1024 * 1024 ? `${Math.round(o / 1024)} Ko` : `${(o / 1024 / 1024).toFixed(1)} Mo`);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-grey-200 bg-white p-4">
      {/* Entête. */}
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-grey-200 text-grey-700">
          <IconeTeleversement className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold leading-5 text-dark">{titre}</span>
          <span className="block text-[11px] leading-4 text-grey">{sousTitre}</span>
        </span>
      </div>

      <hr className="border-grey-100" />

      {/* Documents acceptés (marque adaptée : puce, coche verte, « + » vert, « OU »). */}
      <div>
        <p className="text-xs font-bold text-dark">{accepteTitre}</p>
        <ul className="mt-1 flex flex-col gap-0.5">
          {accepteItems.map((it) => {
            const ligne: LigneDocument = typeof it === "string" ? { texte: it, marque: "puce" } : it;
            if (ligne.marque === "separateur") {
              return (
                <li key={ligne.texte} className="text-[11px] font-bold leading-4 text-secondary">
                  {ligne.texte}
                </li>
              );
            }
            return (
              <li key={ligne.texte} className="flex gap-1.5 text-[11px] leading-4 text-grey">
                {ligne.marque === "check" ? (
                  <IconeCheck className="mt-px size-3 shrink-0 text-success" />
                ) : ligne.marque === "plus" ? (
                  <span aria-hidden className="mt-px shrink-0 font-bold leading-3 text-success">+</span>
                ) : (
                  <span aria-hidden>•</span>
                )}
                {ligne.texte}
              </li>
            );
          })}
        </ul>
        {note && <p className="mt-2 text-[11px] font-medium italic leading-4 text-secondary">{note}</p>}
      </div>

      {/* Zone de dépôt en pointillés. */}
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-grey-300 px-4 py-5 text-center">
        <IconeTeleversement className="size-6 text-grey-300" />
        <p className="text-xs font-bold text-dark">{choisir}</p>
        <p className="text-[10px] leading-4 text-grey">{formats}</p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-primary-light px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:brightness-105"
          >
            {boutonPhoto}
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-grey-200 px-3 py-1.5 text-[11px] font-bold text-dark transition-colors hover:bg-grey-light"
          >
            {boutonParcourir}
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/*,application/pdf" onChange={surSelection} className="hidden" />
      </div>

      {/* Fichier choisi. */}
      {fichier && (
        <div className="flex items-center gap-3 rounded-xl bg-grey-light p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-error/10 text-[9px] font-bold text-error">PDF</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-bold text-dark">{fichier.nom}</span>
            <span className="block text-[10px] leading-4 text-grey">{poids(fichier.taille)}</span>
          </span>
          <button type="button" onClick={retirer} aria-label="Retirer" className="flex size-6 shrink-0 items-center justify-center rounded-full text-lg leading-none text-grey transition-colors hover:bg-grey-200">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
