"use client";

import { useState } from "react";
import CalendrierApp from "./CalendrierApp";
import { IconeCalendrier } from "@/components/app/flux/icones";

/*
 * Champ de date réutilisable : saisie manuelle au format JJ/MM/AAAA (avec
 * masque automatique) OU sélection via le calendrier en feuille basse, ouvert
 * en cliquant sur l'icône. La valeur échangée avec le parent est la chaîne
 * affichée « JJ/MM/AAAA » ; on convertit en ISO uniquement pour le calendrier.
 */

/** « JJ/MM/AAAA » -> « AAAA-MM-JJ » (ISO) ou vide si incomplet. */
function versIso(affiche: string): string {
  const m = affiche.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}

/** « AAAA-MM-JJ » -> « JJ/MM/AAAA ». */
function versAffiche(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

/** Masque de saisie : n'accepte que des chiffres et insère les « / ». */
function masquer(saisie: string): string {
  const d = saisie.replace(/\D/g, "").slice(0, 8);
  let r = d.slice(0, 2);
  if (d.length > 2) r += "/" + d.slice(2, 4);
  if (d.length > 4) r += "/" + d.slice(4, 8);
  return r;
}

export default function ChampDate({
  label,
  name,
  value,
  onChange,
  placeholder = "JJ/MM/AAAA",
}: {
  label: string;
  name?: string;
  /** Valeur affichée au format JJ/MM/AAAA. */
  value: string;
  onChange: (valeur: string) => void;
  placeholder?: string;
}) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={name} className="text-xs font-bold leading-[22px] text-dark">
        {label}
      </label>
      <div className="flex h-[42px] w-full items-center gap-3 rounded-xl border border-grey-100 bg-white p-3 transition-colors focus-within:border-primary-light">
        <input
          id={name}
          name={name}
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(masquer(e.target.value))}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium leading-[22px] text-dark outline-none placeholder:text-grey-300"
        />
        <button type="button" onClick={() => setOuvert(true)} aria-label={placeholder} className="shrink-0 text-grey transition-colors hover:text-primary-light">
          <IconeCalendrier className="size-5" />
        </button>
      </div>

      <CalendrierApp
        ouverte={ouvert}
        valeur={versIso(value) || undefined}
        onFermer={() => setOuvert(false)}
        onSelectionner={(iso) => {
          onChange(versAffiche(iso));
          setOuvert(false);
        }}
      />
    </div>
  );
}
