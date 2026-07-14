import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";
import { PriceCompareBars } from "@/components/landing/Insurances";

/*
 * Page « Tarifs », maquette `wireframe/tarif.png`.
 * Trois blocs numérotés (compte européen, assurance voyage, assurance
 * recours), puis les combinaisons de budget, le bandeau de réassurance,
 * la FAQ tarifs et le CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tarifs.meta" });
  return { title: t("title"), description: t("description") };
}

/* En-tête de bloc produit : pastille numérotée + titre + sous-titre. */
function BlockHeading({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-light font-outfit text-sm font-bold text-white">{number}</span>
        <h2 className="font-outfit text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
      </div>
      <p
        className="mt-3 text-sm leading-relaxed text-grey [&>b]:font-bold [&>b]:text-navy"
        dangerouslySetInnerHTML={{ __html: subtitle }}
      />
    </div>
  );
}

type Row = { label: string; value: string; strike?: string };

/* Ligne label / valeur des cartes de prix. */
function PriceRows({ rows, dark = false }: { rows: Row[]; dark?: boolean }) {
  return (
    <dl className={`flex flex-col divide-y ${dark ? "divide-white/15" : "divide-grey-light"}`}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
          <dt className={dark ? "text-white/80" : "text-grey"}>{row.label}</dt>
          <dd className={`font-bold ${dark ? "text-white" : "text-navy"}`}>
            {row.strike && <span className={`mr-2 line-through ${dark ? "text-white/50" : "text-grey/70"}`}>{row.strike}</span>}
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Content() {
  const t = useTranslations("tarifs");
  const chips = t.raw("hero.chips") as string[];
  const soloRows = t.raw("compte.solo.rows") as Row[];
  const comboRows = t.raw("compte.combo.rows") as Row[];
  const soloFeatures = t.raw("compte.solo.features") as string[];
  const comboFeatures = t.raw("compte.combo.features") as string[];
  const plan1Features = t.raw("voyage.plan1.features") as string[];
  const plan3Features = t.raw("voyage.plan3.features") as string[];
  const ageChips = t.raw("voyage.ageChips") as string[];
  const recoursFeatures = t.raw("recours.features") as string[];
  const combos = t.raw("combos.cards") as { badge: string; title: string; rows: Row[]; total: string; cta: string }[];
  const trust = t.raw("trust") as string[];

  const compareLabels = {
    treepi: t("voyage.compare.treepi"),
    insurerA: t("voyage.compare.insurerA"),
    insurerB: t("voyage.compare.insurerB"),
    days90: t("voyage.compare.days90"),
    days90eco: t("voyage.compare.days90eco"),
    days90std: t("voyage.compare.days90std"),
    note: t("voyage.compare.note"),
  };

  return (
    <>
      {/* Héro sombre */}
      <section className="px-4 pt-4 sm:px-6">
        <div className="mask-treepi mx-auto max-w-7xl rounded-3xl px-6 py-16 text-center sm:px-12">
          <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white">{t("hero.eyebrow")}</span>
          <h1 className="mt-4 font-outfit text-4xl font-bold leading-tight text-white sm:text-5xl">
            {t("hero.title1")}
            <span className="text-gradient-secondary">{t("hero.titleHighlight")}</span>
          </h1>
          <p
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base [&>b]:font-bold [&>b]:text-white"
            dangerouslySetInnerHTML={{ __html: t.raw("hero.subtitle") }}
          />
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {chips.map((chip) => (
              <span key={chip} className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white">
                {chip}
              </span>
            ))}
          </div>
          <p
            className="mt-6 text-xs text-white/75 [&>b]:font-bold [&>b]:text-white"
            dangerouslySetInnerHTML={{ __html: t.raw("hero.note") }}
          />
        </div>
      </section>

      {/* 1 · Compte européen */}
      <section className="bg-white" id="compte">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <BlockHeading number={t("compte.number")} title={t("compte.title")} subtitle={t.raw("compte.subtitle")} />
          <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2">
            {/* Compte seul */}
            <div className="card-surface flex flex-col p-8">
              <span className="self-start rounded-full bg-primary-lighter px-3 py-1 text-xs font-bold text-primary">{t("compte.solo.badge")}</span>
              <h3 className="mt-3 font-outfit text-lg font-bold text-navy">{t("compte.solo.title")}</h3>
              <p className="mt-1 text-xs text-grey [&>b]:font-bold [&>b]:text-navy" dangerouslySetInnerHTML={{ __html: t.raw("compte.solo.audience") }} />
              <div className="mt-5 font-outfit text-4xl font-bold text-navy">
                {t("compte.solo.price")}
                <span className="text-base text-grey"> {t("compte.solo.unit")}</span>
              </div>
              <p className="mt-1 text-xs text-grey [&>b]:font-bold [&>b]:text-primary" dangerouslySetInnerHTML={{ __html: t.raw("compte.solo.priceNote") }} />
              <div className="mt-5">
                <PriceRows rows={soloRows} />
              </div>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-grey-light pt-5 text-sm text-navy/90">
                {soloFeatures.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="font-bold text-primary">✓</span>
                    <span className="[&>b]:font-bold" dangerouslySetInnerHTML={{ __html: f }} />
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-6 w-full" href="/compte-euro">
                {t("compte.solo.cta")}
              </Button>
              <p className="mt-3 text-center text-[11px] text-grey">{t("compte.solo.note")}</p>
            </div>
            {/* Compte + attestation */}
            <div className="relative flex flex-col rounded-2xl border-2 border-secondary bg-white p-8 shadow-[0_16px_50px_rgba(255,101,103,0.15)]">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-secondary to-secondary-light px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {t("compte.combo.flag")}
              </span>
              <span className="self-start rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">{t("compte.combo.badge")}</span>
              <h3 className="mt-3 font-outfit text-lg font-bold text-navy">{t("compte.combo.title")}</h3>
              <p className="mt-1 text-xs text-grey [&>b]:font-bold [&>b]:text-navy" dangerouslySetInnerHTML={{ __html: t.raw("compte.combo.audience") }} />
              <div className="text-gradient-secondary mt-5 font-outfit text-4xl font-bold">
                {t("compte.combo.price")}
                <span className="text-base"> </span>
              </div>
              <div className="text-xs text-grey">{t("compte.combo.unit")}</div>
              <p className="mt-1 text-xs text-grey [&>b]:font-bold [&>b]:text-primary" dangerouslySetInnerHTML={{ __html: t.raw("compte.combo.priceNote") }} />
              <div className="mt-5">
                <PriceRows rows={comboRows} />
              </div>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-grey-light pt-5 text-sm text-navy/90">
                {comboFeatures.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="font-bold text-secondary">✓</span>
                    <span className="[&>b]:font-bold" dangerouslySetInnerHTML={{ __html: f }} />
                  </li>
                ))}
              </ul>
              <Button variant="primary" className="mt-6 w-full" href="/attestation-garantie">
                {t("compte.combo.cta")}
              </Button>
              <p className="mt-3 text-center text-[11px] text-grey">{t("compte.combo.note")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Assurance voyage */}
      <section className="bg-grey-light" id="assurance-voyage">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <BlockHeading number={t("voyage.number")} title={t("voyage.title")} subtitle={t.raw("voyage.subtitle")} />
          <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2">
            {/* Formule 1 mois */}
            <div className="card-surface flex flex-col p-8">
              <span className="self-start rounded-full bg-primary-lighter px-3 py-1 text-xs font-bold text-primary">{t("voyage.plan1.badge")}</span>
              <h3 className="mt-3 font-outfit text-lg font-bold text-navy">{t("voyage.plan1.title")}</h3>
              <p className="mt-1 text-xs text-grey [&>b]:font-bold [&>b]:text-navy" dangerouslySetInnerHTML={{ __html: t.raw("voyage.plan1.audience") }} />
              <div className="mt-5 font-outfit text-4xl font-bold text-navy">
                {t("voyage.plan1.price")}
                <span className="text-base text-grey"> {t("voyage.plan1.unit")}</span>
              </div>
              <div className="text-xs text-grey">{t("voyage.plan1.priceNote")}</div>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-grey-light pt-5 text-sm text-navy/90">
                {plan1Features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="font-bold text-primary">✓</span>
                    <span className="[&>b]:font-bold" dangerouslySetInnerHTML={{ __html: f }} />
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-6 w-full" href="/assurance-voyage#devis">
                {t("voyage.plan1.cta")}
              </Button>
            </div>
            {/* Formule 3 mois */}
            <div className="relative flex flex-col rounded-2xl border-2 border-secondary bg-white p-8 shadow-[0_16px_50px_rgba(255,101,103,0.15)]">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-secondary to-secondary-light px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {t("voyage.mostChosen")}
              </span>
              <span className="self-start rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">{t("voyage.plan3.badge")}</span>
              <h3 className="mt-3 font-outfit text-lg font-bold text-navy">{t("voyage.plan3.title")}</h3>
              <p className="mt-1 text-xs text-grey [&>b]:font-bold [&>b]:text-navy" dangerouslySetInnerHTML={{ __html: t.raw("voyage.plan3.audience") }} />
              <div className="text-gradient-secondary mt-5 font-outfit text-4xl font-bold">
                {t("voyage.plan3.price")}
                <span className="text-base"> {t("voyage.plan3.unit")}</span>
              </div>
              <div className="text-xs text-grey">{t("voyage.plan3.priceNote")}</div>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t border-grey-light pt-5 text-sm text-navy/90">
                {plan3Features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="font-bold text-secondary">✓</span>
                    <span className="[&>b]:font-bold" dangerouslySetInnerHTML={{ __html: f }} />
                  </li>
                ))}
              </ul>
              <Button variant="primary" className="mt-6 w-full" href="/assurance-voyage#devis">
                {t("voyage.plan3.cta")}
              </Button>
            </div>
          </div>

          {/* Ajustement selon l'âge */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-navy">{t("voyage.ageNote")}</span>
            {ageChips.map((chip) => (
              <span key={chip} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-navy shadow-sm">
                {chip}
              </span>
            ))}
          </div>

          {/* Comparateur */}
          <div className="card-surface mx-auto mt-8 max-w-3xl p-8">
            <p className="mb-6 text-center text-sm font-bold text-navy">{t("voyage.compare.title")}</p>
            <PriceCompareBars labels={compareLabels} />
          </div>
        </div>
      </section>

      {/* 3 · Assurance recours */}
      <section className="bg-white" id="assurance-recours">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <BlockHeading number={t("recours.number")} title={t("recours.title")} subtitle={t.raw("recours.subtitle")} />
          <div className="mt-10 grid gap-8 rounded-3xl bg-gradient-to-br from-primary to-primary-light p-8 sm:p-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white">{t("recours.eyebrow")}</span>
              <h3 className="mt-3 font-outfit text-2xl font-bold leading-snug text-white sm:text-3xl">{t("recours.cardTitle")}</h3>
              <p
                className="mt-4 text-sm leading-relaxed text-white/90 [&>b]:font-bold [&>b]:text-white"
                dangerouslySetInnerHTML={{ __html: t.raw("recours.cardBody") }}
              />
              <ul className="mt-6 flex flex-col gap-3 text-sm text-white/85">
                {recoursFeatures.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/25 text-[10px] text-white">✓</span>
                    <span className="[&>b]:font-bold [&>b]:text-white" dangerouslySetInnerHTML={{ __html: f }} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center rounded-2xl bg-white p-8 text-center shadow-[0_16px_50px_rgba(5,160,199,0.25)]">
              <div className="text-xs font-bold uppercase tracking-widest text-grey">{t("recours.priceLabel")}</div>
              <div className="text-gradient-secondary mt-3 font-outfit text-5xl font-bold">{t("recours.price")}</div>
              <div className="mt-1 text-xs text-grey">{t("recours.priceNote")}</div>
              <p
                className="mt-5 rounded-xl bg-grey-light p-3 text-xs text-navy/80 [&>b]:font-bold [&>b]:text-navy"
                dangerouslySetInnerHTML={{ __html: t.raw("recours.coverage") }}
              />
              <Button variant="primary" className="mt-6" href="/assurance-recours">
                {t("recours.cta")}
              </Button>
              <p className="mt-4 text-[10px] text-grey/80">{t("recours.note")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Combinaisons de budget */}
      <section className="bg-grey-light" id="combos">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center"><span className="section-eyebrow">{t("combos.eyebrow")}</span></div>
          <h2 className="mt-3 text-center font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl">
            {t("combos.title1")}
            <span className="text-gradient-secondary">{t("combos.titleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-grey">{t("combos.subtitle")}</p>
          <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
            {combos.map((combo, i) => {
              const featured = i === 1;
              return (
                <div
                  key={combo.title}
                  className={`relative flex flex-col rounded-2xl p-7 ${
                    featured ? "border-2 border-secondary bg-white shadow-[0_16px_50px_rgba(255,101,103,0.15)]" : "card-surface"
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-secondary to-secondary-light px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      {t("combos.mostCommon")}
                    </span>
                  )}
                  <div className="text-xs font-bold uppercase tracking-wider text-secondary">{combo.badge}</div>
                  <h3 className="mt-1.5 font-outfit text-lg font-bold text-navy">{combo.title}</h3>
                  <div className="mt-4 flex-1">
                    <PriceRows rows={combo.rows} />
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t-2 border-grey-light pt-4">
                    <span className="text-sm text-grey">{t("combos.budgetTotal")}</span>
                    <span className={`font-outfit text-2xl font-bold ${featured ? "text-gradient-secondary" : "text-navy"}`}>{combo.total}</span>
                  </div>
                  <Button variant={featured ? "primary" : "outline"} className="mt-5 w-full" href="/compte-euro">
                    {combo.cta}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bandeau de réassurance */}
      <section className="border-y border-grey-light bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {trust.map((html, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-grey-light text-sm" aria-hidden>
                {["↩️", "🏛️", "🔎", "💬"][i]}
              </span>
              <p className="text-sm leading-snug text-navy [&>b]:font-bold" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ tarifs (titre simple, sans découpage en deux couleurs) */}
      <TarifsFaq />
      <FinalCta title={t("finalCta.title")} subtitle={t("finalCta.subtitle")} />
    </>
  );
}

/* FAQ de la page tarifs, le titre n'est pas découpé en deux parties. */
function TarifsFaq() {
  const t = useTranslations("tarifs.faq");
  const items = t.raw("items") as { question: string; answer: string }[];
  return (
    <section className="bg-grey-light">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <div className="text-center"><span className="section-eyebrow">{t("eyebrow")}</span></div>
        <h2 className="mt-3 text-center font-outfit text-3xl font-bold text-navy sm:text-4xl">{t("title")}</h2>
        <Accordion className="mt-12" items={items} />
      </div>
    </section>
  );
}

export default async function TarifsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
