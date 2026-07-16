"use client";

/*
 * Carte d'un pack sur l'écran « De quoi as-tu besoin ? ». Repliée : nom (turquoise),
 * accroche, prix annuel, et un chevron pour déplier le détail. Dépliée : les
 * sections d'avantages, chaque ligne précédée d'une pastille turquoise (les
 * lignes commençant par « - » sont des sous-points indentés). Le pack retenu
 * porte une bordure corail. Un badge « Populaire » coiffe l'offre mise en avant.
 */

export interface SectionPack {
  titre: string;
  items: string[];
}

/** Pastille de puce turquoise devant chaque avantage. */
function puce() {
  return (
    <span className="mt-px grid size-[18px] shrink-0 place-items-center rounded-full bg-primary-lighter/50 text-primary-light">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

export default function CartePack({
  nom,
  prix,
  accroche,
  note,
  populaire,
  badgePopulaire,
  sections,
  selectionne,
  ouvert,
  onSelectionner,
  onBasculer,
}: {
  nom: string;
  /** Prix annuel préformaté (ex. « 80€/an »). */
  prix: string;
  accroche: string;
  /** Ligne complémentaire en corail (ex. « Recours visa jusqu'à 15 000 € »). */
  note?: string;
  populaire?: boolean;
  badgePopulaire?: string;
  sections: SectionPack[];
  selectionne: boolean;
  ouvert: boolean;
  onSelectionner: () => void;
  onBasculer: () => void;
}) {
  return (
    <div
      className={
        "relative rounded-2xl border bg-white transition-all " +
        (selectionne ? "border-secondary ring-1 ring-secondary" : "border-grey-200")
      }
    >
      {populaire && badgePopulaire && (
        <span className="absolute -top-2.5 left-4 z-10 rounded-full bg-gradient-to-r from-secondary to-secondary-light px-2.5 py-1 text-[10px] font-bold leading-none text-white shadow-[0_4px_10px_rgba(255,101,103,0.35)]">
          {badgePopulaire}
        </span>
      )}

      {/* Entête sélectionnable. */}
      <button type="button" onClick={onSelectionner} className="flex w-full items-start gap-3 p-4 text-left">
        <span className="min-w-0 flex-1">
          <span className="block font-outfit text-[15px] font-bold leading-5 text-primary-light">{nom}</span>
          <span className="mt-1 block text-xs leading-[18px] text-grey">{accroche}</span>
          {note && <span className="mt-1 block text-xs font-medium leading-[18px] text-secondary">{note}</span>}
        </span>
        <span className="shrink-0 font-outfit text-sm font-bold leading-5 text-dark">{prix}</span>
      </button>

      {/* Détail déplié. */}
      {ouvert && (
        <div className="flex flex-col gap-3 px-4 pb-2">
          {sections.map((s) => (
            <div key={s.titre} className="flex flex-col gap-2">
              <p className="text-[13px] font-bold leading-5 text-dark">{s.titre}</p>
              <ul className="flex flex-col gap-1.5">
                {s.items.map((it) =>
                  it.startsWith("-") ? (
                    <li key={it} className="pl-[26px] text-xs leading-[18px] text-grey">{it.replace(/^-\s*/, "– ")}</li>
                  ) : (
                    <li key={it} className="flex gap-2 text-[13px] leading-[18px] text-dark">
                      {puce()}
                      <span className="min-w-0">{it}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Chevron d'ouverture. */}
      <div className="mx-4 border-t border-grey-100">
        <button
          type="button"
          onClick={onBasculer}
          aria-expanded={ouvert}
          className="flex w-full items-center justify-center py-2 text-primary-light transition-colors hover:text-primary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={"transition-transform duration-300 " + (ouvert ? "rotate-180" : "")}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
