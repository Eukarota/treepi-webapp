import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/pages/PageHero";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";
import RechargeSimulator from "@/components/pages/RechargeSimulator";

/*
 * Page « Recharge », maquette `wireframe/recharge.png`.
 * Sections : héro + convertisseur, bandeau de réassurance, 3 méthodes,
 * pas-à-pas, tableau des délais, simulateur interactif, bonnes pratiques,
 * FAQ, CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recharge.meta" });
  return { title: t("title"), description: t("description") };
}

/* Mini-convertisseur illustratif du héro (statique, la version interactive est plus bas). */
function HeroMock() {
  const t = useTranslations("recharge.hero.mock");
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_25px_60px_rgba(11,24,52,0.25)]">
      <div className="text-[10px] font-bold uppercase tracking-widest text-grey">{t("sendLabel")}</div>
      <div className="mt-1.5 flex items-center justify-between rounded-xl border border-grey-light px-4 py-3">
        <span className="font-outfit text-lg font-bold text-navy">1 640 000</span>
        <span className="text-xs font-bold text-grey">FCFA (XOF)</span>
      </div>
      <div className="my-3 text-center text-secondary" aria-hidden>↓</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-grey">{t("receiveLabel")}</div>
      <div className="mt-1.5 flex items-center justify-between rounded-xl bg-primary-lighter/50 px-4 py-3">
        <span className="text-gradient-primary font-outfit text-lg font-bold">≈ 2 500 €</span>
        <span className="text-xs" aria-hidden>🇪🇺</span>
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-grey">{t("rateNote")}</p>
      <Button variant="primary" className="mt-4 w-full" href="#simulateur">
        {t("cta")}
      </Button>
    </div>
  );
}

function Content() {
  const t = useTranslations("recharge");
  const trust = t.raw("hero.trust") as string[];
  const methodCards = t.raw("methods.cards") as { title: string; description: string; tags: string[] }[];
  const currencies = t.raw("methods.currencies") as string[];
  const stepItems = t.raw("steps.items") as { title: string; description: string }[];
  const delayRows = t.raw("delays.rows") as { method: string; delay: string; note: string }[];
  const practiceCards = t.raw("practices.cards") as { title: string; description: string }[];

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
        subtitle={
          <>
            <span dangerouslySetInnerHTML={{ __html: t.raw("hero.subtitle") }} />
            <span className="mt-4 block text-sm text-white/80" dangerouslySetInnerHTML={{ __html: t.raw("hero.note") }} />
          </>
        }
        actions={
          <>
            <Button variant="primary" size="lg" href="#simulateur">
              {t("hero.ctaPrimary")}
            </Button>
            <Button variant="white" size="lg" href="#etapes">
              {t("hero.ctaSecondary")}
            </Button>
          </>
        }
        aside={<HeroMock />}
      />

      {/* Bandeau de réassurance */}
      <section className="border-b border-grey-light bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {trust.map((html, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-grey-light text-sm" aria-hidden>
                {["🔒", "🧾", "⚡", "💬"][i]}
              </span>
              <p className="text-sm leading-snug text-navy [&>b]:font-bold" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          ))}
        </div>
      </section>

      {/* Les 3 méthodes */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("methods.eyebrow")}
            title={
              <>
                {t("methods.title1")}
                <span className="text-gradient-secondary">{t("methods.titleHighlight")}</span>
              </>
            }
            subtitle={<span dangerouslySetInnerHTML={{ __html: t.raw("methods.subtitle") }} />}
          />
          <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
            {methodCards.map((card, i) => (
              <div
                key={card.title}
                className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                  i === 0
                    ? "border-2 border-secondary bg-white shadow-[0_16px_50px_rgba(255,101,103,0.15)]"
                    : "card-surface hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]"
                }`}
              >
                {i === 0 && (
                  <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-secondary to-secondary-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    {t("methods.fastest")}
                  </span>
                )}
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-grey-light text-lg" aria-hidden>
                  {["💳", "💵", "🏦"][i]}
                </span>
                <h3 className="mt-4 font-outfit text-lg font-bold text-navy">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-grey">{card.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-bold text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {currencies.map((c) => (
              <span key={c} className="rounded-full bg-grey-light px-3.5 py-1.5 text-xs font-bold text-navy">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pas-à-pas */}
      <section className="bg-grey-light" id="etapes">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("steps.eyebrow")}
            title={
              <>
                {t("steps.title1")}
                <span className="text-gradient-secondary">{t("steps.titleHighlight")}</span>
              </>
            }
            subtitle={<span dangerouslySetInnerHTML={{ __html: t.raw("steps.subtitle") }} />}
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stepItems.map((step, i) => (
              <div key={step.title} className="card-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]">
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-secondary text-sm font-bold text-secondary">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-bold text-navy">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-grey">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Délais */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("delays.eyebrow")}
            title={
              <>
                {t("delays.title1")}
                <span className="text-gradient-secondary">{t("delays.titleHighlight")}</span>
              </>
            }
            subtitle={<span dangerouslySetInnerHTML={{ __html: t.raw("delays.subtitle") }} />}
          />
          <div className="card-surface mt-12 overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-primary-light text-left text-white">
                  <th className="px-5 py-4 font-bold">{t("delays.columns.method")}</th>
                  <th className="px-5 py-4 font-bold">{t("delays.columns.delay")}</th>
                  <th className="px-5 py-4 font-bold">{t("delays.columns.note")}</th>
                </tr>
              </thead>
              <tbody>
                {delayRows.map((row, i) => (
                  <tr key={row.method} className={i % 2 ? "bg-grey-light/50" : "bg-white"}>
                    <td className="px-5 py-3.5 font-bold text-primary">{row.method}</td>
                    <td className="px-5 py-3.5 font-bold text-secondary">{row.delay}</td>
                    <td className="px-5 py-3.5 text-grey">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-grey">{t("delays.note")}</p>
        </div>
      </section>

      <RechargeSimulator />

      {/* Bonnes pratiques */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("practices.eyebrow")}
            title={
              <>
                {t("practices.title1")}
                <span className="text-gradient-secondary">{t("practices.titleHighlight")}</span>
              </>
            }
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {practiceCards.map((card, i) => (
              <div key={card.title} className="card-surface p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-grey-light text-lg" aria-hidden>
                  {["⏳", "🧾", "🎯"][i]}
                </span>
                <h3 className="mt-4 font-outfit text-base font-bold text-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-grey">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageFaq namespace="recharge.faq" />
      <FinalCta
        title={t("finalCta.title")}
        subtitle={t("finalCta.subtitle")}
        primaryLabel={t("finalCta.cta")}
        primaryHref="/recharge#simulateur"
      />
    </>
  );
}

export default async function RechargePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
