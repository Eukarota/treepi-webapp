import { useTranslations } from "next-intl";
import { gras } from "@/components/landing/texte";
import VoluteEtapes from "@/components/landing/VoluteEtapes";

/*
 * « Visa facilité » et les trois étapes 01 / 02 / 03 : grille deux colonnes
 * sur desktop traversée par la grande volute turquoise, qui se retire le
 * long de son tracé au fil du défilement (composant VoluteEtapes), numéros
 * géants corail, titres aux segments dégradés, paragraphes et photos.
 */

type Segment = { t: string; g: "p" | "s" };
type Etape = { num: string; title: Segment[]; body: string; image: string; alt: string; titre: string };

function BlocEtape({ etape, classe }: { etape: Etape; classe?: string }) {
  return (
    <div className={`w-full ${classe ?? ""}`}>
      <h2 className="mb-2 inline-flex bg-gradient-to-r from-secondary to-secondary-light bg-clip-text font-outfit text-5xl font-extrabold text-transparent max-sm:!text-[63.75px] max-sm:!leading-[55.24px] max-xs:!text-[48px] max-xs:!leading-[41.59px] md:text-8xl">
        {etape.num}
      </h2>
      <h3 className="font-outfit !text-[40px] font-bold !leading-[41.6px] max-sm:!text-[31.88px] max-sm:!leading-[42.5px] max-xs:!text-2xl sm:mr-[2rem] md:text-4xl [&>span]:!inline [&>span]:bg-gradient-to-r [&>span]:bg-clip-text [&>span]:text-transparent">
        {etape.title.map((seg, i) => (
          <span
            key={i}
            className={
              seg.g === "s"
                ? "from-secondary to-secondary-light font-extrabold"
                : "from-primary to-primary-light"
            }
          >
            {seg.t}
            {i < etape.title.length - 1 ? " " : ""}
          </span>
        ))}
      </h3>
      <div className="my-5 text-base font-normal !leading-[20.8px] max-md:text-sm max-sm:font-medium max-sm:!text-[18.59px] max-sm:!leading-[29.22px] max-xs:!text-[14px] max-xs:!leading-[22px] sm:mr-[1rem]">
        {gras(etape.body)}
      </div>
      <div className="max-md:mx-2">
        {/* Dimensions déclarées : réserve le ratio avant chargement, sinon la
            grille s'effondre et la volute se cale au mauvais endroit. */}
        <img
          src={etape.image}
          alt={etape.alt}
          title={etape.titre}
          width={528}
          height={330}
          className="my-8 h-[328px] w-full scale-105 rounded-3xl object-cover max-sm:mb-[37px] md:my-4 md:h-auto md:scale-100"
        />
      </div>
    </div>
  );
}

export default function VisaSteps() {
  const t = useTranslations("landing.visa");
  const etapes = t.raw("steps") as Etape[];

  return (
    <section className="section relative !pt-0">
      <div id="facilityVisa" className="relative grid gap-x-4 max-sm:bg-grey-light xl:grid-cols-2 [&>div]:z-10">
        <VoluteEtapes />
        {/* En-tête « Visa facilité ». */}
        <div>
          <div className="mr-auto max-sm:mb-[20px] xl:max-w-[443px]">
            <h2 className="font-outfit text-2xl font-bold max-sm:!text-[31.88px] max-xs:!text-[24px] md:text-6xl">
              <span className="inline bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                {t("title1")}
              </span>{" "}
              <span className="inline bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                {t("title2")}
              </span>
            </h2>
            <div className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-base font-normal !leading-[20.8px] text-transparent max-md:text-sm max-sm:!my-8 max-sm:font-medium max-sm:!text-[18.59px] max-sm:!leading-[29.22px] max-xs:!text-[14px] max-xs:!leading-[22px] md:my-4">
              {gras(t("intro"))}
            </div>
          </div>
        </div>
        {/* Étape 01 à droite, 02 à gauche, 03 à droite (disposition du site). */}
        <div className="mr-auto">
          <BlocEtape etape={etapes[0]} classe="xl:max-w-[528px]" />
        </div>
        <div className="mr-auto">
          <BlocEtape etape={etapes[1]} classe="xl:max-w-[583px] md:mt-24" />
        </div>
        <div className="max-xl:hidden" />
        <div className="max-xl:hidden" />
        <div className="ml-auto xl:translate-x-4">
          <BlocEtape etape={etapes[2]} classe="xl:max-w-[565px]" />
        </div>
      </div>
    </section>
  );
}
