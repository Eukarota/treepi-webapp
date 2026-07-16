"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/*
 * Grille « Va plus loin avec Treepi » (composants Figma
 * « ServiceCard/Rectangle ») : cartes 2 colonnes, vignette illustrée en grisé
 * (export aplati), petite pastille d'icône colorée à cheval sur la vignette,
 * libellé en gras et chevron. Chaque carte ouvre son flux de service.
 *
 * Les exports d'illustration ont été détourés de leur cadre d'origine (la
 * bordure grise et les coins étaient inclus, d'où le double liseré). On les
 * affiche donc à leur ratio natif (aucun agrandissement, sinon crénelage),
 * la carte apportant sa propre bordure et son rayon.
 */

/** Pastille d'icône + destination par service. */
const ICONES = [
  { image: "service-attestation", icone: "/app/icons/service-portefeuille.svg", fond: "bg-secondary-light", href: "/app/attestation" },
  { image: "service-recours", icone: "/app/icons/service-globe.svg", fond: "bg-primary-light", href: "/app/recours" },
  { image: "service-accompagnement", icone: "/app/icons/service-identite.svg", fond: "bg-secondary", href: "/app/accompagnement" },
  { image: "service-hebergement", icone: "/app/icons/service-maison.svg", fond: "bg-emerald-700", href: "/app/visa" },
];

export default function ServicesTreepi() {
  const t = useTranslations("app.accueil");
  const services = t.raw("services") as { libelle: string; image: string }[];

  return (
    <section data-tuto="services" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("servicesTitre")}</h2>
        <Link href="/app/voyage" className="rounded-2xl bg-grey-100 px-2 py-1 text-[10px] leading-4 text-dark transition-colors hover:bg-grey-200">
          {t("voirTout")}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {services.map((service) => {
          const visuel = ICONES.find((i) => i.image === service.image);
          return (
            <Link
              key={service.image}
              href={visuel?.href ?? "/app/voyage"}
              className="overflow-hidden rounded-2xl border border-grey-200 bg-white text-left transition-shadow hover:shadow-app"
            >
              <div className="relative">
                {/* Vignette au ratio natif de l'illustration détourée. */}
                <div className="aspect-[388/133] overflow-hidden bg-grey-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/app/accueil/${service.image}.png`} alt="" className="size-full object-cover" />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/app/icons/caret-right.svg" alt="" width={16} height={16} className="absolute right-1.5 top-1.5 size-4" />
                <span className={`absolute -bottom-2 left-2 grid size-6 place-items-center rounded-full ${visuel?.fond}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={visuel?.icone} alt="" width={12} height={12} className="size-3 brightness-0 invert" />
                </span>
              </div>
              <p className="px-2 pb-2 pt-3 text-xs font-bold leading-4 text-dark">{service.libelle}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
