"use client";

import { useTranslations } from "next-intl";

/*
 * Grille « Va plus loin avec Treepi » (composants Figma
 * « ServiceCard/Rectangle ») : cartes 2 colonnes, vignette illustrée en grisé
 * (export aplati), petite pastille d'icône colorée à cheval sur la vignette,
 * libellé en gras et chevron. Les fiches service arrivent avec les flux
 * dédiés (TODO).
 *
 * L'export aplati embarque son propre cadre arrondi ; on recadre légèrement
 * la vignette (object-cover + léger zoom) pour que l'illustration remplisse la
 * carte sans double bordure ni liseré blanc, avec le rayon de la carte.
 */

/** Pastille d'icône par service : glyphe blanc sur fond de marque. */
const ICONES = [
  { image: "service-attestation", icone: "/app/icons/service-portefeuille.svg", fond: "bg-secondary-light" },
  { image: "service-recours", icone: "/app/icons/service-globe.svg", fond: "bg-primary-light" },
  { image: "service-accompagnement", icone: "/app/icons/service-identite.svg", fond: "bg-secondary" },
  { image: "service-hebergement", icone: "/app/icons/service-maison.svg", fond: "bg-emerald-700" },
];

export default function ServicesTreepi() {
  const t = useTranslations("app.accueil");
  const services = t.raw("services") as { libelle: string; image: string }[];

  return (
    <section data-tuto="services" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("servicesTitre")}</h2>
        <button type="button" title={t("bientot")} className="rounded-2xl bg-grey-100 px-2 py-1 text-[10px] leading-4 text-dark transition-colors hover:bg-grey-200">
          {t("voirTout")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {services.map((service) => {
          const visuel = ICONES.find((i) => i.image === service.image);
          return (
            <button
              key={service.image}
              type="button"
              title={t("bientot")}
              className="overflow-hidden rounded-2xl border border-grey-200 bg-white text-left transition-shadow hover:shadow-app"
            >
              <div className="relative">
                {/* Vignette : l'export est recadré (zoom léger) pour masquer
                    son cadre d'origine et remplir la carte. */}
                <div className="aspect-[16/10] overflow-hidden bg-grey-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/app/accueil/${service.image}.png`} alt="" className="size-full scale-[1.12] object-cover" />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/app/icons/caret-right.svg" alt="" width={16} height={16} className="absolute right-1.5 top-1.5 size-4" />
                <span className={`absolute -bottom-2 left-2 grid size-6 place-items-center rounded-full ${visuel?.fond}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={visuel?.icone} alt="" width={12} height={12} className="size-3 brightness-0 invert" />
                </span>
              </div>
              <p className="px-2 pb-2 pt-3 text-xs font-bold leading-4 text-dark">{service.libelle}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
