import { useTranslations } from "next-intl";
import FlagPin from "@/components/landing/FlagPin";

/*
 * « Voyage. Paye. Dépasse tes limites. » : planisphère très pâle en fond,
 * épingle-drapeau qui voyage au-dessus, titre bicolore sur deux lignes et
 * paragraphe d'engagement. Reproduction du site en production.
 */
export default function GlobeSection() {
  const t = useTranslations("landing.globe");

  return (
    <section className="section relative flex w-full items-center justify-center overflow-hidden max-sm:bg-grey-light max-sm:!pt-0">
      <div className="absolute left-1/2 top-1/4 z-10 flex h-full w-full -translate-x-1/2 transform items-start justify-center">
        <img
          src="/images/planete.svg"
          alt={t("planetAlt")}
          title="Voyage. Paye. Dépasse tes limites"
          width={1280}
          height={405}
          className="h-auto w-full min-w-full max-w-[1200px] object-contain md:min-h-[75%]"
        />
      </div>
      {/* L'épingle vit dans un calque au-dessus du titre, aux mêmes classes de
          largeur que l'image et au ratio du SVG : les deux boîtes se
          superposent exactement, les coordonnées en % suivent la carte. */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 z-30 flex h-full w-full -translate-x-1/2 items-start justify-center">
        <div className="relative aspect-[1280/405] h-auto w-full min-w-full max-w-[1200px]">
          <FlagPin />
        </div>
      </div>
      <div className="relative z-20 flex w-full max-w-[1200px] flex-col items-center justify-center sm:px-6 lg:px-8">
        {/* Espace réservé de la bande à épingle du site en production : il
            fixe la hauteur de la section (540px) pour que le planisphère
            tienne en entier et que le titre garde sa place sous l'arc. */}
        <div className="relative h-20 w-full sm:h-24 md:h-32 lg:h-40" aria-hidden />
        <div className="w-full max-sm:pt-16">
          {/* Interligne 72px à partir de xl : hauteur de titre du site en
              production (deux lignes de 72px, section à 540px). */}
          <h2 className="mx-auto mb-8 max-w-xs text-center font-outfit text-2xl font-bold max-sm:!text-[31.88px] max-xs:!text-[24px] max-xs:!leading-[32px] lg:max-w-lg xl:max-w-2xl xl:text-6xl xl:!leading-[72px]">
            <span className="block">
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                {t("line1a")}
              </span>{" "}
              <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                {t("line1b")}
              </span>
            </span>
            <span className="block">
              <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                {t("line2a")}
              </span>
              <span className="ml-2 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                {t("line2b")}
              </span>
            </span>
          </h2>
          <div className="mx-auto text-center !text-[14px] font-medium !leading-[22px] text-grey max-sm:max-w-[378px] max-sm:text-[18.59px] max-sm:!leading-[29.22px] max-xs:!text-[14px] max-xs:!leading-[22px] xl:max-w-4xl">
            {t("subtitle")}
          </div>
        </div>
      </div>
    </section>
  );
}
