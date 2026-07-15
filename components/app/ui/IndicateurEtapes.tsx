/*
 * Indicateur de progression du walkthrough (composant Figma
 * « Slider indicator ») : un segment par étape, 5px de haut, arrondi.
 *  – étapes passées : corail plein ;
 *  – étape courante : dégradé corail → pêche ;
 *  – étapes à venir : gris 200.
 */
export default function IndicateurEtapes({
  total,
  courante,
}: {
  total: number;
  /** Index (base 0) de l'étape courante. */
  courante: number;
}) {
  return (
    <div className="flex w-full items-center gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={
            "h-[5px] flex-1 rounded-full transition-colors duration-300 " +
            (i < courante
              ? "bg-secondary"
              : i === courante
                ? "bg-gradient-to-r from-secondary to-secondary-light"
                : "bg-grey-200")
          }
        />
      ))}
    </div>
  );
}
