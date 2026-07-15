/*
 * Coquille d'écran de l'application.
 *
 * Mobile (maquettes Figma 1:1) : l'écran occupe tout le viewport.
 * Desktop (extrapolation) : l'écran devient une carte centrée aux coins
 * arrondis posée sur le fond gris clair, à la manière des maquettes
 * (cadres 320x694 arrondis à 28px), avec l'ombre douce du design system.
 */
export default function EcranApp({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-dvh bg-grey-light md:flex md:items-center md:justify-center md:px-6 md:py-10">
      <div
        className={
          "relative flex min-h-dvh w-full flex-col overflow-hidden bg-white " +
          "md:min-h-0 md:h-[min(780px,calc(100dvh-5rem))] md:w-[420px] md:rounded-[28px] md:shadow-app" +
          (className ? ` ${className}` : "")
        }
      >
        {children}
      </div>
    </div>
  );
}
