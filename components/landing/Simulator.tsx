import { useTranslations } from "next-intl";

/*
 * Section « Paiement simplifié » : présentation façon photo produit.
 * Une carte bancaire inclinée occupe le centre, entourée de légendes
 * bi-ton (bordure turquoise, texte en dégradé) reprenant notre copie
 * du simulateur. Composant serveur : aucune interactivité.
 * Mobile : la carte se réduit et les légendes s'empilent (zéro débordement).
 */

export default function Simulator() {
  const t = useTranslations("landing.simulator");

  // Cadre d'une légende façon « bulle » du live : fond blanc, grosse
  // bordure turquoise, ombre portée et texte balayé en dégradé.
  const bulle =
    "relative w-full max-w-[320px] rounded-2xl border-[3px] border-primary bg-white p-4 shadow-2xl lg:absolute lg:max-w-[360px]";
  const bulleTexte =
    "bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text font-outfit text-base font-bold leading-snug text-transparent sm:text-lg";

  return (
    <section id="simulator" className="overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Titre bi-ton centré */}
        <h2 className="mx-auto max-w-2xl text-center font-outfit text-3xl font-bold sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
            {t("title")}
          </span>
        </h2>

        {/* Chapô descriptif */}
        <p className="mx-auto mt-6 max-w-[44rem] text-center text-sm font-medium leading-relaxed text-grey sm:text-base">
          {t("subtitle")}
        </p>

        {/* Composition : carte inclinée + légendes autour */}
        <div className="relative mx-auto mt-12 flex max-w-[760px] flex-col items-center gap-6 sm:mt-16 lg:mt-24 lg:min-h-[640px] lg:gap-0">
          {/* Légende 1 : haut gauche */}
          <figure className={`${bulle} lg:left-0 lg:top-4`}>
            <div className="flex items-start gap-3">
              <img
                src="/images/icons/creditCard.svg"
                alt=""
                aria-hidden
                className="mt-0.5 h-6 w-6 shrink-0"
              />
              <figcaption className={bulleTexte}>{t("resultLabel")}</figcaption>
            </div>
          </figure>

          {/* Visuel de la carte, légèrement inclinée */}
          <img
            src="/images/card.webp"
            alt="Carte internationale Treepi"
            loading="lazy"
            className="w-[78%] max-w-[430px] rotate-[-8deg] object-contain drop-shadow-[0_30px_60px_rgba(5,160,199,0.25)] sm:w-[70%] lg:w-full lg:max-w-[540px] lg:rotate-[-10deg]"
          />

          {/* Légende 2 : bas droite */}
          <figure className={`${bulle} lg:bottom-8 lg:right-0`}>
            <div className="flex items-start gap-3">
              <img
                src="/images/globe.svg"
                alt=""
                aria-hidden
                className="mt-0.5 h-6 w-6 shrink-0"
              />
              <figcaption className={bulleTexte}>{t("cta")}</figcaption>
            </div>
          </figure>
        </div>

        {/* Mention légale en petits caractères */}
        <p className="mx-auto mt-12 max-w-[46rem] text-center text-[11px] leading-relaxed text-grey/70 sm:mt-16">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
