import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/pages/PageHero";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";
import JourneyTabs from "@/components/pages/JourneyTabs";

/*
 * Page « Compte européen », maquette `wireframe/compte_euro.png`.
 * Sections : héro + carte IBAN, procédure en 5 étapes, usages du compte,
 * avant/après visa, bandeau CTA, tarifs, comparatif banque locale,
 * bloc confiance ACPR, FAQ, CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compteEuro.meta" });
  return { title: t("title"), description: t("description") };
}

/* Mockup de la carte IBAN du héro. */
function IbanCard() {
  const t = useTranslations("compteEuro.hero.mock");
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_25px_60px_rgba(11,24,52,0.25)]">
      <span className="inline-flex rounded-full bg-primary-lighter px-3 py-1 text-xs font-bold text-primary">{t("badge")}</span>
      <div className="mt-5 text-[10px] font-bold uppercase tracking-widest text-grey">{t("ibanLabel")}</div>
      <div className="mt-1 font-outfit text-lg font-bold tracking-wide text-navy">{t("iban")}</div>
      <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-grey">{t("holderLabel")}</div>
      <div className="mt-0.5 text-sm font-bold text-navy">{t("holder")}</div>
      <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-grey">{t("balanceLabel")}</div>
      <div className="text-gradient-primary mt-0.5 font-outfit text-3xl font-bold">{t("balance")}</div>
      <p
        className="mt-5 rounded-xl bg-grey-light p-3 text-xs leading-relaxed text-grey [&>b]:font-bold [&>b]:text-secondary"
        dangerouslySetInnerHTML={{ __html: t.raw("cardNote") }}
      />
    </div>
  );
}

function Content() {
  const t = useTranslations("compteEuro");
  const steps = t.raw("procedure.steps") as { title: string; description: string }[];
  const facts = t.raw("procedure.facts") as { title: string; description: string }[];
  const purposeCards = t.raw("purpose.cards") as { title: string; description: string }[];
  const compareRows = t.raw("compare.rows") as { criterion: string; local: string; treepi: string }[];
  const soloRows = t.raw("pricing.solo.rows") as { label: string; value: string }[];
  const comboRows = t.raw("pricing.combo.rows") as { label: string; value: string; strike?: string }[];
  const chips = t.raw("trust.chips") as string[];

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
        aside={<IbanCard />}
      />

      {/* La procédure en 5 étapes */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("procedure.eyebrow")}
            title={
              <>
                {t("procedure.title1")}
                <span className="text-gradient-secondary">{t("procedure.titleHighlight")}</span>
              </>
            }
            subtitle={t("procedure.subtitle")}
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <div key={step.title} className="card-surface p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]">
                <span className="mx-auto grid h-8 w-8 place-items-center rounded-full border-2 border-secondary text-sm font-bold text-secondary">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-bold text-navy">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-grey">{step.description}</p>
              </div>
            ))}
          </div>
          {/* Trois faits clés */}
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.title} className="rounded-2xl bg-grey-light p-5 text-center">
                <div className="font-outfit text-lg font-bold text-primary">{fact.title}</div>
                <div className="mt-1 text-xs text-grey">{fact.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Un compte pensé pour ton voyage */}
      <section className="bg-grey-light">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            title={
              <>
                {t("purpose.title1")}
                <span className="text-gradient-secondary">{t("purpose.titleHighlight")}</span>
              </>
            }
            subtitle={t("purpose.subtitle")}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {purposeCards.map((card, i) => (
              <div key={card.title} className="card-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-lg" aria-hidden>
                  {["📄", "💶", "✈️"][i]}
                </span>
                <h3 className="mt-4 font-outfit text-base font-bold text-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-grey">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avant / après le visa (onglets interactifs) */}
      <JourneyTabs />

      {/* Bandeau intermédiaire */}
      <section className="px-4 py-10 sm:px-6">
        <div className="mask-treepi mx-auto max-w-7xl rounded-3xl px-6 py-16 text-center">
          <h2 className="font-outfit text-3xl font-bold leading-tight text-white sm:text-4xl">
            {t("banner.line1")}
            <br />
            <span className="text-gradient-secondary">{t("banner.line2")}</span>
            <br />
            {t("banner.line3")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/85">{t("banner.subtitle")}</p>
        </div>
      </section>

      {/* Tarifs : compte seul vs compte + attestation */}
      <section className="bg-white" id="tarif">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("pricing.eyebrow")}
            title={
              <>
                {t("pricing.title1")}
                <span className="text-gradient-secondary">{t("pricing.titleHighlight")}</span>
              </>
            }
            subtitle={t("pricing.subtitle")}
          />
          <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2">
            {/* Compte seul */}
            <div className="card-surface flex flex-col p-8">
              <span className="self-start text-xs font-bold uppercase tracking-wider text-secondary">{t("pricing.solo.badge")}</span>
              <h3 className="mt-2 font-outfit text-xl font-bold text-navy">{t("pricing.solo.title")}</h3>
              <dl className="mt-6 flex flex-col divide-y divide-grey-light">
                {soloRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3 text-sm">
                    <dt className="text-grey">{row.label}</dt>
                    <dd className="font-bold text-primary">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 flex-1 text-xs leading-relaxed text-grey">{t("pricing.solo.note")}</p>
              <Button variant="outline" className="mt-6 w-full" href="/tarifs">
                {t("pricing.solo.cta")}
              </Button>
            </div>
            {/* Compte + attestation */}
            <div className="relative flex flex-col rounded-2xl bg-gradient-to-br from-primary to-primary-light p-8 text-white shadow-[0_16px_50px_rgba(5,160,199,0.35)]">
              <span className="absolute -top-3 left-8 rounded-full bg-gradient-to-r from-secondary to-secondary-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {t("pricing.combo.flag")}
              </span>
              <span className="self-start text-xs font-bold uppercase tracking-wider text-white/80">{t("pricing.combo.badge")}</span>
              <h3 className="mt-2 font-outfit text-xl font-bold">{t("pricing.combo.title")}</h3>
              <dl className="mt-6 flex flex-col divide-y divide-white/15">
                {comboRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3 text-sm">
                    <dt className="text-white/85">{row.label}</dt>
                    <dd className="font-bold">
                      {row.strike && <span className="mr-2 text-white/50 line-through">{row.strike}</span>}
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 flex-1 text-xs leading-relaxed text-white/80">{t("pricing.combo.note")}</p>
              <Button variant="white" className="mt-6 w-full" href="/attestation-garantie">
                {t("pricing.combo.cta")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparatif Treepi vs banque locale */}
      <section className="bg-grey-light">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("compare.eyebrow")}
            title={
              <>
                {t("compare.title1")}
                <span className="text-gradient-secondary">{t("compare.titleHighlight")}</span>
              </>
            }
          />
          <div className="card-surface mt-12 overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>
                  <th className="bg-white px-5 py-4 text-left font-bold text-navy">{t("compare.columns.criterion")}</th>
                  <th className="bg-gradient-to-r from-primary to-primary-light px-5 py-4 text-left font-bold text-white">{t("compare.columns.local")}</th>
                  <th className="bg-gradient-to-r from-secondary to-secondary-light px-5 py-4 text-left font-bold text-white">
                    {t("compare.columns.treepi")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr key={row.criterion} className={i % 2 ? "bg-grey-light/50" : "bg-white"}>
                    <td className="px-5 py-3.5 font-medium text-navy">{row.criterion}</td>
                    <td className="px-5 py-3.5 text-secondary">{row.local}</td>
                    <td className="px-5 py-3.5 font-bold text-primary">{row.treepi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bloc confiance ACPR */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl bg-primary-lighter/40 p-8">
            <h3 className="font-outfit text-lg font-bold text-navy">{t("trust.title")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-grey">{t("trust.body")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span key={chip} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary shadow-sm">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PageFaq namespace="compteEuro.faq" />
      <FinalCta title={t("finalCta.title")} subtitle={t("finalCta.subtitle")} />
    </>
  );
}

export default async function CompteEuroPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
