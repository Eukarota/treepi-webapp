import Swirl from "@/components/ui/Swirl";

/*
 * Fond d'écran clair de l'application (composant Figma « Background /
 * Light ») : blanc cassé avec la volute « e » de la marque en filigrane.
 * Posé en absolu derrière le contenu de l'écran.
 */
export default function FondApp() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-grey-light">
      {/* Volute blanche pleine : filigrane visible sur le gris clair. */}
      <Swirl className="absolute inset-0 h-full w-full" opacite={0.9} />
    </div>
  );
}
