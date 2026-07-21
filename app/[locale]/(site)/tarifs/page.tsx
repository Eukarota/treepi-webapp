import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import FinalCta from "@/components/landing/FinalCta";
import BandeMasquee from "@/components/landing/BandeMasquee";
import { PriceCompareBars } from "@/components/landing/Insurances";

/*
 * Page « Tarifs » : tu paies ce que tu vois, rien d'autre.
 * Trois blocs produits à gros numéros corail (compte, assurance voyage,
 * recours), puis « l'addition » en tickets de caisse, le bandeau de
 * réassurance, la FAQ « Pas de petites lignes » et le CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tarifs.meta" });
  return { title: t("title"), description: t("description") };
}

type Row = { label: string; value: string; strike?: string };

/* En-tête de bloc produit : gros numéro corail façon « Visa facilité ». */
function BlocTitre({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-end gap-4">
        <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text font-outfit text-6xl font-extrabold leading-none text-transparent sm:text-7xl">
          {number.padStart(2, "0")}
        </span>
        <h2 className="pb-1 font-outfit text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
      </div>
      <p
        className="mt-4 text-sm leading-relaxed text-grey [&>b]:font-bold [&>b]:text-navy"
        dangerouslySetInnerHTML={{ __html: subtitle }}
      />
    </div>
  );
}

/* Lignes label / valeur des cartes de prix. */
function LignesPrix({ rows }: { rows: Row[] }) {
  return (
    <dl className="flex flex-col divide-y divide-grey-light">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
          <dt className="text-grey">{row.label}</dt>
          <dd className="font-bold text-navy">
            {row.strike && <span className="mr-2 font-medium text-grey/70 line-through">{row.strike}</span>}
            <span className={row.strike ? "text-secondary" : ""}>{row.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* Liste de garanties cochées (contenu html : segments en gras). */
function Garanties({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-navy/90">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="mt-0.5 font-bold text-primary" aria-hidden>✓</span>
          <span className="[&>b]:font-bold" dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

/* Héro tarifs : promesse d'honnêteté + les trois prix en un coup d'œil. */
function HeroTarifs() {
  const t = useTranslations("tarifs.hero");
  const chips = t.raw("chips") as string[];

  return (
    <section className="section !py-6 max-sm:!py-2">
      <BandeMasquee className="!min-h-0">
        <div className="relative z-20 px-6 pb-12 pt-12 sm:px-12 md:pb-16 md:pt-16 lg:px-16">
          <div className="max-w-2xl text-white">
            <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white">{t("eyebrow")}</span>
            <h1 className="mt-4 font-outfit text-4xl font-bold leading-tight sm:text-5xl">
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
            </h1>
            <p
              className="mt-5 max-w-xl text-base leading-relaxed text-white/90 [&>b]:font-bold [&>b]:text-white"
              dangerouslySetInnerHTML={{ __html: t.raw("subtitle") }}
            />
          </div>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {chips.map((chip) => (
              <span key={chip} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy shadow-[0_4px_14px_rgba(11,24,52,0.15)]">
                {chip}
              </span>
            ))}
          </div>
          <p
            className="mt-6 max-w-2xl text-xs leading-relaxed text-white/75 [&>b]:font-bold [&>b]:text-white"
            dangerouslySetInnerHTML={{ __html: t.raw("note") }}
          />
        </div>
      </BandeMasquee>
    </section>
  );
}

/* Bloc 01 · Compte européen : seul ou avec attestation. */
function BlocCompte() {
  const t = useTranslations("tarifs.compte");
  const soloRows = t.raw("solo.rows") as Row[];
  const comboRows = t.raw("combo.rows") as Row[];
  const soloFeatures = t.raw("solo.features") as string[];
  const comboFeatures = t.raw("combo.features") as string[];

  return (
    <section className="bg-white" id="compte">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <BlocTitre number={t("number")} title={t("title")} subtitle={t.raw("subtitle")} />
        <div className="mt-10 grid items-stretch gap-8 md:grid-cols-2">
          {/* Compte seul. */}
          <div className="package !m-0 flex flex-col bg-white p-7 sm:p-8">
            <span className="self-start rounded-full bg-primary-lighter px-3 py-1 text-xs font-bold text-primary">{t("solo.badge")}</span>
            <h3 className="mt-3 font-outfit text-xl font-bold text-navy">{t("solo.title")}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-grey [&>b]:font-bold [&>b]:text-navy" dangerouslySetInnerHTML={{ __html: t.raw("solo.audience") }} />
            <div className="mt-5 font-outfit text-4xl font-bold text-navy">
              {t("solo.price")}
              <span className="text-base font-bold text-grey"> {t("solo.unit")}</span>
            </div>
            <p className="mt-1 text-xs text-grey [&>b]:font-bold [&>b]:text-primary" dangerouslySetInnerHTML={{ __html: t.raw("solo.priceNote") }} />
            <div className="mt-5"><LignesPrix rows={soloRows} /></div>
            <div className="mt-5 flex-1"><Garanties items={soloFeatures} /></div>
            <Button variant="outline" className="mt-7 w-full" href="/compte-euro">
              {t("solo.cta")}
            </Button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-grey">{t("solo.note")}</p>
          </div>
          {/* Compte + attestation. */}
          <div className="package package__zen relative !m-0 flex flex-col bg-white p-7 sm:p-8">
            <span className="absolute -top-3.5 left-7 rounded-full bg-gradient-to-r from-secondary to-secondary-light px-3.5 py-1 text-xs font-bold text-white">
              {t("combo.flag")}
            </span>
            <span className="self-start rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">{t("combo.badge")}</span>
            <h3 className="mt-3 font-outfit text-xl font-bold text-navy">{t("combo.title")}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-grey [&>b]:font-bold [&>b]:text-navy" dangerouslySetInnerHTML={{ __html: t.raw("combo.audience") }} />
            <div className="mt-5 font-outfit text-4xl font-bold text-navy">
              {t("combo.price")}
              <span className="text-base font-bold text-grey"> {t("combo.unit")}</span>
            </div>
            <p className="mt-1 text-xs text-grey [&>b]:font-bold [&>b]:text-secondary" dangerouslySetInnerHTML={{ __html: t.raw("combo.priceNote") }} />
            <div className="mt-5"><LignesPrix rows={comboRows} /></div>
            <div className="mt-5 flex-1"><Garanties items={comboFeatures} /></div>
            <Button variant="primary" className="mt-7 w-full" href="/attestation-garantie">
              {t("combo.cta")}
            </Button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-grey">{t("combo.note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Bloc 02 · Assurance voyage : deux formules, l'âge, le comparateur. */
function BlocVoyage() {
  const t = useTranslations("tarifs.voyage");
  const ageChips = t.raw("ageChips") as string[];
  const compare = t.raw("compare") as {
    title: string; treepi: string; insurerA: string; insurerB: string;
    days90: string; days90eco: string; days90std: string; note: string;
  };

  const plans = (["plan1", "plan3"] as const).map((key) => ({
    key,
    badge: t(`${key}.badge`),
    title: t(`${key}.title`),
    audience: t.raw(`${key}.audience`) as string,
    price: t(`${key}.price`),
    unit: t(`${key}.unit`),
    priceNote: t(`${key}.priceNote`),
    features: t.raw(`${key}.features`) as string[],
    cta: t(`${key}.cta`),
  }));

  return (
    <section className="bg-grey-light" id="assurance-voyage">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <BlocTitre number={t("number")} title={t("title")} subtitle={t.raw("subtitle")} />
        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-3">
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
              <h3 className="mt-3 font-outfit text-lg font-bold text-navy">{plan.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-grey [&>b]:font-bold [&>b]:text-navy" dangerouslySetInnerHTML={{ __html: plan.audience }} />
              <div className="mt-4 font-outfit text-4xl font-bold text-navy">
                {plan.price}
                <span className="text-base font-bold text-grey"> {plan.unit}</span>
              </div>
              <p className="mt-1 text-xs text-grey">{plan.priceNote}</p>
              <div className="mt-4 flex-1"><Garanties items={plan.features} /></div>
              <Button variant={i === 1 ? "primary" : "outline"} className="mt-6 w-full" href="/assurance-voyage">
                {plan.cta}
              </Button>
            </div>
          ))}
          {/* Comparateur de prix du marché. */}
          <div className="card-surface flex flex-col justify-center p-7">
            <p className="text-sm font-bold leading-relaxed text-navy">{compare.title}</p>
            <div className="mt-5">
              <PriceCompareBars labels={compare} />
            </div>
          </div>
        </div>
        {/* Ajustement selon l'âge. */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-navy">{t("ageNote")}</span>
          {ageChips.map((chip) => (
            <span key={chip} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-grey shadow-sm">
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Bloc 03 · Assurance recours : la protection, et son prix unique. */
function BlocRecours() {
  const t = useTranslations("tarifs.recours");
  const features = t.raw("features") as string[];

  return (
    <section className="bg-white" id="assurance-recours">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <BlocTitre number={t("number")} title={t("title")} subtitle={t.raw("subtitle")} />
        <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card-surface flex flex-col p-7 sm:p-8">
            <span className="self-start rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">{t("eyebrow")}</span>
            <h3 className="mt-3 font-outfit text-xl font-bold text-navy">{t("cardTitle")}</h3>
            <p
              className="mt-3 text-sm leading-relaxed text-grey [&>b]:font-bold [&>b]:text-navy"
              dangerouslySetInnerHTML={{ __html: t.raw("cardBody") }}
            />
            <div className="mt-5 flex-1"><Garanties items={features} /></div>
          </div>
          {/* Panneau prix, sur dégradé signature. */}
          <div className="flex flex-col rounded-2xl bg-gradient-to-br from-primary to-primary-light p-7 text-white shadow-[0_16px_50px_rgba(5,160,199,0.35)] sm:p-8">
            <div className="text-xs font-bold uppercase tracking-widest text-white/70">{t("priceLabel")}</div>
            <div className="mt-2 font-outfit text-5xl font-bold">{t("price")}</div>
            <p className="mt-1 text-sm text-white/85">{t("priceNote")}</p>
            <p
              className="mt-5 rounded-xl bg-white/10 p-3.5 text-sm leading-relaxed text-white/90 [&>b]:font-bold [&>b]:text-white"
              dangerouslySetInnerHTML={{ __html: t.raw("coverage") }}
            />
            <div className="flex-1" />
            <Button variant="primary" className="mt-6 w-full" href="/assurance-recours">
              {t("cta")}
            </Button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-white/75">{t("note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Ticket de caisse : bord bas en dents de scie, lignes en pointillés. */
function Ticket({
  badge, title, rows, total, cta, featured, totalLabel, rotation, mostCommon,
}: {
  badge: string; title: string; rows: Row[]; total: string; cta: string;
  featured: boolean; totalLabel: string; rotation: string; mostCommon: string;
}) {
  return (
    <div className={`relative transition-transform duration-300 hover:z-10 hover:rotate-0 hover:scale-[1.02] ${rotation}`}>
      {featured && (
        <span className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-secondary to-secondary-light px-3.5 py-1 text-xs font-bold text-white">
          {mostCommon}
        </span>
      )}
      <div className={`flex flex-col bg-white px-6 pb-6 pt-7 shadow-[0_10px_40px_rgba(18,35,71,0.10)] ${featured ? "ring-2 ring-secondary" : ""}`}>
        <span className="self-center rounded-full bg-grey-light px-3 py-1 text-[11px] font-bold text-grey">{badge}</span>
        <h3 className="mt-3 text-center font-outfit text-lg font-bold text-navy">{title}</h3>
        <dl className="mt-5 flex flex-col gap-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline gap-2 text-sm">
              <dt className="text-grey">{row.label}</dt>
              <span className="flex-1 border-b border-dashed border-grey-200" aria-hidden />
              <dd className="font-bold text-navy">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex items-baseline justify-between border-t-2 border-dashed border-grey-200 pt-4">
          <span className="text-sm font-bold uppercase tracking-wider text-navy">{totalLabel}</span>
          <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text font-outfit text-3xl font-bold text-transparent">{total}</span>
        </div>
        <Button variant={featured ? "primary" : "outline"} className="mt-5 w-full" href="/compte-euro">
          {cta}
        </Button>
      </div>
      {/* Dents de scie du bas du ticket. */}
      <div
        className="h-3 w-full"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #fff 50%, transparent 50%), linear-gradient(225deg, #fff 50%, transparent 50%)",
          backgroundSize: "14px 12px",
          backgroundPosition: "0 0, 0 0",
          backgroundRepeat: "repeat-x",
        }}
        aria-hidden
      />
    </div>
  );
}

/* « L'addition, selon ton projet » : trois tickets légèrement de travers. */
function Addition() {
  const t = useTranslations("tarifs.combos");
  const cards = t.raw("cards") as { badge: string; title: string; rows: Row[]; total: string; cta: string }[];
  const rotations = ["lg:-rotate-1", "", "lg:rotate-1"];

  return (
    <section className="bg-grey-light">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4"><span className="section-eyebrow">{t("eyebrow")}</span></div>
          <h2 className="font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-5xl">
            {t("title1")}
            <span className="text-gradient-secondary">{t("titleHighlight")}</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-grey">{t("subtitle")}</p>
          {/* Annotation manuscrite, clin d'œil de serveur. */}
          <span className="pointer-events-none absolute -right-4 -top-6 hidden rotate-6 font-caveat text-2xl text-secondary lg:block xl:-right-20">
            {t("annotation")}
          </span>
        </div>
        <div className="mt-14 grid items-start gap-8 md:grid-cols-3">
          {cards.map((card, i) => (
            <Ticket
              key={card.title}
              badge={card.badge}
              title={card.title}
              rows={card.rows}
              total={card.total}
              cta={card.cta}
              featured={i === 1}
              totalLabel={t("budgetTotal")}
              rotation={rotations[i]}
              mostCommon={t("mostCommon")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* Bandeau de réassurance : quatre promesses tenues. */
function Reassurance() {
  const t = useTranslations("tarifs");
  const items = t.raw("trust") as string[];

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item} className="flex gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-lighter text-sm font-bold text-primary" aria-hidden>✓</span>
            <p
              className="text-sm leading-relaxed text-grey [&>b]:font-bold [&>b]:text-navy"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* FAQ « Pas de petites lignes ». */
function FaqTarifs() {
  const t = useTranslations("tarifs.faq");
  const items = t.raw("items") as { question: string; answer: string }[];
  const accordeon: AccordionItem[] = items.map((i) => ({ question: i.question, answer: i.answer }));

  return (
    <section className="bg-grey-light">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <div className="text-center"><span className="section-eyebrow">{t("eyebrow")}</span></div>
        <h2 className="mt-3 text-center font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl">{t("title")}</h2>
        <Accordion className="mt-12" items={accordeon} />
      </div>
    </section>
  );
}

function Content() {
  const t = useTranslations("tarifs");
  return (
    <>
      <HeroTarifs />
      <BlocCompte />
      <BlocVoyage />
      <BlocRecours />
      <Addition />
      <Reassurance />
      <FaqTarifs />
      <FinalCta title={t("finalCta.title")} subtitle={t("finalCta.subtitle")} />
    </>
  );
}

export default async function TarifsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
