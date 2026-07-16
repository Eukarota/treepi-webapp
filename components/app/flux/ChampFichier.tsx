"use client";

import { useRef, useState } from "react";
import { IconeTeleversement } from "./icones";

/*
 * Champ de téléversement de document (maquettes KYC « Charger un fichier »).
 * Carte blanche : en-tête, liste des documents acceptés, zone en pointillés
 * avec « Prendre une photo » / « Parcourir », puis, une fois un fichier choisi,
 * une pastille nom + poids avec croix de retrait. La simulation ne téléverse
 * rien : elle mémorise juste le nom du fichier et prévient le parent.
 */

interface FichierChoisi {
  nom: string;
  taille: number;
}

export default function ChampFichier({
  titre,
  sousTitre,
  accepteTitre,
  accepteItems,
  choisir,
  formats,
  boutonPhoto,
  boutonParcourir,
  onChange,
}: {
  titre: string;
  sousTitre: string;
  accepteTitre: string;
  accepteItems: string[];
  /** Titre de la zone de dépôt (ex. « Choisis un fichier »). */
  choisir: string;
  /** Ligne de formats acceptés (ex. « JPEG, PNG, PDF, jusqu'à 50MB »). */
  formats: string;
  boutonPhoto: string;
  boutonParcourir: string;
  /** Prévient le parent qu'un fichier est présent (pour activer « Continuer »). */
  onChange?: (present: boolean) => void;
}) {
  const [fichier, setFichier] = useState<FichierChoisi | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const surSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFichier({ nom: f.name, taille: f.size });
    onChange?.(true);
  };

  const retirer = () => {
    setFichier(null);
    onChange?.(false);
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

      {/* Documents acceptés. */}
      <div>
        <p className="text-xs font-bold text-dark">{accepteTitre}</p>
        <ul className="mt-1 flex flex-col gap-0.5">
          {accepteItems.map((it) => (
            <li key={it} className="flex gap-1.5 text-[11px] leading-4 text-grey">
              <span aria-hidden>•</span>
              {it}
            </li>
          ))}
        </ul>
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
