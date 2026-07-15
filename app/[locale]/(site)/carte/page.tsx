import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/pages/PageHero";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";

/*
 * Page « Carte », maquette `wireframe/carte.png`.
 * Sections : héro sombre + carte 3D, bandeau de badges, parcours 5 étapes,
 * livraison, avantages, tarifs 3 plans, FAQ, CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "carte.meta" });
  return { title: t("title"), description: t("description") };
}

/* La carte Mastercard Treepi, reconstruite en CSS. */
function CardMock() {
  return (
    <div className="mx-auto w-full max-w-sm rotate-6 rounded-2xl border border-white/40 bg-gradient-to-br from-primary-light to-primary p-6 shadow-[0_30px_60px_rgba(11,24,52,0.3)] transition-transform duration-500 hover:rotate-3">
      <div className="font-outfit text-lg font-bold text-white">
        Tr<span className="text-secondary-light">ee</span>pi
      </div>
      <div className="mt-8 h-8 w-11 rounded-md bg-secondary-light/90" aria-hidden />
      <div className="mt-4 font-outfit text-lg font-bold tracking-[0.2em] text-white">5282 •••• •••• 8842</div>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-xs font-bold uppercase tracking-wider text-white/80">AWA DIALLO</div>
        {/* Logo Mastercard stylisé */}
        <div className="flex" aria-hidden>
          <span className="h-8 w-8 rounded-full bg-[#EB001B]/90" />
          <span className="-ml-3 h-8 w-8 rounded-full bg-[#F79E1B]/90" />
        </div>
      </div>
    </div>
  );
}

function Content() {
  const t = useTranslations("carte");
  const trust = t.raw("hero.trust") as string[];
  const steps = t.raw("journey.steps") as { title: string; description: string }[];
  const deliveryCards = t.raw("delivery.cards") as { title: string; description: string; badge?: string }[];
  const advantageCards = t.raw("advantages.cards") as { emoji: string; title: string; description: string }[];
  const plans = t.raw("pricing.plans") as { name: string; price: string; unit: string; features: string[]; cta: string }[];

  return (
    <>
      {/* Héro sombre spécifique à la carte */}
      <section className="px-4 pt-4 sm:px-6">
        <div className="mask-treepi relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
          <div className="relative z-10 grid items-center gap-10 px-6 py-14 sm:px-12 md:grid-cols-[1.1fr_0.9fr] md:py-20 lg:px-16">
            <div className="text-white">
              <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white">{t("hero.eyebrow")}</span>
              <h1 className="mt-3 font-outfit text-4xl font-bold leading-tight sm:text-5xl">
                {t("hero.title1")}
                <span className="text-gradient-secondary">{t("hero.titleHighlight")}</span>
                {t("hero.title2")}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90">{t("hero.subtitle")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="primary" size="lg" href="/tarifs">
                  {t("hero.ctaPrimary")}
                </Button>
                <Button variant="white" size="lg" href="#parcours">
                  {t("hero.ctaSecondary")}
                </Button>
              </div>
            </div>
            <CardMock />
          </div>
          {/* Bandeau de badges */}
          <div className="relative z-10 border-t border-white/20 bg-white/10 px-6 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {trust.map((item) => (
                <span key={item} className="text-xs font-bold text-white">
                  <span aria-hidden>✓</span> {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parcours en 5 étapes */}
      <section className="bg-white" id="parcours">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("journey.eyebrow")}
            title={
              <>
                {t("journey.title1")}
                <span className="text-gradient-secondary">{t("journey.titleHighlight")}</span>
              </>
            }
            subtitle={t("journey.subtitle")}
          />
          <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Ligne de connexion (desktop) */}
            <div className="absolute left-0 right-0 top-4 hidden h-0.5 bg-grey-light lg:block" aria-hidden />
            {steps.map((step, i) => (
              <div key={step.title} className="relative text-center">
                <span className="relative z-10 mx-auto grid h-8 w-8 place-items-center rounded-full bg-gradient-to-r from-secondary to-secondary-light text-xs font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-bold text-navy">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-grey">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Livraison */}
      <section className="bg-grey-light">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("delivery.eyebrow")}
            title={
              <>
                {t("delivery.title1")}
                <span className="text-gradient-secondary">{t("delivery.titleHighlight")}</span>
              </>
            }
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {deliveryCards.map((card, i) => (
              <div key={card.title} className="card-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-xl" aria-hidden>
                  {["🏠", "📍"][i]}
                </span>
                <h3 className="mt-4 font-outfit text-lg font-bold text-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-grey">{card.description}</p>
                {card.badge && (
                  <span className="mt-4 inline-flex rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary">
                    {card.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("advantages.eyebrow")}
            title={
              <>
                {t("advantages.title1")}
                <span className="text-gradient-secondary">{t("advantages.titleHighlight")}</span>
              </>
            }
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {advantageCards.map((card) => (
              <div key={card.title} className="rounded-2xl bg-grey-light p-7">
                <div className="text-2xl" aria-hidden>{card.emoji}</div>
                <h3 className="mt-3 font-outfit text-base font-bold text-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-grey">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="bg-grey-light">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow={t("pricing.eyebrow")}
            title={
              <>
                {t("pricing.title1")}
                <span className="text-gradient-secondary">{t("pricing.titleHighlight")}</span>
              </>
            }
          />
          <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
            {plans.map((plan, i) => {
              const featured = i === 1;
              return (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl p-8 ${
                    featured
                      ? "border-2 border-secondary bg-white shadow-[0_16px_50px_rgba(255,101,103,0.18)]"
                      : "card-surface"
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-secondary to-secondary-light px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      {t("pricing.mostChosen")}
                    </span>
                  )}
                  <h3 className="text-center font-outfit text-lg font-bold text-primary">{plan.name}</h3>
                  <div className="mt-2 text-center font-outfit text-4xl font-bold text-navy">
                    {plan.price}
                    <span className="text-base text-grey">{plan.unit}</span>
                  </div>
                  <ul className="mt-6 flex flex-1 flex-col divide-y divide-grey-light text-sm text-navy/90">
                    {plan.features.map((f) => (
                      <li key={f} className="py-2.5">
                        <span className="mr-1.5 font-bold text-primary">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant={featured ? "primary" : "dark"} className="mt-6 w-full" href="/tarifs">
                    {plan.cta}
                  </Button>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-grey">{t("pricing.note")}</p>
        </div>
      </section>

      <PageFaq namespace="carte.faq" tone="white" />
      <FinalCta
        title={t("finalCta.title")}
        subtitle={t("finalCta.subtitle")}
        primaryLabel={t("finalCta.cta")}
        primaryHref="/tarifs"
      />
    </>
  );
}

export default async function CartePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
