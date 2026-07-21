import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";
import RechargeSimulator from "@/components/pages/RechargeSimulator";
import BandeMasquee from "@/components/landing/BandeMasquee";

/*
 * Page « Recharge » : ton argent voyage avant toi.
 * Sections : héro à bande masquée + carte de conversion vivante, trois
 * méthodes avec leur délai en vedette, pas-à-pas relié à un suivi façon
 * colis, simulateur interactif, conseils manuscrits, FAQ, CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recharge.meta" });
  return { title: t("title"), description: t("description") };
}

/* Carte de conversion du héro : dépôt en FCFA, arrivée en euros. */
function CarteConversion() {
  const t = useTranslations("recharge.hero.mock");
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-2xl bg-white p-6 shadow-[0_25px_60px_rgba(11,24,52,0.25)]">
        <div className="text-[10px] font-bold uppercase tracking-widest text-grey">{t("sendLabel")}</div>
        <div className="mt-1 font-outfit text-2xl font-bold text-navy">{t("sendValue")}</div>
        {/* Flèche de trajet, avec l'heure d'arrivée. */}
        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-secondary to-secondary-light" aria-hidden />
          <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-bold text-secondary">{t("arrival")}</span>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-r from-secondary to-secondary-light text-xs text-white" aria-hidden>
            ↓
          </span>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-grey">{t("receiveLabel")}</div>
        <div className="text-gradient-primary mt-1 font-outfit text-3xl font-bold">{t("receiveValue")}</div>
        <div className="mt-5 flex flex-col gap-1.5 rounded-xl bg-grey-light p-3 text-xs text-grey">
          <span><span className="font-bold text-primary" aria-hidden>✓</span> {t("rate")}</span>
          <span><span className="font-bold text-primary" aria-hidden>✓</span> {t("fees")}</span>
        </div>
      </div>
    </div>
  );
}

/* Héro : bande masquée, copy à gauche, conversion à droite. */
function HeroRecharge() {
  const t = useTranslations("recharge.hero");
  const trust = t.raw("trust") as string[];

  return (
    <section className="section !py-6 max-sm:!py-2">
      <BandeMasquee className="!min-h-0">
        <div className="relative z-20 grid items-center gap-10 px-6 pb-6 pt-12 sm:px-12 md:grid-cols-[1.1fr_0.9fr] md:pb-8 md:pt-16 lg:px-16">
          <div className="text-white">
            <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white">{t("badge")}</span>
            <h1 className="mt-4 font-outfit text-4xl font-bold leading-tight sm:text-5xl">
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" size="lg" href="#simulateur">
                {t("ctaPrimary")}
              </Button>
              <Button variant="white" size="lg" href="#methodes">
                {t("ctaSecondary")}
              </Button>
            </div>
          </div>
          <div>
            <CarteConversion />
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
            {trust.map((item) => (
              <span key={item} className="text-xs font-bold text-white/90">
                <span className="text-secondary-light" aria-hidden>✓</span> {item}
              </span>
            ))}
          </div>
        </div>
      </BandeMasquee>
    </section>
  );
}

/* Trois méthodes, le délai en vedette. */
function Methodes() {
  const t = useTranslations("recharge.methods");
  const cards = t.raw("cards") as { title: string; delay: string; flag?: string; description: string; note: string }[];
  const currencies = t.raw("currencies") as string[];

  return (
    <section className="bg-grey-light" id="methodes">
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
        <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className={`relative flex flex-col rounded-2xl bg-white p-7 transition-all duration-300 hover:-translate-y-1 ${
                i === 0
                  ? "border-2 border-secondary shadow-[0_16px_50px_rgba(255,101,103,0.15)]"
                  : "card-surface hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]"
              }`}
            >
              {card.flag && (
                <span className="absolute -top-3.5 left-7 rounded-full bg-gradient-to-r from-secondary to-secondary-light px-3.5 py-1 text-xs font-bold text-white">
                  {card.flag}
                </span>
              )}
              <h3 className="font-outfit text-lg font-bold text-navy">{card.title}</h3>
              {/* Le délai, en très grand : c'est le vrai critère de choix. */}
              <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-grey">{t("delayLabel")}</div>
              <div className="text-gradient-primary font-outfit text-3xl font-bold">{card.delay}</div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-grey">{card.description}</p>
              <span className="mt-5 self-start rounded-full bg-grey-light px-3 py-1.5 text-xs font-bold text-navy/70">{card.note}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {currencies.map((devise) => (
            <span key={devise} className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-primary shadow-sm">
              {devise}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Pas-à-pas + carte de suivi façon colis. */
function PasAPas() {
  const t = useTranslations("recharge.steps");
  const items = t.raw("items") as { title: string; description: string }[];
  const states = t.raw("tracker.states") as { label: string; time: string }[];

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
              {items.map((item, i) => (
                <li key={item.title} className="relative flex gap-4 pb-7 last:pb-0">
                  {/* Trait de liaison vertical entre les numéros. */}
                  {i < items.length - 1 && (
                    <span className="absolute left-[15px] top-9 h-[calc(100%-36px)] w-0.5 bg-gradient-to-b from-secondary/40 to-secondary/10" aria-hidden />
                  )}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-r from-secondary to-secondary-light font-outfit text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-bold text-navy">{item.title}</div>
                    <p className="mt-0.5 text-sm leading-relaxed text-grey">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {/* Suivi de recharge, comme on suit un colis. */}
          <div className="card-surface mx-auto w-full max-w-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-outfit text-lg font-bold text-navy">{t("tracker.title")}</div>
                <div className="text-xs text-grey">{t("tracker.amount")}</div>
              </div>
              <span className="rounded-full bg-primary-lighter px-3 py-1.5 font-outfit text-sm font-bold text-primary">
                {t("tracker.credit")}
              </span>
            </div>
            <ol className="mt-6 flex flex-col">
              {states.map((state, i) => (
                <li key={state.label} className="relative flex gap-3.5 pb-6 last:pb-0">
                  {i < states.length - 1 && (
                    <span className="absolute left-[11px] top-7 h-[calc(100%-28px)] w-0.5 bg-primary/25" aria-hidden />
                  )}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-r from-primary to-primary-light text-[11px] font-bold text-white" aria-hidden>
                    ✓
                  </span>
                  <div className="flex flex-1 items-baseline justify-between gap-2">
                    <span className="text-sm font-bold text-navy">{state.label}</span>
                    <span className="text-xs text-grey">{state.time}</span>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 rounded-xl bg-grey-light p-3 text-xs leading-relaxed text-grey">
              <span aria-hidden>🔔</span> {t("tracker.notif")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Conseils : trois cartes, note manuscrite corail en coin. */
function Conseils() {
  const t = useTranslations("recharge.practices");
  const cards = t.raw("cards") as { note: string; title: string; description: string }[];

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
            <div key={card.title} className="card-surface relative p-7 pt-9">
              <span
                className={`pointer-events-none absolute right-6 top-2 font-caveat text-2xl text-secondary ${
                  i % 2 ? "-rotate-3" : "rotate-2"
                }`}
                aria-hidden
              >
                {card.note}
              </span>
              <h3 className="font-outfit text-lg font-bold text-navy">{card.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-grey">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Content() {
  const t = useTranslations("recharge");
  return (
    <>
      <HeroRecharge />
      <Methodes />
      <PasAPas />
      <RechargeSimulator />
      <Conseils />
      <PageFaq namespace="recharge.faq" tone="white" />
      <FinalCta
        title={t("finalCta.title")}
        subtitle={t("finalCta.subtitle")}
        primaryLabel={t("finalCta.cta")}
        primaryHref="/compte-euro"
      />
    </>
  );
}

export default async function RechargePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
