/*
 * Coquille d'écran de l'application, pensée mobile-first.
 *
 * Mobile : reproduction 1:1 des maquettes, l'écran occupe tout le viewport
 * et les blocs « mt-auto » (CTA) se calent en bas.
 * Desktop : le MÊME écran s'étire en pleine page : les fonds (dégradés,
 * volutes, courbes) couvrent tout le viewport et la colonne de contenu se
 * centre naturellement. Chaque écran borne sa colonne avec la classe
 * utilitaire `.colonne-app` (max-w-md centré), les écrans riches comme le
 * tableau de bord définissent leur propre grille.
 */
export default function EcranApp({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "relative flex min-h-dvh w-full flex-col overflow-x-clip bg-white" +
        (className ? ` ${className}` : "")
      }
    >
      {children}
    </div>
  );
}
