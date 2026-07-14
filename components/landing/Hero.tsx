import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Swirl from "@/components/ui/Swirl";

/*
 * Héro de la page d'accueil.
 * Fond : dégradé Treepi masqué par la forme organique signature.
 * À droite : l'animation téléphone du site d'origine (WebP animé).
 */

export default function Hero() {
  const t = useTranslations("landing.hero");
  return (
    <section className="px-4 pt-4 sm:px-6">
      <div className="mask-treepi relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
        <Swirl />
        <div className="relative z-10 grid items-center gap-10 px-6 py-14 sm:px-12 md:grid-cols-[1.1fr_0.9fr] md:py-20 lg:px-16">
          <div className="text-white">
            <h1 className="font-outfit text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.4rem]">
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
              {t("title2")}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90">
              {t.rich("subtitle", { b: (chunks) => <b>{chunks}</b> })}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" size="lg" href="/compte-euro">
                {t("ctaPrimary")}
              </Button>
              <Button variant="white" size="lg" href="/assurance-voyage">
                {t("ctaSecondary")}
              </Button>
            </div>
          </div>
          {/* Animation du téléphone reprise du site d'origine (WebP animé). */}
          <div className="mx-auto w-full max-w-[420px] md:-my-6">
            <img
              src="/images/hero-crop.webp"
              alt="L'application Treepi"
              loading="eager"
              className="h-auto w-full drop-shadow-[0_30px_60px_rgba(11,24,52,0.35)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
