import { useTranslations } from "next-intl";
import EmailCapture from "@/components/ui/EmailCapture";

/* Coche « fa-check » du site d'origine (Font Awesome), en SVG inline. */
function Coche() {
  return (
    <svg className="h-5 w-5 shrink-0 text-primary" viewBox="0 0 448 512" aria-hidden fill="currentColor">
      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
    </svg>
  );
}

/*
 * Bandeau de confiance sous le héro : deux arguments cochés en dégradé
 * turquoise puis la barre de capture email, comme sur le site en production.
 */
export default function TrustBar() {
  const t = useTranslations("landing.trust");

  return (
    <section className="section flex flex-col items-center max-sm:bg-grey-light max-sm:!py-[54px]">
      <div className="w-full max-w-[950px] justify-center gap-7 max-md:gap-11 max-sm:contents sm:flex md:mb-4">
        {[t("check1"), t("check2")].map((texte) => (
          <div
            key={texte}
            className="flex shrink items-center gap-3 max-md:gap-1 max-sm:justify-center max-sm:pb-3"
          >
            <Coche />
            <h4 className="whitespace-nowrap bg-gradient-to-r from-primary to-primary-light bg-clip-text font-sans text-xl font-semibold !leading-normal text-transparent max-sm:text-[17.87px] max-xs:text-[13.46px]">
              {texte}
            </h4>
          </div>
        ))}
      </div>
      <div className="mx-auto w-full max-w-5xl">
        <EmailCapture placeholder={t("placeholder")} />
      </div>
    </section>
  );
}
