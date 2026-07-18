import { useTranslations } from "next-intl";
import BandeMasquee from "@/components/landing/BandeMasquee";
import RotatingWords from "@/components/ui/RotatingWords";

/*
 * Héro de la home : grande carte au dégradé signature découpée par la forme
 * organique, volute « e » en filigrane. Titre « Le compte Euro des voyageurs »
 * suivi du mot tournant en dégradé corail, sous-titre, badges des stores et
 * mockup du téléphone qui déborde à droite. Identique au site en production.
 */
export default function Hero() {
  const t = useTranslations("landing.hero");
  const mots = t.raw("words") as string[];

  return (
    <div className="max-md:pt-4">
      <section className="section !py-14 max-sm:!py-0">
        <BandeMasquee>
          <div className="relative z-20 flex w-full flex-col items-center max-md:overflow-hidden md:flex-row md:gap-4 md:pb-16 md:pt-24">
            <div className="relative z-30 text-white max-md:px-4 md:w-8/12 md:pl-12 xl:pl-16">
              <h1 className="ml-2 mt-14 font-outfit !text-[64px] font-bold !leading-[72px] max-sm:mt-[72px] max-sm:text-center max-sm:!text-[45.85px] max-sm:!leading-[51.58px] max-xs:!text-[34.52px] max-xs:!leading-[38.8px]">
                {t("title1")}
                <br />
                <span className="items-center xl:flex">
                  <span className="mr-2 flex-shrink-0">{t("title2")}</span>
                  <RotatingWords
                    words={mots}
                    className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text pb-1 leading-tight text-transparent"
                  />
                </span>
              </h1>
              <div className="ml-2 mt-4 max-w-xl font-medium !leading-[22px] text-white max-sm:mx-auto max-sm:max-w-[327px] max-sm:text-center max-sm:text-[18.59px] max-sm:!leading-[29.22px] max-xs:text-sm max-xs:!leading-[22px] md:font-bold mobile-320">
                {t("subtitle")}
              </div>
              <div className="mt-12 flex flex-row max-sm:mt-4 max-sm:justify-center">
                <img
                  src="/images/appstore.svg"
                  alt="App Store"
                  title="Télécharge sur l'App Store"
                  loading="lazy"
                  className="h-[50px] w-36 cursor-pointer transition-transform duration-300 hover:scale-105 min-[768px]:max-[1000px]:w-32"
                />
                <img
                  src="/images/playstore.svg"
                  alt="Google Play"
                  title="Télécharge sur Google Play"
                  loading="lazy"
                  className="h-[50px] w-36 cursor-pointer transition-transform duration-300 hover:scale-105 min-[768px]:max-[1000px]:w-32"
                />
              </div>
            </div>
            {/* Mockup du téléphone : déborde vers le bas sur mobile. */}
            <div className="flex justify-end max-md:-mb-28 md:w-4/12">
              <div className="mx-auto md:pr-12 lg:ml-auto">
                <img
                  src="/images/hero-crop.webp"
                  alt={t("phoneAlt")}
                  title="Le compte Euro des voyageurs"
                  loading="eager"
                  className="h-auto w-full max-w-[705px] pr-16 max-sm:pt-8 sm:-translate-y-3 sm:pb-8 md:scale-150"
                />
              </div>
            </div>
          </div>
        </BandeMasquee>
      </section>
    </div>
  );
}
