import { useTranslations } from "next-intl";
import BandeMasquee from "@/components/landing/BandeMasquee";

/*
 * Vitrine de l'app (id « advantages ») : grande bande turquoise découpée par
 * le masque secondaire, sur laquelle défilent verticalement deux colonnes
 * d'écrans du walkthrough (marquee inversé, en pause au survol). Les écrans
 * sont des exports SVG complets (cadre du téléphone inclus) : petite capture
 * aux 2/3 de la largeur de colonne, grande capture pleine largeur, comme en
 * production.
 */

const COLONNES: { src: string; nom: string; large: boolean; idx: number }[][] = [
  [
    { src: "/images/advantages/join_us.svg", nom: "join_us", large: false, idx: 0 },
    { src: "/images/advantages/all_in_one.svg", nom: "all_in_one", large: true, idx: 1 },
  ],
  [
    { src: "/images/advantages/simplicity.svg", nom: "simplicity", large: true, idx: 2 },
    { src: "/images/advantages/experience.svg", nom: "experience", large: false, idx: 3 },
  ],
];

/* Nombre de copies du couple d'écrans par colonne : la boucle du marquee
   reste sans couture quelle que soit la hauteur de la bande. */
const COPIES = 4;

export default function AppShowcase() {
  const t = useTranslations("landing.showcase");
  const legendes = t.raw("items") as string[];

  return (
    <section className="section relative overflow-hidden max-sm:bg-grey-light" id="advantages">
      <BandeMasquee
        varianteMasque="secondaire"
        swirlClassName="masker-layer pointer-events-none absolute inset-0 z-[5] w-full scale-[1.2] max-md:w-[93%] max-md:-translate-y-60 max-md:translate-x-6"
      >
        <div className="min-h-[44rem] w-full max-md:min-h-[16rem]" />
        <div className="absolute inset-0 z-30">
          <div className="mx-auto flex w-1/2 flex-row items-center gap-4 max-sm:w-3/4">
            {COLONNES.map((colonne, c) => (
              <div key={c}>
                <div className="group flex flex-col overflow-hidden p-2 [--duration:20s] [--gap:1rem] [gap:var(--gap)]">
                  {Array.from({ length: COPIES }).map((_, copie) => (
                    <div
                      key={copie}
                      className="flex shrink-0 animate-marquee-vertical flex-col justify-around [animation-direction:reverse] [gap:var(--gap)] group-hover:[animation-play-state:paused]"
                    >
                      {colonne.map((ecran) => (
                        <div key={ecran.nom}>
                          <img
                            src={ecran.src}
                            alt={ecran.nom}
                            title={legendes[ecran.idx]}
                            className={ecran.large ? "" : "w-2/3"}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </BandeMasquee>
    </section>
  );
}
