import { useTranslations } from "next-intl";
import { gras } from "@/components/landing/texte";

/*
 * « Des solutions qui changent vraiment les choses » : trois cartes packages
 * à bordure dégradée (turquoise, corail au centre, turquoise), halo radial
 * orange en fond, listes cochées. La carte centrale porte le CTA plein,
 * les latérales un CTA contour, comme sur le site en production.
 */

type Pack = { title: string; description: string; items: string[] };

function Coche() {
  return (
    <figure className="mr-2 h-6 w-6 shrink-0">
      <img src="/images/check.svg" alt="decoration" title="decoration" />
    </figure>
  );
}

export default function Solutions() {
  const t = useTranslations("landing.solutions");
  const packs = t.raw("packages") as Pack[];
  const [basic, zen, serenity] = packs;

  // Styles propres à chaque colonne (reprise des classes du site d'origine).
  const rendPack = (pack: Pack, variante: "basic" | "zen" | "serenity") => {
    const externes = {
      basic: "package__basic lg:mt-16 py-4 lg:py-0 px-4",
      zen: "package__zen mt-2 py-4 lg:py-6 px-4 self-start",
      serenity: "package__serenity sm:mt-12 lg:mt-16 py-4 lg:py-0 px-4",
    }[variante];

    return (
      <div
        className={`package w-full bg-transparent transition-transform duration-300 hover:-translate-y-1 max-sm:!mx-4 sm:w-1/2 lg:w-[27%] ${externes}`}
      >
        <div className="pb-5 text-left md:px-2">
          {/* Les retours à la ligne des messages ne s'appliquent qu'aux paliers
              où le site en production affiche ses <br> conditionnels. */}
          <h4 className="mt-2 font-outfit text-3xl font-bold max-sm:text-[31.88px] max-sm:!leading-[42.5px] max-xs:text-2xl max-xs:!leading-[32px] lg:whitespace-pre-line">
            {pack.title}
          </h4>
          <div className="mt-2 text-xs max-sm:text-[13.28px] max-sm:!leading-[21.25px] max-xs:text-[10px] max-xs:!leading-[16px] sm:whitespace-pre-line">
            {gras(pack.description)}
          </div>
          {/* CTA : plein pour la carte centrale, contour pour les latérales. */}
          <a
            href="#travel"
            className={`mt-5 block w-full rounded-xl py-3 text-center text-base font-bold max-sm:!text-[14.17px] max-xs:!text-[10.62px] transition-opacity hover:opacity-90 ${
              variante === "zen"
                ? "bg-gradient-to-r from-secondary to-secondary-light text-white"
                : "border border-primary bg-white text-dark transition-colors hover:bg-primary/5"
            }`}
          >
            {t("cta")}
          </a>
          <ul className="mt-8 flex flex-col gap-8 text-sm font-medium">
            {pack.items.map((item) => (
              <li
                key={item}
                className="flex items-start !leading-[22px] max-sm:!text-[18.59px] max-sm:!leading-[29.22px] max-xs:!text-[14px] max-xs:!leading-[22px] lg:whitespace-pre-line"
              >
                <Coche />
                <span className="lg:whitespace-pre-line">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-grey-light md:pb-8" id="solution">
      <section className="section max-sm:!pb-8">
        <h2 className="mx-auto max-w-md content-center justify-center text-center font-outfit text-2xl font-bold max-sm:!text-[31.88px] max-sm:!leading-[42.5px] max-xs:!text-[24px] max-xs:!leading-[32px] sm:pb-6 xl:text-3xl [&>span]:bg-gradient-to-r [&>span]:bg-clip-text [&>span]:text-transparent">
          <span className="from-primary to-primary-light">{t("part1")}</span>{" "}
          <span className="from-secondary to-secondary-light">{t("part2")}</span>{" "}
          <span className="from-primary-light via-primary to-primary-light">{t("part3")}</span>
        </h2>
        <div className="mt-4">
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-center max-sm:mx-[-0.2rem] md:mb-6 md:mt-4">
            {rendPack(basic, "basic")}
            {rendPack(zen, "zen")}
            {rendPack(serenity, "serenity")}
          </div>
        </div>
      </section>
    </div>
  );
}
