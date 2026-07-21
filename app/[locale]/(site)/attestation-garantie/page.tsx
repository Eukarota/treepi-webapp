import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";
import SimulateurMontant from "@/components/pages/SimulateurMontant";
import MotiveTabs from "@/components/pages/MotiveTabs";
import BandeMasquee from "@/components/landing/BandeMasquee";

/*
 * Page « Attestation de garantie financière » : le produit phare.
 * Sections : héro « ton relevé le dit, l'attestation le prouve » avec le
 * document vérifiable, relevé vs attestation, fonctionnement 01/02/03
 * illustré, bénéfices toi/consulat, offre compte inclus, motifs de voyage,
 * simulateur de montant, le duo gagnant, FAQ, CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "attestation.meta" });
  return { title: t("title"), description: t("description") };
}

/* Le document d'attestation : montant, titulaire, cachet et code de
   vérification consulaire. Incliné, il se redresse au survol. */
function DocumentAttestation() {
  const t = useTranslations("attestation.hero.mock");
  return (
    <div className="mx-auto w-full max-w-sm rotate-2 rounded-2xl bg-white p-6 shadow-[0_25px_60px_rgba(11,24,52,0.3)] transition-transform duration-500 hover:rotate-0">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-bold uppercase tracking-wider text-navy">{t("title")}</div>
        <span className="shrink-0 -rotate-6 rounded-md border-2 border-primary px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-primary">
          {t("badge")}
        </span>
      </div>
      <div className="mt-4 space-y-2" aria-hidden>
        <div className="h-1.5 w-3/4 rounded bg-grey-light" />
        <div className="h-1.5 w-2/3 rounded bg-grey-light" />
        <div className="h-1.5 w-4/5 rounded bg-grey-light" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-grey">{t("amountLabel")}</div>
          <div className="text-gradient-primary font-outfit text-3xl font-bold">{t("amount")}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-grey">{t("holderLabel")}</div>
          <div className="mt-1 text-sm font-bold text-navy">{t("holder")}</div>
        </div>
      </div>
      {/* Bandeau de vérification consulaire. */}
      <div className="mt-5 flex items-center gap-3 rounded-xl bg-grey-light p-3">
        {/* Motif de code de vérification. */}
        <div className="grid shrink-0 grid-cols-4 gap-0.5" aria-hidden>
          {[1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1].map((on, i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-[2px] ${on ? "bg-navy" : "bg-grey-200"}`} />
          ))}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-grey">{t("verifLabel")}</div>
          <div className="truncate font-outfit text-sm font-bold text-navy">{t("verifCode")}</div>
        </div>
      </div>
    </div>
  );
}

/* Héro : la phrase qui résume tout, et le document en preuve. */
function HeroAttestation() {
  const t = useTranslations("attestation.hero");
  return (
    <section className="section !py-6 max-sm:!py-2">
      <BandeMasquee className="!min-h-0">
        <div className="relative z-20 grid items-center gap-10 px-6 pb-12 pt-12 sm:px-12 md:grid-cols-[1.1fr_0.9fr] md:pb-16 md:pt-16 lg:px-16">
          <div className="text-white">
            <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white">{t("eyebrow")}</span>
            <h1 className="mt-4 font-outfit text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90">{t("subtitle")}</p>
            <div className="mt-8">
              <Button variant="primary" size="lg" href="/tarifs">
                {t("cta")}
              </Button>
            </div>
          </div>
          <div>
            <DocumentAttestation />
            {/* Annotation manuscrite sous le document. */}
            <div className="mt-3 flex -rotate-2 items-start justify-center gap-1.5 font-caveat text-2xl text-white sm:text-3xl">
              <svg viewBox="0 0 40 40" className="mt-[-10px] h-8 w-8" fill="none" aria-hidden>
                <path d="M6 34C14 22 22 14 33 7m0 0-9 1m9-1-1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("annotation")}
            </div>
          </div>
        </div>
      </BandeMasquee>
    </section>
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
      <HeroAttestation />

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
          <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2">
            {/* Le relevé, un peu de travers : il fait ce qu'il peut. */}
            <div className="rounded-2xl bg-secondary/5 p-7 md:-rotate-1">
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
            {/* L'attestation, bien droite. */}
            <div className="package !m-0 bg-white p-7">
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
                  <div className="text-gradient-secondary font-outfit text-7xl font-extrabold sm:text-8xl">0{i + 1}</div>
                  <h3 className="mt-3 font-outfit text-2xl font-bold leading-snug sm:text-3xl">
                    <span className="text-gradient-primary">{step.title1}</span>
                    <span className="text-gradient-secondary">{step.titleHighlight}</span>
                    <span className="text-gradient-primary">{step.title2}</span>
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-grey sm:text-base">{step.description}</p>
                </div>
                <img
                  src={step.image}
                  alt=""
                  width={531}
                  height={329}
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

      {/* Simulateur de montant : combien bloquer pour son dossier */}
      <SimulateurMontant />

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
            <div className="card-surface p-7 md:-rotate-1">
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                {t("duo.bank.flag")}
              </span>
              <h3 className="mt-4 font-outfit text-lg font-bold text-navy">📄 {t("duo.bank.title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey">{t("duo.bank.description")}</p>
            </div>
            {/* Le « + » manuscrit du duo. */}
            <div className="-rotate-6 text-center font-caveat text-6xl text-secondary" aria-hidden>
              {t("duo.plus")}
            </div>
            <div className="rounded-2xl border-2 border-primary bg-white p-7 shadow-[0_16px_50px_rgba(5,160,199,0.15)] md:rotate-1">
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
