"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/*
 * Barre de navigation de l'app (composant Figma « NavBar/State »).
 *
 * Mobile : barre fixe en bas, coins supérieurs arrondis 28px, ombre douce,
 * 5 entrées (Virement, Recharger, Accueil, Voyage, Carte), l'entrée active
 * en turquoise. Desktop (extrapolation mobile-first) : la même navigation
 * devient une colonne latérale fixe à gauche.
 *
 * Seul « Accueil » est câblé pour l'instant : les autres flux (virement,
 * recharge, voyage, carte) arrivent dans les prochaines étapes (TODO).
 */

const ENTREES = [
  { cle: "virement", icone: "/app/icons/nav-virement.svg", href: null },
  { cle: "recharger", icone: "/app/icons/nav-recharger.svg", href: null },
  { cle: "accueil", icone: "/app/icons/nav-accueil.svg", href: "/app/accueil" },
  { cle: "voyage", icone: "/app/icons/nav-voyage.svg", href: null },
  { cle: "carte", icone: "/app/icons/nav-carte.svg", href: null },
] as const;

export default function NavBarApp() {
  const t = useTranslations("app.accueil");
  const pathname = usePathname();
  const libelles = t.raw("nav") as { cle: string; libelle: string }[];
  const libelle = (cle: string) => libelles.find((l) => l.cle === cle)?.libelle ?? cle;

  const Item = ({ entree }: { entree: (typeof ENTREES)[number] }) => {
    const active = entree.href !== null && pathname.startsWith(entree.href);
    const contenu = (
      <>
        <span className={"flex size-6 items-center justify-center" + (active ? "" : " opacity-90")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={entree.icone} alt="" width={24} height={24} className="size-6" />
        </span>
        <span className={"text-[10px] leading-4 " + (active ? "font-bold text-primary-light" : "text-grey")}>
          {libelle(entree.cle)}
        </span>
      </>
    );
    const classes =
      "flex flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition-colors " +
      "lg:w-full lg:flex-row lg:gap-3 lg:px-4 lg:py-3 " +
      (active ? "lg:bg-primary-lighter/40" : "hover:bg-grey-light");

    return entree.href ? (
      <Link href={entree.href} className={classes}>
        {contenu}
      </Link>
    ) : (
      <button type="button" title={t("bientot")} className={classes + " cursor-default opacity-70"}>
        {contenu}
      </button>
    );
  };

  return (
    <nav
      className={
        // Mobile : barre basse fixe. Desktop : colonne latérale.
        "fixed inset-x-0 bottom-0 z-40 flex items-center justify-around rounded-t-[28px] bg-white px-4 pb-2 pt-3 shadow-[0_0_12.5px_rgba(0,0,0,0.15)] " +
        "lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:w-56 lg:flex-col lg:items-stretch lg:justify-start lg:gap-1 lg:rounded-none lg:border-r lg:border-grey-100 lg:px-4 lg:pt-24 lg:shadow-none"
      }
    >
      {/* Logo de la colonne latérale (desktop uniquement). */}
      <Link href="/app/accueil" className="absolute left-6 top-8 hidden lg:block" aria-label="Treepi">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.webp" alt="Treepi" width={110} height={38} />
      </Link>
      {ENTREES.map((entree) => (
        <Item key={entree.cle} entree={entree} />
      ))}
    </nav>
  );
}
