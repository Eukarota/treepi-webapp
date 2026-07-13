import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/pages/PageHero";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";
import Simulator from "@/components/landing/Simulator";
import MotiveTabs from "@/components/pages/MotiveTabs";

/*
 * Page « Attestation de garantie financière », maquette
 * `wireframe/attestation-garantie.png`. Sections : héro + document,
 * relevé vs attestation, fonctionnement 01/02/03 illustré, bénéfices
 * (toi / consulat), offre compte inclus, motifs de voyage, simulateur,
 * duo relevé + attestation, FAQ, CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "attestation.meta" });
  return { title: t("title"), description: t("description") };
}

/* Mockup du document d'attestation, légèrement incliné comme la maquette. */
function DocMock() {
  const t = useTranslations("attestation.hero.mock");
  return (
    <div className="mx-auto w-full max-w-xs rotate-3 rounded-xl bg-white p-6 shadow-[0_25px_60px_rgba(11,24,52,0.3)] transition-transform duration-500 hover:rotate-0">
      <div className="text-xs font-bold uppercase tracking-wider text-navy">{t("title")}</div>
      <div className="mt-4 space-y-2" aria-hidden>
        <div className="h-1.5 w-3/4 rounded bg-grey-light" />
        <div className="h-1.5 w-2/3 rounded bg-grey-light" />
        <div className="h-1.5 w-4/5 rounded bg-grey-light" />
      </div>
      <div className="mt-5 text-xs text-grey">{t("amountLabel")}</div>
      <div className="text-gradient-primary font-outfit text-3xl font-bold">{t("amount")}</div>
      <span className="mt-4 inline-flex rounded-full border border-primary px-3 py-1 text-xs font-bold text-primary">
        {t("badge")}
      </span>
    </div>
  );
}

function Content() {
  const t = useTranslations("attestation");
  const bankItems = t.raw("problem.bank.items") as string[];
  const treepiItems = t.raw("problem.treepi.items") as string[];
  const steps = t.raw("how.steps") as { title1: string; titleHighlight: string; title2: string; description: string; image: string }[];
  const benefitRows = t.raw("benefits.rows") as { title: string; you: string; consulate: string }[];
  const offerRows = t.raw("offer.rows") as { label: string; value: string; strike?: string }[];

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
        subtitle={t("hero.subtitle")}
        actions={
          <Button variant="primary" size="lg" href="/tarifs">
            {t("hero.cta")}
          </Button>
        }
        aside={<DocMock />}
      />

      {/* Relevé bancaire vs attestation */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("problem.eyebrow")}
            title={
              <>
                {t("problem.title1")}
                <span className="text-gradient-secondary">{t("problem.titleHighlight")}</span>
              </>
            }
            subtitle={t("problem.subtitle")}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-secondary/5 p-7">
              <h3 className="font-outfit text-base font-bold text-secondary">{t("problem.bank.title")}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {bankItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-navy/80">
                    <span className="mt-0.5 font-bold text-secondary" aria-hidden>✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-primary-lighter/40 p-7">
              <h3 className="font-outfit text-base font-bold text-primary">{t("problem.treepi.title")}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {treepiItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-navy/80">
                    <span className="mt-0.5 font-bold text-primary" aria-hidden>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnement 01 / 02 / 03 avec visuels */}
      <section className="bg-grey-light">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("how.eyebrow")}
            title={
              <>
                {t("how.title1")}
                <span className="text-gradient-secondary">{t("how.titleHighlight")}</span>
              </>
            }
            subtitle={t("how.subtitle")}
          />
          <div className="mt-14 flex flex-col gap-16">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  <div className="text-gradient-secondary font-outfit text-6xl font-bold">0{i + 1}</div>
                  <h3 className="mt-3 font-outfit text-2xl font-bold leading-snug">
                    <span className="text-gradient-primary">{step.title1}</span>
                    <span className="text-gradient-secondary">{step.titleHighlight}</span>
                    <span className="text-gradient-primary">{step.title2}</span>
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-grey">{step.description}</p>
                </div>
                <img
                  src={step.image}
                  alt=""
                  className="h-64 w-full rounded-3xl object-cover shadow-[0_16px_50px_rgba(18,35,71,0.15)]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bénéfices : pour toi / pour le consulat */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("benefits.eyebrow")}
            title={
              <>
                {t("benefits.title1")}
                <span className="text-gradient-secondary">{t("benefits.titleHighlight")}</span>
              </>
            }
          />
          <div className="mt-12 flex flex-col gap-4">
            {benefitRows.map((row, i) => (
              <div key={row.title} className="grid gap-3 md:grid-cols-[140px_1fr_1fr]">
                <div className="flex items-center gap-2 font-outfit text-sm font-bold text-navy">
                  <span aria-hidden>{["🎖️", "📋", "⚡"][i]}</span> {row.title}
                </div>
                <div className="rounded-xl bg-grey-light p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-secondary">{t("benefits.youLabel")}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy/85 [&>b]:font-bold" dangerouslySetInnerHTML={{ __html: row.you }} />
                </div>
                <div className="rounded-xl bg-gradient-to-br from-primary to-primary-light p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/85">{t("benefits.consulateLabel")}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/95 [&>b]:font-bold [&>b]:text-white" dangerouslySetInnerHTML={{ __html: row.consulate }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offre : compte inclus */}
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-3xl bg-gradient-to-br from-primary to-primary-light p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-gradient-to-r from-secondary to-secondary-light px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              {t("offer.flag")}
            </span>
            <h2 className="mt-5 font-outfit text-3xl font-bold leading-tight text-white">
              {t("offer.title1")}
              <br />
              {t("offer.title2")}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85">{t("offer.body")}</p>
            <Button variant="white" size="lg" className="mt-7" href="/tarifs">
              {t("offer.cta")}
            </Button>
          </div>
          <dl className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            {offerRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between border-b border-white/10 py-3 text-sm last:border-0">
                <dt className="text-white/85">{row.label}</dt>
                <dd className="font-bold text-white">
                  {row.strike && <span className="mr-2 text-white/50 line-through">{row.strike}</span>}
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <MotiveTabs />

      {/* Simulateur de montant, partagé avec la page d'accueil */}
      <Simulator />

      {/* Le duo relevé + attestation */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("duo.eyebrow")}
            title={
              <>
                {t("duo.title1")}
                <span className="text-gradient-secondary">{t("duo.titleHighlight")}</span>
              </>
            }
            subtitle={t("duo.subtitle")}
          />
          <div className="mt-12 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
            <div className="card-surface p-7">
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                {t("duo.bank.flag")}
              </span>
              <h3 className="mt-4 font-outfit text-lg font-bold text-navy">📄 {t("duo.bank.title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey">{t("duo.bank.description")}</p>
            </div>
            <div className="text-gradient-secondary text-center font-outfit text-4xl font-bold" aria-hidden>
              +
            </div>
            <div className="rounded-2xl border-2 border-primary bg-white p-7 shadow-[0_16px_50px_rgba(5,160,199,0.15)]">
              <span className="rounded-full bg-primary-lighter px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                {t("duo.treepi.flag")}
              </span>
              <h3 className="mt-4 font-outfit text-lg font-bold text-navy">🛡️ {t("duo.treepi.title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey">{t("duo.treepi.description")}</p>
            </div>
          </div>
          <p
            className="mx-auto mt-8 max-w-3xl rounded-xl bg-primary-lighter/40 p-5 text-center text-sm leading-relaxed text-navy/85 [&>b]:font-bold [&>b]:text-primary"
            dangerouslySetInnerHTML={{ __html: t.raw("duo.note") }}
          />
        </div>
      </section>

      <PageFaq namespace="attestation.faq" />
      <FinalCta
        title={t("finalCta.title")}
        subtitle={t("finalCta.subtitle")}
        primaryLabel={t("finalCta.cta")}
        primaryHref="/tarifs"
      />
    </>
  );
}

export default async function AttestationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
