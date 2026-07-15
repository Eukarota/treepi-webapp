"use client";

/*
 * Rangée d'un volet du profil (maquettes « Info personnelles / pro /
 * financières ») : intitulé en gras, valeur(s) en dessous en gris, statut
 * optionnel (attention orange / validé vert) et chevron. L'édition des
 * champs arrive avec le backend (TODO), la rangée est donc inerte.
 */
export default function RangeeInfo({
  titre,
  lignes,
  statut,
  bordure = true,
}: {
  titre: string;
  /** Lignes de valeur affichées sous l'intitulé. */
  lignes: React.ReactNode[];
  /** Pastille d'état : attention (orange) ou validé (vert). */
  statut?: "attention" | "valide";
  bordure?: boolean;
}) {
  return (
    <div className={bordure ? "border-t border-grey-100" : ""}>
      <div className="flex items-start gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-bold leading-[22px] text-dark">
            {titre}
            {statut === "attention" && (
              <span className="grid size-4 place-items-center rounded-full bg-secondary-light text-[10px] font-bold leading-none text-white">
                !
              </span>
            )}
            {statut === "valide" && (
              <span className="grid size-4 place-items-center rounded-full bg-success text-[9px] font-bold leading-none text-white">
                ✓
              </span>
            )}
          </p>
          {lignes.map((ligne, i) => (
            <p key={i} className="text-[10px] leading-4 text-grey">
              {ligne}
            </p>
          ))}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app/icons/caret-right.svg" alt="" width={20} height={20} className="mt-0.5 size-5 shrink-0" />
      </div>
    </div>
  );
}
