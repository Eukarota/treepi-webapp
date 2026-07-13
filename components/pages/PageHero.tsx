import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

/*
 * Héro standard des pages produit : fond dégradé Treepi masqué,
 * fil d'Ariane, étiquette, titre avec mot en dégradé corail,
 * sous-titre, CTA et un emplacement libre à droite (mockup).
 */
export default function PageHero({
  breadcrumb,
  eyebrow,
  title,
  subtitle,
  actions,
  aside,
}: {
  breadcrumb: string;
  eyebrow: string;
  title: ReactNode;
  subtitle: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  const t = useTranslations("common.nav");
  return (
    <section className="px-4 pt-4 sm:px-6">
      {/* Fil d'Ariane */}
      <nav className="mx-auto max-w-7xl px-2 pb-3 text-xs text-grey" aria-label="Fil d'Ariane">
        <Link href="/" className="transition-colors hover:text-primary">
          Treepi
        </Link>
        <span className="mx-1.5">›</span>
        <span className="text-navy">{breadcrumb}</span>
      </nav>

      <div className="mask-treepi relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
        <div
          className={`relative z-10 grid items-center gap-10 px-6 py-14 sm:px-12 md:py-16 lg:px-16 ${
            aside ? "md:grid-cols-[1.1fr_0.9fr]" : ""
          }`}
        >
          <div className="text-white">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">{eyebrow}</div>
            <h1 className="mt-3 font-outfit text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
            <div className="mt-5 max-w-xl text-base leading-relaxed text-white/90 [&_b]:font-bold">{subtitle}</div>
            {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}
