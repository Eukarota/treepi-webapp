import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/pages/PageHero";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";

/*
 * Page « Assurance recours visa », maquette `wireframe/assurance-recours.png`.
 * Sections : héro + pastille 15 000 €, pourquoi elle existe, situations
 * couvertes, filet de sécurité, parcours en 5 étapes, FAQ, CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "assuranceRecours.meta" });
  return { title: t("title"), description: t("description") };
}

function Content() {
  const t = useTranslations("assuranceRecours");
  const coveredCards = t.raw("covered.cards") as { title: string; description: string }[];
  const valueCards = t.raw("value.cards") as { emoji: string; title: string; description: string }[];
  const steps = t.raw("journey.steps") as { title: string; description: string }[];

  return (
    <>
      <PageHero
        breadcrumb={t("breadcrumb")}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.title1")}
            <span className="text-gradient-secondary">{t("hero.titleHighlight")}</span>
          </>
        }
        subtitle={t("hero.subtitle")}
        actions={
          <Button variant="primary" size="lg" href="/tarifs">
            {t("hero.cta")}
          </Button>
        }
        aside={
          <div className="mx-auto grid h-52 w-52 place-content-center rounded-full bg-white/15 text-center backdrop-blur sm:h-64 sm:w-64">
            <div className="font-outfit text-4xl font-bold text-white sm:text-5xl">{t("hero.statValue")}</div>
            <div className="mt-1 text-sm text-white/85">{t("hero.statLabel")}</div>
          </div>
        }
      />

      {/* Pourquoi elle existe */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <span className="section-eyebrow">{t("why.eyebrow")}</span>
          <h2 className="mt-3 font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl">
            {t("why.title1")}
            <span className="text-gradient-secondary">{t("why.titleHighlight")}</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-grey sm:text-base">{t("why.subtitle")}</p>
        </div>
      </section>

      {/* Situations couvertes */}
      <section className="bg-grey-light">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("covered.eyebrow")}
            title={
              <>
                {t("covered.title1")}
                <span className="text-gradient-secondary">{t("covered.titleHighlight")}</span>
              </>
            }
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {coveredCards.map((card, i) => (
              <div key={card.title} className="card-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-lg" aria-hidden>
                  {["📄", "⚖️", "👨‍⚖️"][i]}
                </span>
                <h3 className="mt-4 font-outfit text-base font-bold text-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-grey">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filet de sécurité */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("value.eyebrow")}
            title={
              <>
                {t("value.title1")}
                <span className="text-gradient-secondary">{t("value.titleHighlight")}</span>
              </>
            }
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {valueCards.map((card) => (
              <div key={card.title} className="rounded-2xl bg-primary-lighter/40 p-8 text-center">
                <div className="text-2xl" aria-hidden>{card.emoji}</div>
                <div className="mt-2 font-outfit text-2xl font-bold text-navy">{card.title}</div>
                <p className="mt-1.5 text-sm text-grey">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parcours en 5 étapes */}
      <section className="bg-grey-light">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("journey.eyebrow")}
            title={
              <>
                {t("journey.title1")}
                <span className="text-gradient-secondary">{t("journey.titleHighlight")}</span>
              </>
            }
          />
          <ol className="relative mt-14 flex flex-col gap-8 border-l-2 border-secondary/30 pl-8">
            {steps.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="absolute -left-[45px] grid h-7 w-7 place-items-center rounded-full bg-gradient-to-r from-secondary to-secondary-light text-xs font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="font-outfit text-base font-bold text-navy">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-grey">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <PageFaq namespace="assuranceRecours.faq" tone="white" />
      <FinalCta
        title={t("finalCta.title")}
        subtitle={t("finalCta.subtitle")}
        primaryLabel={t("finalCta.cta")}
        primaryHref="/tarifs"
      />
    </>
  );
}

export default async function AssuranceRecoursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
