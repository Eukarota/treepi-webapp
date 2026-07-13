import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/pages/PageHero";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";
import InsuranceQuote from "@/components/pages/InsuranceQuote";
import { PriceCompareBars } from "@/components/landing/Insurances";

/*
 * Page « Assurance voyage Schengen », maquette `wireframe/assurance-voyage.png`.
 * Sections : héro + attestation, comparateur de prix, formules 1/3 mois + âge,
 * couverture, 29 pays, devis interactif, confiance, FAQ, CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "assuranceVoyage.meta" });
  return { title: t("title"), description: t("description") };
}

/* Mockup de l'attestation d'assurance. */
function InsuranceMock() {
  const t = useTranslations("assuranceVoyage.hero.mock");
  return (
    <div className="relative mx-auto w-full max-w-xs -rotate-2 rounded-xl bg-white p-6 shadow-[0_25px_60px_rgba(11,24,52,0.3)] transition-transform duration-500 hover:rotate-0">
      <span className="absolute -right-3 -top-3 grid h-14 w-14 rotate-12 place-items-center rounded-full bg-gradient-to-r from-secondary to-secondary-light text-center text-[10px] font-bold leading-tight text-white">
        {t("price")}
      </span>
      <div className="text-xs font-bold uppercase tracking-wider text-navy">{t("title")}</div>
      <div className="mt-4 space-y-2" aria-hidden>
        <div className="h-1.5 w-3/4 rounded bg-grey-light" />
        <div className="h-1.5 w-2/3 rounded bg-grey-light" />
      </div>
      <div className="text-gradient-primary mt-5 font-outfit text-xl font-bold">{t("coverage")}</div>
      <span className="mt-4 inline-flex rounded-full border border-primary px-3 py-1 text-xs font-bold text-primary">{t("badge")}</span>
    </div>
  );
}

function Content() {
  const t = useTranslations("assuranceVoyage");
  const chips = t.raw("hero.chips") as string[];
  const coverageCards = t.raw("coverage.cards") as { title: string; description: string }[];
  const countries = t.raw("countries.list") as string[];
  const trustCards = t.raw("trust.cards") as { title: string; description: string }[];
  const ageRows = t.raw("plans.age.rows") as { label: string; value: string }[];
  const plan1Features = t.raw("plans.plan1.features") as string[];
  const plan3Features = t.raw("plans.plan3.features") as string[];

  const compareLabels = {
    treepi: t("price.treepi"),
    insurerA: t("price.insurerA"),
    insurerB: t("price.insurerB"),
    days90: t("price.days90"),
    days90eco: t("price.days90eco"),
    days90std: t("price.days90std"),
    note: t("price.note"),
  };

  return (
    <>
      <PageHero
        breadcrumb={t("breadcrumb")}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.title1")}
            <span className="text-gradient-secondary">{t("hero.titleHighlight")}</span>
            {t("hero.title2")}
          </>
        }
        subtitle={
          <>
            {t("hero.subtitle")}
            <span className="mt-5 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span key={chip} className="rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
                  {chip}
                </span>
              ))}
            </span>
          </>
        }
        actions={
          <Button variant="primary" size="lg" href="#devis">
            {t("hero.cta")}
          </Button>
        }
        aside={<InsuranceMock />}
      />

      {/* Comparateur de prix */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("price.eyebrow")}
            title={
              <>
                {t("price.title1")}
                <br />
                <span className="text-gradient-secondary">{t("price.title2")}</span>
              </>
            }
            subtitle={t("price.subtitle")}
          />
          <div className="card-surface mt-12 p-8">
            <PriceCompareBars labels={compareLabels} />
          </div>
        </div>
      </section>

      {/* Formules */}
      <section className="bg-grey-light">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("plans.eyebrow")}
            title={
              <>
                {t("plans.title1")}
                <span className="text-gradient-secondary">{t("plans.titleHighlight")}</span>
              </>
            }
            subtitle={t("plans.subtitle")}
          />
          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
            {/* Formule 1 mois */}
            <div className="card-surface flex flex-col p-8">
              <span className="self-start rounded-full bg-grey-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy">
                {t("plans.plan1.badge")}
              </span>
              <div className="mt-4 font-outfit text-4xl font-bold text-navy">
                {t("plans.plan1.price")}
                <span className="text-base text-grey">{t("plans.plan1.unit")}</span>
              </div>
              <p className="mt-2 text-sm text-grey">{t("plans.plan1.description")}</p>
              <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-grey-light pt-6 text-sm text-navy/90">
                {plan1Features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Button variant="outline" className="mt-6 w-full" href="#devis">
                {t("plans.plan1.cta")}
              </Button>
            </div>
            {/* Formule 3 mois (mise en avant) */}
            <div className="relative flex flex-col rounded-2xl bg-gradient-to-br from-primary to-primary-light p-8 text-white shadow-[0_16px_50px_rgba(5,160,199,0.35)]">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-secondary to-secondary-light px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {t("plans.mostChosen")}
              </span>
              <span className="self-start rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {t("plans.plan3.badge")}
              </span>
              <div className="mt-4 font-outfit text-4xl font-bold">
                {t("plans.plan3.price")}
                <span className="text-base text-white/70">{t("plans.plan3.unit")}</span>
              </div>
              <p className="mt-2 text-sm text-white/80">{t("plans.plan3.description")}</p>
              <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-white/20 pt-6 text-sm">
                {plan3Features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Button variant="white" className="mt-6 w-full" href="#devis">
                {t("plans.plan3.cta")}
              </Button>
            </div>
            {/* 41 ans et plus */}
            <div className="flex flex-col rounded-2xl border-2 border-dashed border-secondary/60 bg-white p-8">
              <span className="self-start rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                {t("plans.age.badge")}
              </span>
              <div className="text-gradient-secondary mt-4 font-outfit text-4xl font-bold">{t("plans.age.title")}</div>
              <p className="mt-2 text-sm text-grey">{t("plans.age.description")}</p>
              <dl className="mt-6 flex flex-1 flex-col gap-2 border-t border-grey-light pt-6 text-sm">
                {ageRows.map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <dt className="text-grey">{row.label}</dt>
                    <dd className="font-bold text-secondary">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <Button variant="outline" className="mt-6 w-full" href="#devis">
                {t("plans.age.cta")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Couverture */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("coverage.eyebrow")}
            title={
              <>
                {t("coverage.title1")}
                <span className="text-gradient-secondary">{t("coverage.titleHighlight")}</span>
              </>
            }
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {coverageCards.map((card, i) => (
              <div key={card.title} className="card-surface p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-grey-light text-lg" aria-hidden>
                  {["🏥", "✈️", "↩️"][i]}
                </span>
                <h3 className="mt-4 font-outfit text-base font-bold text-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-grey">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 29 pays */}
      <section className="bg-grey-light">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("countries.eyebrow")}
            title={
              <>
                {t("countries.title1")}
                <span className="text-gradient-secondary">{t("countries.titleHighlight")}</span>
              </>
            }
            subtitle={t("countries.subtitle")}
          />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {countries.map((country) => (
              <div key={country} className="rounded-xl bg-white px-4 py-3 text-center text-sm font-medium text-navy shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
                {country}
              </div>
            ))}
          </div>
        </div>
      </section>

      <InsuranceQuote />

      {/* Confiance */}
      <section className="bg-grey-light">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("trust.eyebrow")}
            title={
              <>
                {t("trust.title1")}
                <span className="text-gradient-secondary">{t("trust.titleHighlight")}</span>
              </>
            }
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {trustCards.map((card, i) => (
              <div key={card.title} className="card-surface p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-lg" aria-hidden>
                  {["🤝", "🔎", "🔐"][i]}
                </span>
                <h3 className="mt-4 font-outfit text-base font-bold text-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-grey">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageFaq namespace="assuranceVoyage.faq" tone="white" />
      <FinalCta
        title={t("finalCta.title")}
        subtitle={t("finalCta.subtitle")}
        primaryLabel={t("finalCta.cta")}
        primaryHref="/assurance-voyage#devis"
      />
    </>
  );
}

export default async function AssuranceVoyagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
