import { useTranslations } from "next-intl";

/*
 * Titre « Enfin un compte qui répond aux problèmes des voyageurs africains »
 * sur fond gris clair, mot « compte » en dégradé corail, plus le sous-titre.
 * Reproduction du site en production.
 */
export default function Problem() {
  const t = useTranslations("landing.problem");

  return (
    <div className="bg-grey-light">
      <section className="section max-sm:!pt-[30px]">
        <h2 className="mx-auto max-w-3xl content-center justify-center pb-6 text-center font-outfit text-2xl font-bold max-sm:max-w-[24.5rem] max-sm:!pb-8 max-sm:text-[31.88px] max-sm:!leading-[42.5px] max-xs:!max-w-[18.5rem] max-xs:text-[24px] max-xs:!leading-[32px] lg:text-5xl xl:max-w-6xl xl:text-6xl [&>span]:bg-gradient-to-r [&>span]:bg-clip-text [&>span]:text-transparent">
          <span className="from-primary to-primary-light">{t("part1")}</span>{" "}
          <span className="from-secondary to-secondary-light">{t("part2")}</span>{" "}
          <span className="from-primary-light via-primary to-primary-light">{t("part3")}</span>
        </h2>
        <div className="mx-auto max-w-2xl text-center text-sm font-medium !leading-[22px] text-grey max-sm:text-[18.59px] max-sm:!leading-[29.22px] max-xs:text-[14px] max-xs:!leading-[22px]">
          {t("subtitle")}
        </div>
      </section>
    </div>
  );
}
