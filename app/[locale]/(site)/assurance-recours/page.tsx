import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";
import BandeMasquee from "@/components/landing/BandeMasquee";

/*
 * Page « Assurance recours visa » : un refus n'est pas la fin.
 * Sections : héro avec le refus qui devient recours (deux documents),
 * les chiffres qui fâchent, situations couvertes, parcours en cinq
 * étapes + repères, le prix unique et son mot d'honnêteté, FAQ, CTA.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "assuranceRecours.meta" });
  return { title: t("title"), description: t("description") };
}

/* Le refus qui devient recours : deux documents superposés. */
function DocumentsRecours() {
  const t = useTranslations("assuranceRecours.hero.mock");
  return (
    <div className="relative mx-auto w-full max-w-sm pb-16 pt-2">
      {/* La notification de refus, légèrement inclinée, en retrait. */}
      <div className="w-[88%] -rotate-2 rounded-2xl bg-white p-5 opacity-90 shadow-[0_15px_40px_rgba(11,24,52,0.2)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-navy">{t("docTitle")}</div>
            <div className="mt-0.5 text-[11px] text-grey">{t("docSub")}</div>
          </div>
          {/* Tampon corail. */}
          <span className="rotate-[8deg] rounded-md border-2 border-secondary px-2 py-0.5 text-xs font-extrabold uppercase tracking-widest text-secondary">
            {t("stamp")}
          </span>
        </div>
        {/* Lignes de texte simulées. */}
        <div className="mt-4 flex flex-col gap-2" aria-hidden>
          <span className="h-2 w-4/5 rounded bg-grey-light" />
          <span className="h-2 w-3/5 rounded bg-grey-light" />
          <span className="h-2 w-2/3 rounded bg-grey-light" />
        </div>
      </div>
      {/* Le recours, posé par-dessus, qui reprend la main. */}
      <div className="absolute bottom-6 right-0 w-[88%] rotate-1 rounded-2xl bg-white p-5 shadow-[0_25px_60px_rgba(11,24,52,0.3)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-navy">{t("appealTitle")}</div>
            <div className="mt-0.5 text-[11px] text-grey">{t("appealSub")}</div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-lighter px-2.5 py-1 text-[11px] font-bold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            {t("badge")}
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-2" aria-hidden>
          <span className="h-2 w-3/4 rounded bg-primary-lighter" />
          <span className="h-2 w-1/2 rounded bg-primary-lighter" />
        </div>
      </div>
    </div>
  );
}

/* Héro : la promesse, et le refus qui se retourne. */
function HeroRecours() {
  const t = useTranslations("assuranceRecours.hero");
  return (
    <section className="section !py-6 max-sm:!py-2">
      <BandeMasquee className="!min-h-0">
        <div className="relative z-20 grid items-center gap-8 px-6 pb-12 pt-12 sm:px-12 md:grid-cols-[1.1fr_0.9fr] md:pb-16 md:pt-16 lg:px-16">
          <div className="text-white">
            <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white">{t("badge")}</span>
            <h1 className="mt-4 font-outfit text-4xl font-bold leading-tight sm:text-5xl">
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90">{t("subtitle")}</p>
            <div className="mt-8">
              <Button variant="primary" size="lg" href="#prix">
                {t("cta")}
              </Button>
            </div>
            {/* Annotation manuscrite. */}
            <div className="mt-8 flex -rotate-2 items-end gap-1.5 font-caveat text-2xl sm:text-3xl md:justify-end md:pr-4">
              {t("annotation")}
              <svg viewBox="0 0 40 40" className="mb-1 h-9 w-9" fill="none" aria-hidden>
                <path d="M6 33C16 29 26 21 33 8m0 0-8 4m8-4 1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <DocumentsRecours />
        </div>
      </BandeMasquee>
    </section>
  );
}

/* Les chiffres qui fâchent : trois grands nombres en dégradé. */
function Chiffres() {
  const t = useTranslations("assuranceRecours.stats");
  const items = t.raw("items") as { value: string; label: string }[];

  return (
    <section className="bg-white">
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
        <div className="mt-12 grid gap-10 text-center sm:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.value}>
              <div
                className={`bg-gradient-to-r bg-clip-text font-outfit text-5xl font-extrabold text-transparent sm:text-6xl ${
                  i === 2 ? "from-primary to-primary-light" : "from-secondary to-secondary-light"
                }`}
              >
                {item.value}
              </div>
              <p className="mx-auto mt-3 max-w-[260px] text-sm leading-relaxed text-grey">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Situations couvertes. */
function Couvert() {
  const t = useTranslations("assuranceRecours.covered");
  const cards = t.raw("cards") as { title: string; description: string }[];

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
            <div key={card.title} className="card-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-lg text-white" aria-hidden>
                {["📄", "⚖️", "🤝"][i]}
              </span>
              <h3 className="mt-4 font-outfit text-base font-bold text-navy">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Parcours en cinq étapes + repères à droite. */
function Parcours() {
  const t = useTranslations("assuranceRecours.journey");
  const steps = t.raw("steps") as { title: string; description: string }[];
  const aside = t.raw("aside") as { value: string; label: string }[];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <div className="mb-4"><span className="section-eyebrow">{t("eyebrow")}</span></div>
            <h2 className="font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl">
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-grey">{t("subtitle")}</p>
            <ol className="mt-8 flex flex-col">
              {steps.map((step, i) => (
                <li key={step.title} className="relative flex gap-4 pb-7 last:pb-0">
                  {i < steps.length - 1 && (
                    <span className="absolute left-[15px] top-9 h-[calc(100%-36px)] w-0.5 bg-gradient-to-b from-secondary/40 to-secondary/10" aria-hidden />
                  )}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-r from-secondary to-secondary-light font-outfit text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-bold text-navy">{step.title}</div>
                    <p className="mt-0.5 text-sm leading-relaxed text-grey">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {/* Les trois repères qui rassurent. */}
          <div className="flex flex-col gap-5">
            {aside.map((item) => (
              <div key={item.value} className="card-surface flex items-center gap-5 p-6">
                <div className="shrink-0 whitespace-nowrap bg-gradient-to-r from-primary to-primary-light bg-clip-text font-outfit text-2xl font-extrabold text-transparent">
                  {item.value}
                </div>
                <p className="text-sm leading-relaxed text-grey">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Le prix unique, et le mot d'honnêteté. */
function Prix() {
  const t = useTranslations("assuranceRecours.price");
  return (
    <section className="bg-grey-light" id="prix">
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
        <div className="mt-12 grid items-stretch gap-8 md:grid-cols-[0.9fr_1.1fr]">
          {/* Panneau prix sur dégradé signature. */}
          <div className="flex flex-col rounded-2xl bg-gradient-to-br from-primary to-primary-light p-8 text-white shadow-[0_16px_50px_rgba(5,160,199,0.35)]">
            <div className="text-xs font-bold uppercase tracking-widest text-white/70">{t("label")}</div>
            <div className="mt-2 font-outfit text-5xl font-bold">{t("price")}</div>
            <p className="mt-1 text-sm text-white/85">{t("priceNote")}</p>
            <p
              className="mt-5 rounded-xl bg-white/10 p-3.5 text-sm leading-relaxed text-white/90 [&>b]:font-bold [&>b]:text-white"
              dangerouslySetInnerHTML={{ __html: t.raw("coverage") }}
            />
            <div className="flex-1" />
            <Button variant="primary" className="mt-6 w-full" href="/tarifs#assurance-recours">
              {t("cta")}
            </Button>
            <p className="mt-3 text-center text-[11px] text-white/75">{t("note")}</p>
          </div>
          {/* Le mot d'honnêteté, en manuscrit. */}
          <div className="card-surface flex flex-col justify-center p-8">
            <div className="-rotate-1 font-caveat text-3xl text-secondary">{t("honestTitle")}</div>
            <p className="mt-4 text-base leading-relaxed text-navy/85">{t("honest")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Content() {
  const t = useTranslations("assuranceRecours");
  return (
    <>
      <HeroRecours />
      <Chiffres />
      <Couvert />
      <Parcours />
      <Prix />
      <PageFaq namespace="assuranceRecours.faq" tone="white" />
      <FinalCta
        title={t("finalCta.title")}
        subtitle={t("finalCta.subtitle")}
        primaryLabel={t("finalCta.cta")}
        primaryHref="/tarifs#assurance-recours"
      />
    </>
  );
}

export default async function AssuranceRecoursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
