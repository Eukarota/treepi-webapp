"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import SelecteurLangue from "@/components/app/ui/SelecteurLangue";

/*
 * Navigation de l'app (composant Figma « NavBar/State »).
 *
 * Mobile : barre fixe en bas, coins supérieurs arrondis 28px, ombre douce,
 * 5 entrées (Virement, Recharger, Accueil, Voyage, Carte), l'entrée active
 * en turquoise. Desktop : colonne latérale de SaaS classique, repliable en
 * colonne d'icônes, avec le raccourci profil (avatar + identité) en bas.
 *
 * Seul « Accueil » est câblé pour l'instant : les autres flux (virement,
 * recharge, voyage, carte) arrivent dans les prochaines étapes (TODO).
 */

const ENTREES = [
  { cle: "virement", icone: "/app/icons/nav-virement.svg", href: "/app/virement" },
  { cle: "recharger", icone: "/app/icons/nav-recharger.svg", href: "/app/recharger" },
  { cle: "accueil", icone: "/app/icons/nav-accueil.svg", href: "/app/accueil" },
  { cle: "voyage", icone: "/app/icons/nav-voyage.svg", href: null },
  { cle: "carte", icone: "/app/icons/nav-carte.svg", href: null },
] as const;

export default function NavBarApp({
  repliee = false,
  onBasculer,
}: {
  /** Colonne latérale repliée en icônes (desktop uniquement). */
  repliee?: boolean;
  onBasculer?: () => void;
}) {
  const t = useTranslations("app.accueil");
  const tProfil = useTranslations("app.profil");
  const pathname = usePathname();
  const { session } = useSession();
  const libelles = t.raw("nav") as { cle: string; libelle: string }[];
  const libelle = (cle: string) => libelles.find((l) => l.cle === cle)?.libelle ?? cle;

  const u = session?.utilisateur;
  const initiales = u ? `${u.prenom.charAt(0)}${u.nom.charAt(0)}`.toUpperCase() || "TP" : "TP";

  const Item = ({ entree }: { entree: (typeof ENTREES)[number] }) => {
    const active = entree.href !== null && pathname.startsWith(entree.href);
    const contenu = (
      <>
        <span className={"flex size-6 shrink-0 items-center justify-center" + (active ? "" : " opacity-90")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={entree.icone} alt="" width={24} height={24} className="size-6" />
        </span>
        <span
          className={
            "text-[10px] leading-4 lg:text-sm lg:leading-5 " +
            (active ? "font-bold text-primary-light" : "text-grey") +
            (repliee ? " lg:hidden" : "")
          }
        >
          {libelle(entree.cle)}
        </span>
      </>
    );
    const classes =
      "flex flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition-colors " +
      "lg:w-full lg:flex-row lg:gap-3 lg:py-3 " +
      (repliee ? "lg:justify-center lg:px-0 " : "lg:px-4 ") +
      (active ? "lg:bg-primary-lighter/40" : "hover:bg-grey-light");

    return entree.href ? (
      <Link href={entree.href} className={classes} title={repliee ? libelle(entree.cle) : undefined}>
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
        // Mobile : barre basse fixe. Desktop : colonne latérale repliable.
        "fixed inset-x-0 bottom-0 z-40 flex items-center justify-around rounded-t-[28px] bg-white px-4 pb-2 pt-3 shadow-[0_0_12.5px_rgba(0,0,0,0.15)] " +
        "lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:flex-col lg:items-stretch lg:justify-start lg:gap-1 lg:rounded-none lg:border-r lg:border-grey-100 lg:px-3 lg:pb-4 lg:pt-6 lg:shadow-none lg:transition-[width] lg:duration-300 " +
        (repliee ? "lg:w-20" : "lg:w-56")
      }
    >
      {/* Logo : marque seule en replié, logotype complet sinon (desktop). */}
      <Link
        href="/app/accueil"
        aria-label="Treepi"
        className={"mb-8 hidden h-9 items-center lg:flex " + (repliee ? "justify-center" : "px-3")}
      >
        {repliee ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src="/web-app-manifest-512x512.png" alt="Treepi" width={30} height={30} className="size-[30px]" />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src="/logo.webp" alt="Treepi" width={104} height={36} />
        )}
      </Link>

      {/* Poignée de repli, à cheval sur la bordure de la colonne. */}
      {onBasculer && (
        <button
          type="button"
          onClick={onBasculer}
          aria-label={t(repliee ? "deplier" : "replier")}
          title={t(repliee ? "deplier" : "replier")}
          className="absolute -right-3 top-8 z-10 hidden size-6 place-items-center rounded-full border border-grey-200 bg-white shadow-app transition-colors hover:bg-grey-light lg:grid"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/app/icons/caret-right.svg"
            alt=""
            width={12}
            height={12}
            className={"size-3 transition-transform duration-300" + (repliee ? "" : " rotate-180")}
          />
        </button>
      )}

      {ENTREES.map((entree) => (
        <Item key={entree.cle} entree={entree} />
      ))}

      {/* Sélecteur de langue + raccourci profil en pied de colonne (desktop). */}
      <div className="mt-auto hidden lg:block">
        {repliee ? <SelecteurLangue variante="icone" /> : <SelecteurLangue />}
      </div>
      {u && (
        <div className="hidden border-t border-grey-100 pt-3 lg:block">
          <Link
            href="/app/profil"
            aria-label={tProfil("titre")}
            title={repliee ? `${u.prenom} ${u.nom}` : undefined}
            className={
              "flex items-center gap-3 rounded-xl py-2 transition-colors hover:bg-grey-light " +
              (repliee ? "justify-center px-0" : "px-3")
            }
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-grey text-xs font-bold text-white">
              {initiales}
            </span>
            {!repliee && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold leading-5 text-dark">
                    {u.prenom} {u.nom}
                  </span>
                  <span className="block truncate text-[11px] leading-4 text-grey">{u.email}</span>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/app/icons/caret-right.svg" alt="" width={12} height={12} className="size-3 shrink-0" />
              </>
            )}
          </Link>
        </div>
      )}
    </nav>
  );
}
