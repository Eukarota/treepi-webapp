import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";
import InsuranceQuote from "@/components/pages/InsuranceQuote";
import BandeMasquee from "@/components/landing/BandeMasquee";
import { PriceCompareBars } from "@/components/landing/Insurances";

/*
 * Page « Assurance voyage Schengen » : arrête d'être un pigeon.
 * Sections : héro à bande masquée avec comparateur de prix en preuve
 * immédiate, formules 1/3 mois + âge, couverture + partenaires, les
 * 29 pays, devis interactif, FAQ, CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "assuranceVoyage.meta" });
  return { title: t("title"), description: t("description") };
}

/* Héro : le mot qui fâche, et la preuve par les barres juste à côté. */
function HeroAssurance() {
  const t = useTranslations("assuranceVoyage.hero");
  const chips = t.raw("chips") as string[];
  const compare = t.raw("compare") as {
    treepi: string; insurerA: string; insurerB: string;
    days90: string; days90eco: string; days90std: string; note: string;
  };

  return (
    <section className="section !py-6 max-sm:!py-2">
      <BandeMasquee className="!min-h-0">
        <div className="relative z-20 grid items-center gap-10 px-6 pb-6 pt-12 sm:px-12 md:grid-cols-[1.05fr_0.95fr] md:pb-8 md:pt-16 lg:px-16">
          <div className="text-white">
            <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white">{t("badge")}</span>
            <h1 className="mt-4 font-outfit text-4xl font-bold leading-tight sm:text-5xl">
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90">{t("subtitle")}</p>
            <div className="mt-8">
              <Button variant="primary" size="lg" href="#devis">
                {t("cta")}
              </Button>
            </div>
          </div>
          {/* La preuve : mêmes 90 jours, prix comparés. */}
          <div>
            <div className="mx-auto w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_25px_60px_rgba(11,24,52,0.25)]">
              <div className="text-xs font-bold uppercase tracking-widest text-grey">{t("compareTitle")}</div>
              <div className="mt-4">
                <PriceCompareBars labels={compare} />
              </div>
            </div>
            {/* Annotation manuscrite sous la carte. */}
            <div className="mt-3 flex -rotate-2 items-start justify-center gap-1.5 font-caveat text-2xl text-white sm:text-3xl">
              <svg viewBox="0 0 40 40" className="mt-[-10px] h-8 w-8" fill="none" aria-hidden>
                <path d="M6 34C14 22 22 14 33 7m0 0-9 1m9-1-1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("annotation")}
            </div>
          </div>
        </div>
        {/* Bandeau de réassurance. */}
        <div className="relative z-20 mx-6 mb-10 border-t border-white/20 px-2 pt-5 sm:mx-12 lg:mx-16">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {chips.map((chip) => (
              <span key={chip} className="text-xs font-bold text-white/90">{chip}</span>
            ))}
          </div>
        </div>
      </BandeMasquee>
    </section>
  );
}

/* Formules 1 mois / 3 mois + carte âge. */
function Formules() {
  const t = useTranslations("assuranceVoyage.plans");
  const ageRows = t.raw("age.rows") as { label: string; value: string }[];

  const plans = (["plan1", "plan3"] as const).map((key) => ({
    key,
    badge: t(`${key}.badge`),
    price: t(`${key}.price`),
    unit: t(`${key}.unit`),
    description: t(`${key}.description`),
    features: t.raw(`${key}.features`) as string[],
    cta: t(`${key}.cta`),
  }));

  return (
    <section className="bg-white" id="formules">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
            </>
          }
          subtitle={t("subtitle")}
        />
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.key}
              className={`relative flex flex-col rounded-2xl bg-white p-7 ${
                i === 1 ? "border-2 border-secondary shadow-[0_16px_50px_rgba(255,101,103,0.15)]" : "card-surface"
              }`}
            >
              {i === 1 && (
                <span className="absolute -top-3.5 left-7 rounded-full bg-gradient-to-r from-secondary to-secondary-light px-3.5 py-1 text-xs font-bold text-white">
                  {t("mostChosen")}
                </span>
              )}
              <span className="self-start rounded-full bg-primary-lighter px-3 py-1 text-xs font-bold text-primary">{plan.badge}</span>
              <div className="mt-4 font-outfit text-4xl font-bold text-navy">
                {plan.price}
                <span className="text-base font-bold text-grey"> {plan.unit}</span>
              </div>
              <p className="mt-1 text-xs text-grey">{plan.description}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-sm leading-relaxed text-navy/90">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="mt-0.5 shrink-0" aria-hidden>{f.slice(0, f.indexOf(" "))}</span>
                    <span>{f.slice(f.indexOf(" ") + 1)}</span>
                  </li>
                ))}
              </ul>
              <Button variant={i === 1 ? "primary" : "outline"} className="mt-6 w-full" href="#devis">
                {plan.cta}
              </Button>
            </div>
          ))}
          {/* L'âge, sans tabou : la seule autre variable. */}
          <div className="card-surface flex flex-col p-7">
            <span className="self-start rounded-full bg-grey-light px-3 py-1 text-xs font-bold text-grey">{t("age.badge")}</span>
            <div className="mt-4 font-outfit text-3xl font-bold text-navy">{t("age.title")}</div>
            <p className="mt-2 text-sm leading-relaxed text-grey">{t("age.description")}</p>
            <dl className="mt-4 flex flex-1 flex-col divide-y divide-grey-light">
              {ageRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5 text-sm">
                  <dt className="text-grey">{row.label}</dt>
                  <dd className="font-bold text-navy">{row.value}</dd>
                </div>
              ))}
            </dl>
            <Button variant="outline" className="mt-6 w-full" href="#devis">
              {t("age.cta")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Couverture : ce qui est pris en charge, et les garanties de sérieux. */
function Couverture() {
  const t = useTranslations("assuranceVoyage.coverage");
  const tTrust = useTranslations("assuranceVoyage.trust");
  const cards = t.raw("cards") as { title: string; description: string }[];
  const trustCards = tTrust.raw("cards") as { title: string; description: string }[];

  return (
    <section className="bg-grey-light">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
            </>
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <div key={card.title} className="card-surface p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-lg text-white" aria-hidden>
                {["🏥", "✈️", "↩️"][i]}
              </span>
              <h3 className="mt-4 font-outfit text-base font-bold text-navy">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey">{card.description}</p>
            </div>
          ))}
        </div>
        {/* Les garanties de sérieux, en une ligne discrète. */}
        <div className="mt-8 grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3">
          {trustCards.map((card) => (
            <div key={card.title} className="flex gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-lighter text-xs font-bold text-primary" aria-hidden>✓</span>
              <div>
                <div className="text-sm font-bold text-navy">{card.title}</div>
                <p className="mt-0.5 text-xs leading-relaxed text-grey">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Les 29 pays : le grand chiffre, et la liste qui donne envie. */
function Pays() {
  const t = useTranslations("assuranceVoyage.countries");
  const list = t.raw("list") as string[];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="relative">
            <div className="mb-4"><span className="section-eyebrow">{t("eyebrow")}</span></div>
            <h2 className="font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl">
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-grey">{t("subtitle")}</p>
            <div className="mt-5 -rotate-2 font-caveat text-2xl text-secondary">{t("annotation")}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {list.map((pays, i) => (
              <span
                key={pays}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-transform duration-200 hover:-translate-y-0.5 ${
                  i % 5 === 2
                    ? "bg-gradient-to-r from-primary to-primary-light text-white"
                    : i % 7 === 3
                      ? "bg-secondary/10 text-secondary"
                      : "bg-grey-light text-navy/80"
                }`}
              >
                {pays}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Content() {
  const t = useTranslations("assuranceVoyage");
  return (
    <>
      <HeroAssurance />
      <Formules />
      <Couverture />
      <Pays />
      <InsuranceQuote />
      <PageFaq namespace="assuranceVoyage.faq" tone="grey" />
      <FinalCta
        title={t("finalCta.title")}
        subtitle={t("finalCta.subtitle")}
        primaryLabel={t("finalCta.cta")}
        primaryHref="#devis"
      />
    </>
  );
}

export default async function AssuranceVoyagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
