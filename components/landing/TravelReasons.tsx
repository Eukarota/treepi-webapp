import { useTranslations } from "next-intl";
import EmailCapture from "@/components/ui/EmailCapture";
import CounterUp from "@/components/ui/CounterUp";

/*
 * « Je voyage pour ... » : titre dont la seconde ligne défile parmi six
 * motifs de voyage (animation text-slide du site d'origine), barre de capture
 * email, puis preuve sociale : avatars des Treepers et compteur « + de 980 ».
 */

const TOURISTES = [
  "/images/tourist_01.webp",
  "/images/tourist_02.webp",
  "/images/tourist_03.webp",
  "/images/tourist_04.webp",
];

export default function TravelReasons() {
  const t = useTranslations("landing.travel");
  const raisons = t.raw("reasons") as string[];

  return (
    <div className="bg-grey-light" id="travel">
      <section className="section max-sm:!pb-[67px] max-sm:!pt-[17px]">
        <h2 className="mx-auto mb-8 text-center font-outfit text-2xl font-bold max-sm:mb-7 max-sm:text-[41.11px] max-sm:leading-[44px] max-xs:text-[30.95px] lg:text-5xl xl:text-6xl [&>span]:bg-gradient-to-r [&>span]:bg-clip-text [&>span]:text-transparent">
          <span className="from-primary to-primary-light">{t("title")}</span>
          <br />
          <span className="inline-flex h-[2.5rem] flex-col overflow-hidden from-secondary to-secondary-light lg:h-[4rem] xl:h-[4.3rem]">
            <ul className="block animate-text-slide pb-1 pt-1 text-center leading-none [&_li]:block [&_li]:whitespace-nowrap [&_li]:bg-gradient-to-r [&_li]:from-secondary [&_li]:to-secondary-light [&_li]:bg-clip-text [&_li]:py-1 [&_li]:leading-none [&_li]:text-transparent">
              {raisons.map((raison) => (
                <li key={raison}>{raison}</li>
              ))}
            </ul>
          </span>
        </h2>
        <div className="mx-auto w-full max-w-6xl">
          <EmailCapture placeholder={t("placeholder")} />
        </div>
        {/* Preuve sociale : avatars + compteur animé. */}
        <div className="flex items-center justify-center gap-x-8 pt-8 max-sm:pt-7">
          <div className="flex -space-x-2">
            {TOURISTES.map((src) => (
              <div key={src} className="relative inline-block rounded-full bg-gradient-to-r from-primary to-primary-light p-[0.5px]">
                <div className="rounded-full bg-white">
                  <img
                    src={src}
                    alt={t("touristAlt")}
                    title={t("touristAlt")}
                    className="min-h-16 min-w-16 flex-none rounded-full object-cover max-md:min-h-10 max-md:min-w-10"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex h-24 w-64 flex-col items-start justify-center max-sm:ml-[-1rem]">
            <h5 className="font-outfit text-3xl font-bold max-md:text-xl [&>span]:bg-gradient-to-r [&>span]:bg-clip-text [&>span]:text-transparent">
              <span className="from-primary to-primary-light">{t("counterPrefix")}</span>{" "}
              <span className="from-secondary to-secondary-light">
                <CounterUp value={Number(t.raw("counterValue"))} />
              </span>
            </h5>
            <div className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-md font-medium !leading-[22px] text-transparent max-md:text-sm max-sm:!leading-[29.22px]">
              {t("counterLine")}
            </div>
            <h5 className="font-outfit text-3xl font-bold max-md:text-xl [&>span]:bg-gradient-to-r [&>span]:bg-clip-text [&>span]:text-transparent">
              <span className="from-primary to-primary-light">{t("counterQ1")}</span>{" "}
              <span className="from-secondary to-secondary-light">{t("counterQ2")}</span>{" "}
              <span className="from-primary to-primary-light">{t("counterQ3")}</span>
            </h5>
          </div>
        </div>
      </section>
    </div>
  );
}
