"use client";

import type { ReactNode } from "react";

/*
 * Option cliquable des flux (choix d'une méthode de recharge, d'un type
 * d'hébergement, d'un pack...) : carte blanche arrondie, pastille d'icône,
 * titre + sous-titre, et fin de ligne au choix (chevron, radio ou rien).
 * L'état sélectionné borde la carte en turquoise.
 */
export default function ChoixOption({
  icone,
  couleurIcone = "#edeef1",
  titre,
  sousTitre,
  onClick,
  actif = false,
  disabled = false,
  fin = "chevron",
}: {
  /** Contenu de la pastille (généralement une balise <img>). */
  icone: ReactNode;
  /** Fond de la pastille d'icône. */
  couleurIcone?: string;
  titre: string;
  sousTitre?: ReactNode;
  onClick?: () => void;
  actif?: boolean;
  disabled?: boolean;
  /** Élément de fin de ligne. */
  fin?: "chevron" | "radio" | "none";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={fin === "radio" ? actif : undefined}
      className={
        "flex w-full items-center gap-3 rounded-2xl border bg-white p-3 text-left transition-all " +
        (disabled ? "opacity-50 " : "hover:shadow-app ") +
        (actif ? "border-primary-light ring-1 ring-primary-light" : "border-grey-200")
      }
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: couleurIcone }}>
        {icone}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold leading-5 text-dark">{titre}</span>
        {sousTitre && <span className="mt-0.5 block text-[11px] leading-4 text-grey">{sousTitre}</span>}
      </span>

      {fin === "chevron" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/app/icons/caret-right.svg" alt="" width={20} height={20} className="size-5 shrink-0" />
      )}
      {fin === "radio" && (
        <span
          className={
            "grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors " +
            (actif ? "border-primary-light" : "border-grey-200")
          }
        >
          {actif && <span className="size-2.5 rounded-full bg-primary-light" />}
        </span>
      )}
    </button>
  );
}
