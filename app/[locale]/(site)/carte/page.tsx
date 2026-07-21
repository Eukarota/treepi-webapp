import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Swirl from "@/components/ui/Swirl";
import SectionHeading from "@/components/ui/SectionHeading";
import EmailCapture from "@/components/ui/EmailCapture";
import PageFaq from "@/components/pages/PageFaq";
import FinalCta from "@/components/landing/FinalCta";
import BandeMasquee from "@/components/landing/BandeMasquee";

/*
 * Page « Carte » : la Mastercard Treepi, présentée honnêtement (pré-lancement).
 * Sections : héro à bande masquée + photo réelle de la carte, « le monde
 * entier, sans négocier » (pastilles photo), les adieux (ruptures joyeuses),
 * duo virtuelle 01 / physique 02, panneau de contrôle façon app, bloc
 * lancement avec capture email, FAQ, CTA final.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "carte.meta" });
  return { title: t("title"), description: t("description") };
}

/* Héro : copy à gauche, photo réelle de la carte à droite, annotation manuscrite. */
function HeroCarte() {
  const t = useTranslations("carte.hero");
  const trust = t.raw("trust") as string[];

  return (
    <section className="section !py-6 max-sm:!py-2">
      <BandeMasquee className="!min-h-0">
        <div className="relative z-20 grid items-center gap-6 px-6 pb-8 pt-12 sm:px-12 md:grid-cols-[1.05fr_0.95fr] md:pb-12 md:pt-16 lg:px-16">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white">
              <span className="h-2 w-2 rounded-full bg-secondary-light" aria-hidden />
              {t("badge")}
            </span>
            <h1 className="mt-4 font-outfit text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primary" size="lg" href="/compte-euro">
                {t("ctaPrimary")}
              </Button>
              <Button variant="white" size="lg" href="#lancement">
                {t("ctaSecondary")}
              </Button>
            </div>
          </div>
          {/* Photo réelle de la carte, légèrement inclinée, annotation manuscrite. */}
          <div className="relative mx-auto w-full max-w-[340px] md:max-w-[400px]">
            <img
              src="/images/card.webp"
              alt={t("cardAlt")}
              title={t("cardAlt")}
              width={756}
              height={795}
              className="relative z-10 w-full rotate-[8deg] drop-shadow-[0_35px_45px_rgba(11,24,52,0.35)] transition-transform duration-500 hover:rotate-[4deg]"
            />
            {/* Annotation manuscrite sous la carte, flèche vers celle-ci. */}
            <div className="mt-1 flex -rotate-3 items-start justify-center gap-1.5 font-caveat text-2xl text-white sm:text-3xl">
              <svg viewBox="0 0 40 40" className="mt-[-14px] h-9 w-9" fill="none" aria-hidden>
                <path d="M6 34C14 22 22 14 33 7m0 0-9 1m9-1-1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("annotation")}
            </div>
          </div>
        </div>
        {/* Bandeau de badges, dans la bande masquée. */}
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

/* « Le monde entier, sans négocier » : trois pastilles photo cerclées corail. */
function OuiPartout() {
  const t = useTranslations("carte.partout");
  const items = t.raw("items") as { image: string; title: string; description: string }[];

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
          subtitle={t("subtitle")}
        />
        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="text-center">
              <img
                src={item.image}
                alt={item.title}
                title={item.title}
                width={163}
                height={163}
                className="mx-auto h-32 w-32 rounded-full object-cover transition-transform duration-300 hover:scale-105 sm:h-36 sm:w-36"
              />
              <h3 className="mt-5 font-outfit text-lg font-bold text-navy">{item.title}</h3>
              <p className="mx-auto mt-2 max-w-[280px] text-sm leading-relaxed text-grey">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* « Fais tes adieux » : quatre ruptures joyeuses, mention manuscrite corail. */
function Adieux() {
  const t = useTranslations("carte.adieux");
  const items = t.raw("items") as { title: string; description: string }[];

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
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="card-surface relative overflow-hidden p-7 pl-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]"
            >
              {/* « adieu » manuscrit, légèrement incliné, alterné gauche/droite. */}
              <span
                className={`pointer-events-none absolute -top-1 font-caveat text-4xl text-secondary/25 ${
                  i % 2 ? "-rotate-6 right-5" : "rotate-3 right-7"
                }`}
                aria-hidden
              >
                {t("handwritten")}
              </span>
              <h3 className="max-w-[85%] font-outfit text-lg font-bold text-navy">
                <span className="decoration-secondary/70 decoration-[3px] line-through">{item.title}</span>
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-grey">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Mock « wallet » de la carte virtuelle : construit avec les atomes du DS. */
function MockWallet() {
  const t = useTranslations("carte.duo.un.mock");
  return (
    <div className="card-surface mx-auto w-full max-w-sm p-6">
      <div className="text-xs font-bold uppercase tracking-wider text-grey">{t("walletTitle")}</div>
      {/* La carte, en photo réelle recadrée. */}
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-light p-4">
        <Swirl opacite={0.18} />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">{t("cardName")}</div>
            <div className="mt-1 inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">{t("cardState")}</div>
          </div>
          <div className="flex" aria-hidden>
            <span className="h-7 w-7 rounded-full bg-[#EB001B]/90" />
            <span className="-ml-3 h-7 w-7 rounded-full bg-[#F79E1B]/90" />
          </div>
        </div>
      </div>
      <ul className="mt-4 flex flex-col divide-y divide-grey-light text-sm text-navy">
        {[t("applePay"), t("googlePay")].map((ligne) => (
          <li key={ligne} className="flex items-center gap-2.5 py-2.5">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-lighter text-xs font-bold text-primary" aria-hidden>✓</span>
            {ligne}
          </li>
        ))}
        <li className="flex items-center gap-2.5 py-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary/10 text-xs" aria-hidden>🔔</span>
          {t("paid")}
        </li>
      </ul>
    </div>
  );
}

/* Duo 01 / 02 : gros numéros corail façon « Visa facilité » de la home. */
function DuoCartes() {
  const t = useTranslations("carte.duo");

  return (
    <section className="bg-grey-light">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("title1")}
              <span className="text-gradient-secondary">{t("titleHighlight")}</span>
            </>
          }
        />
        <div className="mt-14 grid items-start gap-14 lg:grid-cols-2">
          {/* 01 · la virtuelle */}
          <div>
            <div className="inline-flex bg-gradient-to-r from-secondary to-secondary-light bg-clip-text font-outfit text-7xl font-extrabold text-transparent sm:text-8xl">
              {t("un.num")}
            </div>
            <h3 className="mt-2 font-outfit text-2xl font-bold sm:text-3xl [&>span]:bg-gradient-to-r [&>span]:bg-clip-text [&>span]:text-transparent">
              <span className="from-primary to-primary-light">{t("un.title1")}</span>
              <span className="from-secondary to-secondary-light font-extrabold">{t("un.titleHighlight")}</span>
            </h3>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-grey">{t("un.body")}</p>
            <div className="mt-8">
              <MockWallet />
            </div>
          </div>
          {/* 02 · la physique */}
          <div className="lg:mt-24">
            <div className="inline-flex bg-gradient-to-r from-secondary to-secondary-light bg-clip-text font-outfit text-7xl font-extrabold text-transparent sm:text-8xl">
              {t("deux.num")}
            </div>
            <h3 className="mt-2 font-outfit text-2xl font-bold sm:text-3xl [&>span]:bg-gradient-to-r [&>span]:bg-clip-text [&>span]:text-transparent">
              <span className="from-primary to-primary-light">{t("deux.title1")}</span>
              <span className="from-secondary to-secondary-light font-extrabold">{t("deux.titleHighlight")}</span>
            </h3>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-grey">{t("deux.body")}</p>
            <span className="mt-4 inline-flex rounded-full bg-secondary/10 px-3.5 py-1.5 text-xs font-bold text-secondary">
              {t("deux.badge")}
            </span>
            <div className="relative mt-6 flex justify-center">
              <img
                src="/images/card.webp"
                alt=""
                aria-hidden
                width={756}
                height={795}
                className="w-56 -rotate-[14deg] drop-shadow-[0_25px_35px_rgba(11,24,52,0.25)] sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Interrupteur décoratif du panneau de contrôle (état figé, sans JS). */
function Interrupteur({ actif }: { actif: boolean }) {
  return (
    <span
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        actif ? "bg-gradient-to-r from-primary to-primary-light" : "bg-grey-200"
      }`}
      aria-hidden
    >
      <span className={`absolute h-5 w-5 rounded-full bg-white shadow ${actif ? "right-0.5" : "left-0.5"}`} />
    </span>
  );
}

/* « C'est toi qui décides » : liste des contrôles + panneau façon app. */
function Controle() {
  const t = useTranslations("carte.controle");
  const items = t.raw("items") as { title: string; description: string }[];

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
            <ul className="mt-8 flex flex-col gap-5">
              {items.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-lighter text-sm font-bold text-primary" aria-hidden>✓</span>
                  <div>
                    <div className="font-bold text-navy">{item.title}</div>
                    <p className="mt-0.5 text-sm leading-relaxed text-grey">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Panneau de réglages, comme dans l'app. */}
          <div className="card-surface mx-auto w-full max-w-sm p-6">
            <div className="flex items-center justify-between">
              <div className="font-outfit text-lg font-bold text-navy">{t("mock.title")}</div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-lighter px-2.5 py-1 text-[11px] font-bold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                {t("mock.state")}
              </span>
            </div>
            <div className="mt-5 flex flex-col divide-y divide-grey-light text-sm font-medium text-navy">
              <div className="flex items-center justify-between py-3.5">
                {t("mock.freeze")}
                <Interrupteur actif={false} />
              </div>
              <div className="flex items-center justify-between py-3.5">
                {t("mock.online")}
                <Interrupteur actif />
              </div>
              <div className="flex items-center justify-between py-3.5">
                {t("mock.contactless")}
                <Interrupteur actif />
              </div>
              <div className="py-3.5">
                <div className="flex items-center justify-between">
                  {t("mock.cap")}
                  <span className="font-bold text-primary">{t("mock.capValue")}</span>
                </div>
                {/* Jauge du plafond. */}
                <div className="mt-2.5 h-2 rounded-full bg-grey-light">
                  <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-primary to-primary-light" />
                </div>
              </div>
              <div className="flex items-center justify-between py-3.5">
                {t("mock.notif")}
                <Interrupteur actif />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Bloc lancement : le mot honnête + capture email, sur bande dégradée. */
function Lancement() {
  const t = useTranslations("carte.lancement");
  return (
    <section className="px-4 py-10 sm:px-6" id="lancement">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary-light px-6 py-16 sm:px-12">
        <Swirl />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="font-outfit text-3xl font-bold leading-tight text-white sm:text-4xl">
            {t("title1")}
            <span className="text-gradient-secondary">{t("titleHighlight")}</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/90 sm:text-base">{t("body")}</p>
          <div className="mt-8 [&_form]:!bg-white">
            <EmailCapture placeholder={t("placeholder")} />
          </div>
          <Button variant="white" size="lg" href="/compte-euro" className="mt-2">
            {t("ctaCompte")}
          </Button>
        </div>
      </div>
    </section>
  );
}

function Content() {
  const t = useTranslations("carte");
  return (
    <>
      <HeroCarte />
      <OuiPartout />
      <Adieux />
      <DuoCartes />
      <Controle />
      <Lancement />
      <PageFaq namespace="carte.faq" tone="grey" />
      <FinalCta
        title={t("finalCta.title")}
        subtitle={t("finalCta.subtitle")}
        primaryLabel={t("finalCta.cta")}
        primaryHref="/compte-euro"
      />
    </>
  );
}

export default async function CartePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
