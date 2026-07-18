"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import BandeMasquee from "@/components/landing/BandeMasquee";
import VoluteServices from "@/components/ui/VoluteServices";

/*
 * « Le plein de services » : bande turquoise masquée traversée par la volute
 * propre à la section, titre blanc à mot corail sur la moitié gauche, puis
 * carrousel centré de cartes services (illustration grise, chevron, pastille
 * d'icône colorée qui chevauche, titre). Les flèches rondes font défiler la
 * piste, la flèche gauche n'apparaît qu'une fois la piste entamée, comme en
 * production. Sur mobile la bande devient un dégradé vertical et les cartes
 * s'empilent.
 */

type Carte = { title: string; image: string; icon: string; iconBg: string };

/* Largeur d'une diapositive (carte + gouttière), reprise du site. */
const LARGEUR_DIAPO = 216;

function CarteService({ carte }: { carte: Carte }) {
  return (
    <div className="group relative min-h-full w-full max-w-md cursor-pointer overflow-hidden rounded-2xl bg-white pb-2 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl max-sm:mx-auto max-sm:min-h-[10.5em] max-sm:max-w-[16rem] max-sm:rounded-xl max-sm:shadow-md">
      <div className="h-28 w-full bg-[#EDEEF1] max-sm:h-20">
        <img
          src={carte.image}
          alt={carte.title}
          title={carte.title}
          className="h-full w-full object-cover grayscale"
        />
        <div role="button" className="absolute right-2 top-2">
          <svg width="38" height="39" viewBox="0 0 38 39" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.4535 6.84416C13.9137 6.38398 14.6598 6.38398 15.12 6.84416L26.9039 18.628C27.3641 19.0882 27.3641 19.8343 26.9039 20.2945L15.12 32.0784C14.6598 32.5386 13.9137 32.5386 13.4535 32.0784C12.9934 31.6182 12.9934 30.8721 13.4535 30.4119L24.4041 19.4613L13.4535 8.51065C12.9934 8.05047 12.9934 7.30435 13.4535 6.84416Z"
              fill="#B3BBC6"
            />
          </svg>
        </div>
      </div>
      <div className="relative z-10 -mt-6 mb-2 ml-3 flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full max-sm:h-9 max-sm:w-9"
          style={{ backgroundColor: carte.iconBg }}
        >
          <img src={carte.icon} alt="" className="h-9 w-9 max-sm:h-7 max-sm:w-7" aria-hidden />
        </div>
      </div>
      <h3 className="ml-3 mr-[1rem] max-w-[190px] text-[18.85px] font-bold max-lg:text-base max-sm:!text-[25.04px] max-sm:!leading-[40.07px] max-xs:!text-[18.85px] max-xs:!leading-[30.17px]">
        {carte.title}
      </h3>
    </div>
  );
}

export default function Services() {
  const t = useTranslations("landing.services");
  const cartes = t.raw("cards") as Carte[];
  const piste = useRef<HTMLDivElement>(null);
  const [debut, setDebut] = useState(true);

  const defiler = (sens: 1 | -1) => {
    piste.current?.scrollBy({ left: sens * LARGEUR_DIAPO, behavior: "smooth" });
  };

  return (
    <section className="section relative overflow-hidden max-sm:bg-grey-light max-sm:!py-8" id="services">
      <BandeMasquee
        varianteMasque="secondaire-services"
        className="max-sm:min-h-0 max-sm:rounded-2xl"
        volute={
          <VoluteServices className="masker-layer pointer-events-none absolute inset-0 z-[5] max-md:-translate-y-64" />
        }
      >
        <div className="min-h-[44rem] w-full max-md:min-h-[16rem] max-sm:min-h-0">
          <div className="relative z-30">
            <div className="relative z-20 flex w-full flex-col gap-4">
              <div className="text-white max-md:px-4 md:w-6/12">
                <h2 className="mt-3 font-outfit text-3xl font-bold leading-tight max-sm:mx-auto max-sm:text-2xl max-sm:!text-[31.88px] max-sm:!leading-[42.5px] max-xs:!text-[24px] max-xs:!leading-[32px] md:ml-8 md:text-6xl">
                  {t("title1")}{" "}
                  <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                    {t("title2")}
                  </span>
                </h2>
                <div className="mr-[3rem] mt-[1.75rem] max-w-xl text-sm font-medium !leading-[22px] text-white max-sm:mr-[-1rem] max-sm:!text-[18.59px] max-sm:!leading-[29.22px] max-xs:!text-[14px] max-xs:!leading-[22px] sm:ml-8 sm:mt-5">
                  {t("subtitle")}
                </div>
              </div>
              {/* Piste du carrousel, centrée, flèches rondes de part et d'autre. */}
              <div className="relative mt-24 w-full max-sm:mb-9 max-sm:mt-4">
                <button
                  type="button"
                  aria-label="Précédent"
                  onClick={() => defiler(-1)}
                  className={`absolute left-9 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-dark shadow-md transition hover:shadow-lg ${debut ? "" : "sm:grid"}`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 320 512" fill="currentColor" aria-hidden>
                    <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Suivant"
                  onClick={() => defiler(1)}
                  className="absolute right-9 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white text-dark shadow-md transition hover:shadow-lg sm:grid"
                >
                  <svg className="h-4 w-4" viewBox="0 0 320 512" fill="currentColor" aria-hidden>
                    <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                  </svg>
                </button>
                <div className="mx-auto w-full max-w-4xl px-4 md:px-14">
                  <div
                    ref={piste}
                    onScroll={(e) => setDebut(e.currentTarget.scrollLeft < 8)}
                    className="flex snap-x overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] max-sm:flex-col max-sm:gap-3 [&::-webkit-scrollbar]:hidden"
                  >
                    {cartes.map((carte) => (
                      <div key={carte.title} className="shrink-0 snap-start px-2 max-sm:w-full max-sm:px-0 max-sm:py-1 sm:w-[216px]">
                        <CarteService carte={carte} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BandeMasquee>
    </section>
  );
}
