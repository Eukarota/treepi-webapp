import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";

/*
 * Bouton du design system Treepi.
 *
 * Tous les boutons du site passent par ce composant afin de garantir :
 *  – un padding cohérent (échelle sm / md / lg) ;
 *  – un effet de survol uniforme : légère élévation + ombre colorée,
 *    sans changement de taille du layout (transform uniquement) ;
 *  – un état focus accessible (anneau visible au clavier).
 */

type Variant = "primary" | "outline" | "white" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-bold rounded-xl " +
  "transition-all duration-200 ease-out select-none whitespace-nowrap " +
  "hover:-translate-y-0.5 active:translate-y-0 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

const VARIANTS: Record<Variant, string> = {
  // CTA principal : dégradé corail signature.
  primary:
    "text-white bg-gradient-to-r from-secondary to-secondary-light shadow-[0_4px_14px_rgba(255,101,103,0.35)] hover:shadow-[0_8px_24px_rgba(255,101,103,0.45)] hover:brightness-105",
  // Action secondaire : contour discret, texte foncé.
  outline:
    "text-navy border-2 border-navy/15 bg-white hover:border-primary hover:text-primary hover:shadow-[0_6px_18px_rgba(5,160,199,0.15)]",
  // Sur fonds sombres ou colorés : bouton blanc.
  white:
    "bg-white text-primary shadow-[0_4px_14px_rgba(11,24,52,0.18)] hover:shadow-[0_8px_24px_rgba(11,24,52,0.28)]",
  // Liens d'action discrets (ex. « Se connecter »).
  ghost:
    "text-navy hover:text-primary hover:bg-primary/5",
  // Variante turquoise pleine (boutons « Choisir » des grilles tarifaires).
  dark:
    "text-white bg-gradient-to-r from-primary to-primary-light shadow-[0_4px_14px_rgba(5,160,199,0.35)] hover:shadow-[0_8px_24px_rgba(5,160,199,0.45)] hover:brightness-105",
};

const SIZES: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-base px-8 py-4",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps>;

export default function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className = "", children, ...rest } = props;
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if ("href" in rest && rest.href !== undefined) {
    // Liens externes (http…) : simple <a>, hors routage i18n.
    if (typeof rest.href === "string" && /^https?:\/\//.test(rest.href)) {
      const { href, ...anchorRest } = rest as ComponentProps<"a"> & { href: string };
      return (
        <a href={href} {...anchorRest} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link {...(rest as ComponentProps<typeof Link>)} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button {...(rest as ComponentProps<"button">)} className={classes}>
      {children}
    </button>
  );
}
