import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import RotatingWords from "@/components/ui/RotatingWords";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";
import JourneyTabs from "@/components/pages/JourneyTabs";
import BandeMasquee from "@/components/landing/BandeMasquee";

/*
 * Page « Compte européen » : le produit fondation de Treepi.
 * Sections : héro à villes tournantes + carte IBAN vivante, « un compte,
 * trois pouvoirs » (illustrations Figma), ouverture en cinq étapes reliées,
 * avant/après visa (onglets), tarif seul vs + attestation (bordures
 * dégradées), comparatif banque locale, bloc confiance ACPR, FAQ, CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compteEuro.meta" });
  return { title: t("title"), description: t("description") };
}

/* Carte IBAN du héro : compte vivant, toast de recharge qui déborde. */
function CarteIban() {
  const t = useTranslations("compteEuro.hero");
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-2xl bg-white p-6 shadow-[0_25px_60px_rgba(11,24,52,0.25)]">
        <span className="inline-flex rounded-full bg-primary-lighter px-3 py-1 text-xs font-bold text-primary">{t("mock.badge")}</span>
        <div className="mt-5 text-[10px] font-bold uppercase tracking-widest text-grey">{t("mock.ibanLabel")}</div>
        <div className="mt-1 font-outfit text-lg font-bold tracking-wide text-navy">{t("mock.iban")}</div>
        <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-grey">{t("mock.holderLabel")}</div>
        <div className="mt-0.5 text-sm font-bold text-navy">{t("mock.holder")}</div>
        <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-grey">{t("mock.balanceLabel")}</div>
        <div className="text-gradient-primary mt-0.5 font-outfit text-3xl font-bold">{t("mock.balance")}</div>
      </div>
      {/* Notification de recharge, posée sur la carte. */}
      <div className="absolute -bottom-10 -left-3 flex items-center gap-3 rounded-2xl bg-white p-3.5 pr-5 shadow-[0_12px_35px_rgba(11,24,52,0.25)] sm:-left-8">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-lighter text-base" aria-hidden>💶</span>
        <div>
          <div className="text-xs font-bold text-navy">{t("mock.toastTitle")}</div>
          <div className="text-[11px] text-grey">{t("mock.toastBody")}</div>
        </div>
      </div>
    </div>
  );
}

/* Héro : ville tournante en dégradé corail, carte IBAN à droite. */
function HeroCompte() {
  const t = useTranslations("compteEuro.hero");
  const villes = t.raw("words") as string[];

  return (
    <section className="section !py-6 max-sm:!py-2">
      <BandeMasquee className="!min-h-0">
        <div className="relative z-20 grid items-center gap-10 px-6 pb-12 pt-12 sm:px-12 md:grid-cols-[1.1fr_0.9fr] md:pb-16 md:pt-16 lg:px-16">
          <div className="text-white">
            <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white">{t("badge")}</span>
            <h1 className="mt-4 font-outfit text-4xl font-bold leading-tight sm:text-5xl">
              {t("title1")}
              <RotatingWords
                words={villes}
                className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text pb-1 text-transparent"
              />
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90">{t("subtitle")}</p>
            <div className="mt-8">
              <Button variant="primary" size="lg" href="/tarifs">
                {t("cta")}
              </Button>
            </div>
            {/* Annotation manuscrite, flèche vers la carte IBAN. */}
            <div className="mt-8 flex -rotate-2 items-end gap-1.5 font-caveat text-2xl sm:text-3xl md:justify-end md:pr-4">
              {t("annotation")}
              <svg viewBox="0 0 40 40" className="mb-1 h-9 w-9" fill="none" aria-hidden>
                <path d="M6 33C16 29 26 21 33 8m0 0-8 4m8-4 1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <CarteIban />
        </div>
      </BandeMasquee>
    </section>
  );
}

/* « Un compte, trois pouvoirs » : illustrations Figma + liens produits. */
function TroisPouvoirs() {
  const t = useTranslations("compteEuro.trois");
  const items = t.raw("items") as { image: string; title: string; description: string; linkLabel: string; href: string }[];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
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
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.title} className="flex flex-col text-center md:text-left">
              <div className="mx-auto grid h-40 place-items-center md:mx-0">
                <img src={item.image} alt="" aria-hidden width={160} height={160} className="h-36 w-36 object-contain" />
              </div>
              <div className="mt-4 inline-flex items-center gap-2 self-center md:self-start">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-r from-secondary to-secondary-light font-outfit text-xs font-bold text-white" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="font-outfit text-lg font-bold text-navy">{item.title}</h3>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-grey">{item.description}</p>
              <Link
                href={item.href}
                className="mt-3 self-center text-sm font-bold text-primary transition-colors hover:text-secondary md:self-start"
              >
                {item.linkLabel} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* L'ouverture : cinq étapes reliées par un trait dégradé, annotation chrono. */
function Procedure() {
  const t = useTranslations("compteEuro.procedure");
  const steps = t.raw("steps") as { title: string; description: string }[];

  return (
    <section className="bg-grey-light">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="relative mx-auto max-w-3xl">
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
          {/* Annotation manuscrite, à côté du titre. */}
          <div className="pointer-events-none absolute -right-6 top-2 hidden rotate-6 font-caveat text-2xl text-secondary lg:block xl:-right-24">
            {t("annotation")}
            <svg viewBox="0 0 40 40" className="ml-6 h-8 w-8 -scale-x-100" fill="none" aria-hidden>
              <path d="M6 6c8 12 16 20 27 27m0 0-9-1m9 1-1-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="relative mt-14">
          {/* Trait de liaison (desktop). */}
          <div className="absolute left-[10%] right-[10%] top-5 hidden h-1 rounded-full bg-gradient-to-r from-secondary via-primary to-primary-light opacity-30 lg:block" aria-hidden />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <div key={step.title} className="relative text-center">
                <span className="relative z-10 mx-auto grid h-10 w-10 place-items-center rounded-full bg-gradient-to-r from-secondary to-secondary-light font-outfit text-sm font-bold text-white shadow-[0_6px_16px_rgba(255,101,103,0.35)]">
                  {i + 1}
                </span>
                <h3 className="mt-3.5 font-outfit text-base font-bold text-navy">{step.title}</h3>
                <p className="mx-auto mt-1.5 max-w-[220px] text-xs leading-relaxed text-grey">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Tarif : deux cartes à bordure dégradée (turquoise / corail), style packages. */
function Tarif() {
  const t = useTranslations("compteEuro.pricing");
  const soloRows = t.raw("solo.rows") as { label: string; value: string }[];
  const comboRows = t.raw("combo.rows") as { label: string; value: string; strike?: string }[];

  return (
    <section className="bg-white" id="tarif">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
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
        <div className="mt-14 grid items-stretch gap-8 md:grid-cols-2">
          {/* Compte seul : bordure dégradée turquoise. */}
          <div className="package flex flex-col bg-white p-8 !m-0">
            <span className="self-start rounded-full bg-primary-lighter px-3 py-1 text-xs font-bold text-primary">{t("solo.badge")}</span>
            <h3 className="mt-3 font-outfit text-xl font-bold text-navy">{t("solo.title")}</h3>
            <dl className="mt-6 flex flex-col divide-y divide-grey-light">
              {soloRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between py-3 text-sm">
                  <dt className="text-grey">{row.label}</dt>
                  <dd className="font-bold text-primary">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex-1 text-xs leading-relaxed text-grey">{t("solo.note")}</p>
            <Button variant="outline" className="mt-6 w-full" href="/tarifs">
              {t("solo.cta")}
            </Button>
          </div>
          {/* Compte + attestation : bordure dégradée corail. */}
          <div className="package package__zen relative flex flex-col bg-white p-8 !m-0">
            <span className="absolute -top-3.5 left-8 rounded-full bg-gradient-to-r from-secondary to-secondary-light px-3.5 py-1 text-xs font-bold text-white">
              {t("combo.flag")}
            </span>
            <span className="self-start rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">{t("combo.badge")}</span>
            <h3 className="mt-3 font-outfit text-xl font-bold text-navy">{t("combo.title")}</h3>
            <dl className="mt-6 flex flex-col divide-y divide-grey-light">
              {comboRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between py-3 text-sm">
                  <dt className="text-grey">{row.label}</dt>
                  <dd className="font-bold text-navy">
                    {row.strike && <span className="mr-2 font-medium text-grey line-through">{row.strike}</span>}
                    <span className={row.strike ? "text-secondary" : ""}>{row.value}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex-1 text-xs leading-relaxed text-grey">{t("combo.note")}</p>
            <Button variant="primary" className="mt-6 w-full" href="/attestation-garantie">
              {t("combo.cta")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Comparatif banque locale : tableau doux, croix corail / coches turquoise. */
function Comparatif() {
  const t = useTranslations("compteEuro.compare");
  const rows = t.raw("rows") as { criterion: string; local: string; treepi: string }[];

  return (
    <section className="bg-grey-light">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
            </>
          }
        />
        <div className="card-surface mt-12 overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-grey-light">
                <th className="px-5 py-4 text-left font-bold text-navy">{t("columns.criterion")}</th>
                <th className="px-5 py-4 text-left font-bold text-grey">{t("columns.local")}</th>
                <th className="bg-gradient-to-r from-primary to-primary-light px-5 py-4 text-left font-bold text-white">
                  {t("columns.treepi")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.criterion} className={i % 2 ? "bg-grey-light/50" : "bg-white"}>
                  <td className="px-5 py-3.5 font-medium text-navy">{row.criterion}</td>
                  <td className="px-5 py-3.5 text-grey">
                    <span className="mr-1.5 font-bold text-secondary" aria-hidden>✗</span>
                    {row.local}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-primary">
                    <span className="mr-1.5" aria-hidden>✓</span>
                    {row.treepi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* Bloc confiance ACPR. */
function Confiance() {
  const t = useTranslations("compteEuro.trust");
  const chips = t.raw("chips") as string[];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl bg-primary-lighter/40 p-8">
          <h3 className="font-outfit text-lg font-bold text-navy">{t("title")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-grey">{t("body")}</p>
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
  );
}

function Content() {
  const t = useTranslations("compteEuro");
  return (
    <>
      <HeroCompte />
      <TroisPouvoirs />
      <Procedure />
      <JourneyTabs />
      <Tarif />
      <Comparatif />
      <Confiance />
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
