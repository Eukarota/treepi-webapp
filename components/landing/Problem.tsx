import { useTranslations } from "next-intl";

/*
 * Section « Le vrai problème » : grande statistique 6/10 à gauche,
 * argumentaire à droite.
 */
export default function Problem() {
  const t = useTranslations("landing.problem");
  return (
    <section className="bg-grey-light">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-[0.8fr_1.2fr]">
        {/* Statistique */}
        <div>
          <div className="font-outfit font-bold leading-none">
            <span className="text-[7rem] text-navy sm:text-[9rem]">{t("statNumber")}</span>
            <span className="text-gradient-secondary text-[3.5rem] sm:text-[4.5rem]">{t("statDenominator")}</span>
          </div>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-grey">{t("statCaption")}</p>
        </div>
        {/* Argumentaire */}
        <div>
          <div className="mb-4"><span className="section-eyebrow">{t("eyebrow")}</span></div>
          <h2 className="font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl">
            {t("title1")}
            <span className="text-gradient-secondary">{t("titleHighlight")}</span>
          </h2>
          <p
            className="mt-5 text-base leading-relaxed text-navy/80 [&>b]:font-bold [&>b]:text-navy"
            dangerouslySetInnerHTML={{ __html: t.raw("body") }}
          />
        </div>
      </div>
    </section>
  );
}
