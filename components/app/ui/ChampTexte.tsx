"use client";

import { useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

/*
 * Champ de formulaire de l'application (composant Figma « Form_Field »).
 *
 * Label Inter Bold 12 gris 950, champ 42px aux coins 12px bordé gris 100,
 * placeholder Inter Medium 14 gris 300. Options :
 *  – type="password" : œil d'affichage/masquage (icône Figma vuesax/eye) ;
 *  – erreur : bordure + message rouges (états « Error » des maquettes) ;
 *  – iconeDroite : contenu libre côté droit (ex. drapeau, calendrier).
 */

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Message d'erreur affiché sous le champ (active le style d'erreur). */
  erreur?: string;
  /** Élément affiché à droite dans le champ (icône, drapeau...). */
  iconeDroite?: ReactNode;
}

export default function ChampTexte({ label, erreur, iconeDroite, type, id, className, ...props }: Props) {
  // Bascule d'affichage du mot de passe (œil des maquettes).
  const [visible, setVisible] = useState(false);
  const estMotDePasse = type === "password";
  const typeEffectif = estMotDePasse && visible ? "text" : type;
  const idChamp = id ?? props.name;

  return (
    <div className={"flex w-full flex-col gap-2" + (className ? ` ${className}` : "")}>
      <label htmlFor={idChamp} className="text-xs font-bold leading-[22px] text-dark">
        {label}
      </label>
      <div
        className={
          "flex h-[42px] w-full items-center gap-3 rounded-xl border bg-white p-3 " +
          "transition-colors focus-within:border-primary-light " +
          (erreur ? "border-error" : "border-grey-100")
        }
      >
        <input
          id={idChamp}
          type={typeEffectif}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium leading-[22px] text-dark outline-none placeholder:text-grey-300"
          {...props}
        />
        {estMotDePasse ? (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className={"shrink-0 transition-opacity hover:opacity-70" + (visible ? " opacity-50" : "")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/icons/eye.svg" alt="" width={20} height={20} />
          </button>
        ) : (
          iconeDroite
        )}
      </div>
      {erreur ? <p className="text-xs leading-4 text-error">{erreur}</p> : null}
    </div>
  );
}
