import type { ReactNode } from "react";
import Swirl from "@/components/ui/Swirl";

/*
 * Bande masquée du site en production : conteneur arrondi dont le fond
 * (dégradé turquoise) est découpé par la forme organique Treepi, avec la
 * grande volute « e » posée par-dessus. Le contenu vit au-dessus du masque.
 * `variante` choisit la forme : héro (main-mask) ou double encoche
 * (secondary-mask, sections Visa app et services).
 */
export default function BandeMasquee({
  children,
  className = "",
  varianteMasque = "principale",
  claseMasque = "",
  swirlClassName,
  volute,
}: {
  children?: ReactNode;
  className?: string;
  varianteMasque?: "principale" | "secondaire" | "secondaire-services";
  claseMasque?: string;
  swirlClassName?: string;
  /* Remplace la volute « e » générique (ex. boucle propre aux services). */
  volute?: ReactNode;
}) {
  const masque =
    varianteMasque === "principale"
      ? "mask-treepi"
      : varianteMasque === "secondaire"
        ? "bande-secondaire"
        : "bande-secondaire bande-secondaire--services";

  const voluteRendue = volute ?? (
    <Swirl
      className={
        swirlClassName ??
        "masker-layer pointer-events-none absolute inset-0 z-[5] w-full max-md:w-[93%] max-md:-translate-y-60 max-md:translate-x-6"
      }
    />
  );

  /* Variantes « secondaire » : le masque est posé sur le conteneur, comme en
     production, si bien que la volute et le contenu sont rognés par la
     silhouette. Le héros garde son masque sur un calque de fond. */
  if (varianteMasque !== "principale") {
    return (
      <div className={`relative min-h-[600px] overflow-hidden rounded-3xl ${masque} ${claseMasque} ${className}`}>
        {voluteRendue}
        <div className="relative z-30 h-full">{children}</div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-[600px] overflow-hidden rounded-3xl ${className}`}>
      <div className={`absolute inset-0 ${masque} ${claseMasque}`} />
      {voluteRendue}
      {/* Le contenu passe au-dessus de la volute (z-30 contre z-5), comme la
          hiérarchie du site en production. */}
      <div className="relative z-30 h-full">{children}</div>
    </div>
  );
}
