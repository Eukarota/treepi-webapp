import { useTranslations } from "next-intl";

/*
 * « Paiement simplifié » : la grande carte Treepi inclinée au centre, trois
 * bulles d'arguments bordées de turquoise et trois pastilles photo rondes
 * cerclées de corail, positionnées en absolu autour de la carte (classes
 * secure__* de globals.css, reprises du site en production).
 */

type Bulle = { pre: string; hl: string; post: string };

function BulleArgument({ bulle, classe }: { bulle: Bulle; classe: string }) {
  return (
    <div
      className={`${classe} relative max-w-[250px] text-wrap rounded-xl border-2 border-primary bg-white p-2 !leading-[32px] shadow-2xl max-sm:!leading-[21.1px] lg:absolute lg:max-w-[410px] [&>span]:bg-gradient-to-r [&>span]:bg-clip-text [&>span]:text-transparent`}
    >
      <span className="from-primary to-primary">{bulle.pre}</span>{" "}
      <span className="from-secondary to-secondary-light">{bulle.hl}</span>{" "}
      <span className="from-primary to-primary-light">{bulle.post}</span>
    </div>
  );
}

export default function SecurePayment() {
  const t = useTranslations("landing.secure");
  const bulles = t.raw("bubbles") as Bulle[];

  return (
    <div className="secure__payment">
      <section className="section">
        <h2 className="mx-auto max-w-xs text-center font-outfit text-2xl font-bold max-sm:!text-[31.88px] max-xs:!text-[24px] lg:max-w-lg lg:text-5xl xl:max-w-2xl xl:text-6xl [&>*]:bg-gradient-to-r [&>*]:bg-clip-text [&>*]:text-transparent">
          <span className="from-primary to-primary-light">{t("title1")}</span>{" "}
          <span className="from-secondary to-secondary-light">{t("title2")}</span>
        </h2>
        <div className="mx-auto max-w-[44rem] py-[2rem] text-center text-sm font-medium !leading-[22px] text-grey max-md:py-8 max-sm:!mb-[-1rem] max-sm:!pb-0 max-sm:pt-6 max-sm:!text-[18.59px] max-sm:!leading-[29.22px] max-xs:!text-[14px] max-xs:!leading-[22px] sm:py-6">
          <span className="hidden sm:inline">{t("subtitleDesktop")}</span>
          <span className="inline sm:hidden">{t("subtitleMobile")}</span>
        </div>
        <div className="treepi-card relative mx-auto flex h-auto w-full flex-col p-2 font-outfit text-sm font-bold max-sm:-mt-[3rem] md:text-2xl lg:h-[800px] lg:max-w-[754px]">
          {/* Grande carte inclinée. */}
          <img
            src="/images/card.webp"
            alt="card"
            title={t("cardAlt")}
            width={756}
            height={795}
            className="secure__card absolute inset-0 w-full translate-y-[10%] scale-110 rounded-2xl object-contain lg:translate-y-0 lg:scale-100"
          />
          {/* Bulles et pastilles photo, en absolu sur desktop. */}
          <BulleArgument bulle={bulles[0]} classe="secure__comment_1 translate-x-3 scale-110 lg:translate-x-0 lg:scale-100" />
          <div className="secure__image_1 relative ml-auto scale-110 bg-[url('/images/pay.webp')] bg-cover lg:absolute lg:scale-100" />
          <BulleArgument bulle={bulles[1]} classe="secure__comment_2 ml-auto translate-x-5 scale-110 lg:translate-x-0 lg:scale-100" />
          <div className="secure__image_2 relative scale-110 bg-[url('/images/gui.webp')] bg-cover lg:absolute lg:scale-100" />
          <BulleArgument bulle={bulles[2]} classe="secure__comment_3 ml-auto scale-110 lg:scale-100" />
          <div className="secure__image_3 relative ml-auto scale-110 bg-[url('/images/electro.webp')] bg-cover lg:absolute lg:scale-100" />
        </div>
      </section>
    </div>
  );
}
