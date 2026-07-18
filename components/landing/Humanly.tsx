import { useTranslations } from "next-intl";

/*
 * « Ce que Treepi change humainement » : deux colonnes avant/après reliées
 * par un grand trait turquoise, chips à bordure dégradée (corail à gauche,
 * turquoise à droite), halos radiaux en fond. Reproduction du site en
 * production.
 */

type Item = { icon: string; lines: string[] };

function ChipImpact({ item, cote }: { item: Item; cote: "avant" | "apres" }) {
  const bordure = cote === "avant" ? "from-secondary to-secondary-light rounded-bl-xl" : "from-primary to-primary-light rounded-br-xl";
  const interne = cote === "avant" ? "rounded-bl-xl" : "rounded-br-xl";
  return (
    <li className={`relative z-20 mb-4 overflow-hidden rounded-t-xl bg-gradient-to-r p-[3px] ${bordure}`}>
      <div className={`flex h-full items-center overflow-hidden rounded-t-xl bg-white px-2 max-sm:py-[0.25rem] md:min-h-8 lg:min-h-16 ${interne}`}>
        <figure className="h-8 w-8 shrink-0 bg-white max-sm:h-5 max-sm:w-5 md:h-5 md:w-5 lg:h-8 lg:w-8">
          <img src={`/images/icons/${item.icon}.svg`} alt={item.lines[0]} title={item.lines[0]} />
        </figure>
        <div className="ml-2 h-full font-bold !leading-[20.8px] max-sm:text-[13.77px] max-sm:!leading-[17.89px] sm:ml-4 md:text-[10px] lg:text-base">
          {item.lines[0]}
          {item.lines[1] ? <div>{item.lines[1]}</div> : null}
        </div>
      </div>
    </li>
  );
}

export default function Humanly() {
  const t = useTranslations("landing.humanly");
  const avant = t.raw("before") as Item[];
  const apres = t.raw("after") as Item[];

  return (
    <div className="impact bg-grey-light py-20 max-sm:pb-0">
      <h2 className="mx-auto max-w-xs text-center font-outfit text-2xl font-bold max-sm:!text-[31.88px] max-sm:!leading-[42.5px] max-xs:!text-[24px] max-xs:!leading-[32px] lg:max-w-lg lg:text-5xl xl:max-w-2xl xl:text-6xl [&>*]:bg-gradient-to-r [&>*]:bg-clip-text [&>*]:text-transparent">
        <span className="from-primary to-primary-light">{t("title1")}</span>
        <span className="block from-secondary to-secondary-light">{t("title2")}</span>
      </h2>
      <div className="relative mt-8 pb-20 max-sm:pb-0">
        {/* Trait continu qui relie les deux colonnes (desktop). */}
        <div className="z-10 w-full pt-20 max-md:hidden md:absolute md:h-[calc(100%-100px)] lg:h-[calc(100%-88px)]">
          <figure>
            <svg className="h-full w-full md:absolute" width="100%" height="100%" viewBox="0 0 1280 515" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path
                d="M-39 490.203C14.3333 452.87 72 410.203 259 402.203C446 394.203 638.5 490.203 849.5 451.203C1060.5 412.203 1250.5 243.203 1319 9.20312"
                stroke="url(#impact_trait_grad)"
                strokeWidth="59"
              />
              <defs>
                <linearGradient id="impact_trait_grad" x1="-39" y1="249.703" x2="1319" y2="249.703" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#05A0C7" />
                  <stop offset="1" stopColor="#09D1C7" />
                </linearGradient>
              </defs>
            </svg>
          </figure>
        </div>
        <div className="mx-auto flex justify-center max-md:flex-col md:container">
          {/* Colonne « Avant Treepi ». */}
          <div className="relative order-1 items-end bg-cover bg-no-repeat max-lg:px-3 max-sm:px-[15px] md:-mr-0.5">
            <div className="absolute inset-0 md:translate-y-6">
              <div className="relative flex h-full w-full flex-row overflow-hidden rounded-l-full">
                <div className="impact__radial-primary w-1/2 flex-1 max-md:mt-4" />
              </div>
            </div>
            <div className="text-center font-bold max-sm:!text-[20.65px] max-sm:!leading-[27.54px] lg:text-2xl [&>*]:bg-gradient-to-r [&>*]:bg-clip-text [&>*]:text-transparent">
              <span className="from-secondary to-secondary-light">{t("beforeLabel")}</span>{" "}
              <span className="from-primary to-primary-light">{t("brand")}</span>
            </div>
            <ul className="mt-10 flex flex-col items-end pb-16 max-sm:!text-[13.77px] max-sm:!leading-[17.89px] lg:mt-20 lg:pr-5">
              {avant.map((item) => (
                <ChipImpact key={item.icon} item={item} cote="avant" />
              ))}
            </ul>
          </div>
          {/* Colonne « Après Treepi ». */}
          <div className="relative order-3 items-start bg-cover bg-no-repeat max-lg:px-3 max-sm:px-[15px]">
            <div className="absolute inset-0 md:translate-y-6">
              <div className="relative flex h-full w-full flex-row overflow-hidden rounded-r-full">
                <div className="impact__radial-secondary w-1/2 flex-1" />
              </div>
            </div>
            <div className="text-center font-bold max-sm:!text-[20.65px] max-sm:!leading-[27.54px] lg:text-2xl [&>*]:bg-gradient-to-r [&>*]:bg-clip-text [&>*]:text-transparent">
              <span className="from-secondary to-secondary-light">{t("afterLabel")}</span>{" "}
              <span className="from-primary to-primary-light">{t("brand")}</span>
            </div>
            <ul className="mt-10 flex flex-col items-start pb-16 max-sm:!text-[13.77px] max-sm:!leading-[17.89px] lg:mt-20 lg:pl-5">
              {apres.map((item) => (
                <ChipImpact key={item.icon} item={item} cote="apres" />
              ))}
            </ul>
          </div>
          {/* Trait de liaison version mobile. */}
          <figure className="relative order-2 -mt-16 mb-3 h-28 bg-transparent md:hidden">
            <svg viewBox="0 0 320 130" preserveAspectRatio="none" className="absolute z-40 h-full w-full bg-transparent" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M-13.0908 29.9996C106.71 21.9997 197.732 131 332.909 92" stroke="url(#impact_trait_mobile_grad)" strokeWidth="59" />
              <defs>
                <linearGradient id="impact_trait_mobile_grad" x1="-13.0908" y1="65.0173" x2="332.909" y2="65.0173" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#05A0C7" />
                  <stop offset="1" stopColor="#09D1C7" />
                </linearGradient>
              </defs>
            </svg>
          </figure>
        </div>
      </div>
    </div>
  );
}
