import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Swirl from "@/components/ui/Swirl";

/*
 * Pied de page : reproduction 1:1 du pied de page du site d'origine
 * (treepi.app). Structure identique : conteneur .footer sur fond gris,
 * élément .mask porteur du dégradé découpé par footer-mask.svg (le bord
 * supérieur haut à gauche qui décroche vers un niveau plus bas à droite),
 * volute agrandie, logo blanc + « décolle bientôt ! », paragraphes de
 * pré-lancement, badges stores, filet, bloc protection des données et
 * téléphone animé à droite. Les textes passent par l'i18n (copie d'origine
 * en français).
 */
export default function SiteFooter() {
  const t = useTranslations("common.footer");

  return (
    <div className="footer mx-0 bg-grey-light relative overflow-hidden">
      <div className="relative overflow-hidden rounded-3xl min-h-[600px]">
        <div className="mask absolute inset-0" />
        <Swirl className="w-full masker-layer absolute inset-0 z-[5] pointer-events-none max-md:-translate-y-60 max-md:translate-x-6 max-md:w-[93%]" />
        <div className="mask__header-right" />
        <div className="mask-content relative z-[3]">
          <div className="relative z-20 w-full flex flex-row gap-4 md:items-center md:pb-16 max-sm:pt-4 [@media(min-width:1023px)_and_(max-width:1250px)]:!pb-0">
            {/* Colonne gauche : marque, mentions, badges, données personnelles. */}
            <div className="md:w-8/12 w-1/2 text-white max-md:px-0 pl-10 max-md:pt-8 max-md:ml-4 max-sm:mb-5 footer__treepi">
              <div className="flex gap-4 relative z-10">
                <div className="flex-grow [@media(min-width:1280px)_and_(max-width:1350px)]:mt-14">
                  <div className="ml-14 mb-8 max-sm:ml-4 max-sm:mr-24 flex items-center gap-4 max-sm:flex-col max-sm:gap-x-0 max-sm:gap-y-2">
                    <Link href="/" className="flex justify-center" aria-label="Treepi">
                      <img width="144" height="49" alt="logo" title="logo" className="max-sm:w-24 max-sm:h-8" src="/logo-white.svg" />
                    </Link>
                    <span className="font-outfit font-bold text-[24px] max-sm:text-[10px] min-[654px]:max-[767px]:text-[13px] min-[640px]:max-[653px]:text-[12px] leading-[32px] text-white text-center">
                      {t("takingOff")}
                    </span>
                  </div>
                  <div className="text-white font-medium max-sm:text-[8.79px] text-[14px] leading-[22px] mt-8 pr-4 max-sm:leading-normal w-full max-w-[567px] max-xs:mt-0 max-sm:max-w-full max-sm:px-2 max-sm:ml-0 max-xs:w-[217px] max-sm:w-[273px]">
                    {t("prelaunch")}
                    <div className="mt-8 max-sm:mt-4">{t("purpose")}</div>
                    <div className="mt-8 max-sm:mt-4 max-sm:!w-[15rem]">{t("ipNotice")}</div>
                    <div className="mt-8 max-xs:mt-4 text-xs max-sm:text-[8.79px]">{t("rights")}</div>
                  </div>
                  <div className="flex ml-4 md:ml-6">
                    <div className="flex w-2/3 gap-6 md:gap-11 max-h-fit md:mt-16 mt-2 md:px-1" />
                    <div className="hidden md:flex flex-row -mb-8 -mt-24 ml-72 max-[1110px]:-mt-12 max-[1460px]:-mt-24 max-[1110px]:ml-0 max-[1460px]:ml-[15rem]">
                      <div className="flex flex-row">
                        <img
                          alt="App Store"
                          loading="lazy"
                          className="w-36 h-[50px] min-[768px]:max-[1000px]:w-32 [@media(min-width:1610px)]:w-[17rem] [@media(min-width:1600px)]:h-[79px]"
                          title="Télécharge sur l'App Store"
                          src="/images/appstore.svg"
                        />
                        <img
                          alt="Google Play"
                          loading="lazy"
                          className="w-36 h-[50px] min-[768px]:max-[1000px]:w-32 [@media(min-width:1610px)]:w-[17rem] [@media(min-width:1600px)]:h-[79px]"
                          title="Télécharge sur Google Play"
                          src="/images/playstore.svg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="bg-white h-px w-full md:w-[145%] max-sm:ml-2 relative max-sm:!mt-2 max-sm:!mb-12 max-sm:absolute max-sm:w-[70%]" />
              <div className="mt-8 md:block max-sm:ml-2">
                <div className="font-bold text-[10px] text-white leading-4 mb-1 max-sm:w-48 max-sm:text-[9px]">
                  {t("dataTitle")}
                </div>
                <div className="text-[10px] text-white leading-4 max-sm:w-60 max-sm:text-[8px]">
                  {t("dataBody1")}
                  <br />
                  {t("dataBody2")}{" "}
                  <a href={`mailto:${t("dataEmail")}`} className="underline text-white">
                    {t("dataEmail")}
                  </a>
                </div>
              </div>
            </div>
            {/* Colonne droite : le téléphone animé, rogné par le bas. */}
            <div className="flex md:w-4/12 w-1/2 justify-end">
              <div className="mx-auto lg:ml-auto md:pr-12">
                <img
                  alt="L'application Treepi"
                  className="w-[75%] max-md:w-full max-w-[705px] h-auto md:scale-150 -translate-y-3 xl:pr-8 md:pb-80 xl:pb-56 mt-0 ml-auto mr-[67px] sm:top-48 relative footer__phone [@media(min-width:1023px)_and_(max-width:1250px)]:top-60"
                  title="Le compte Euro des voyageurs"
                  src="/images/hero-crop.webp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
