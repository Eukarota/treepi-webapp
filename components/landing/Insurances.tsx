import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";

/*
 * Section « Les assurances » (« Arrête d'être un pigeon. ») :
 *  – carte comparateur de prix avec barres (Treepi vs assureurs classiques) ;
 *  – carte « 60 M€ » assurance recours ;
 *  – bandeau sombre « Visa refusé ? … remboursée ».
 */

/* Barres comparatives : Treepi en dégradé, concurrents en gris. */
export function PriceCompareBars({
  labels,
}: {
  labels: { treepi: string; insurerA: string; insurerB: string; days90: string; days90eco: string; days90std: string; note: string };
}) {
  const rows = [
    { name: labels.treepi, meta: labels.days90, price: "60 €", width: "28%", treepi: true },
    { name: labels.insurerA, meta: labels.days90eco, price: "≈ 150 €", width: "62%", treepi: false },
    { name: labels.insurerB, meta: labels.days90std, price: "≈ 250 €", width: "86%", treepi: false },
  ];
  return (
    <div>
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.name} className="grid grid-cols-[90px_1fr] items-center gap-3">
            <div className="text-right">
              <div className={`text-sm font-bold ${row.treepi ? "text-navy" : "text-grey"}`}>{row.name}</div>
              <div className="text-[10px] text-grey">{row.meta}</div>
            </div>
            <div
              className={`flex h-9 min-w-fit items-center whitespace-nowrap rounded-lg px-2.5 text-xs font-bold text-white sm:px-3 ${
                row.treepi ? "bg-gradient-to-r from-primary to-primary-light" : "bg-grey/40"
              }`}
              style={{ width: row.width }}
            >
              {row.price}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[10px] leading-relaxed text-grey">{labels.note}</p>
    </div>
  );
}

export default function Insurances() {
  const t = useTranslations("landing.insurances");

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Assurance voyage : comparaison de prix */}
          <div className="card-surface p-8 transition-shadow duration-300 hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-xl" aria-hidden>🛡️</span>
            <h3 className="mt-4 font-outfit text-xl font-bold text-navy">{t("voyage.title")}</h3>
            <div className="mt-1 text-sm font-bold text-secondary">{t("voyage.tagline")}</div>
            <div className="mt-6">
              <PriceCompareBars
                labels={{
                  treepi: t("voyage.treepi"),
                  insurerA: t("voyage.insurerA"),
                  insurerB: t("voyage.insurerB"),
                  days90: t("voyage.days90"),
                  days90eco: t("voyage.days90eco"),
                  days90std: t("voyage.days90std"),
                  note: t("voyage.note"),
                }}
              />
            </div>
            <Button variant="primary" className="mt-6 w-full" href="/assurance-voyage">
              {t("voyage.cta")}
            </Button>
          </div>

          {/* Assurance recours : la statistique 60 M€ */}
          <div className="card-surface flex flex-col p-8 transition-shadow duration-300 hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary/10 text-xl" aria-hidden>⚖️</span>
            <h3 className="mt-4 font-outfit text-xl font-bold text-navy">{t("recours.title")}</h3>
            <div className="mt-1 text-sm font-bold text-secondary">{t("recours.tagline")}</div>
            <div className="text-gradient-secondary mt-6 font-outfit text-6xl font-bold">{t("recours.stat")}</div>
            <p
              className="mt-4 flex-1 text-sm leading-relaxed text-grey [&>b]:font-bold [&>b]:text-navy"
              dangerouslySetInnerHTML={{ __html: t.raw("recours.body") }}
            />
            <Button variant="outline" className="mt-6 w-full" href="/assurance-recours">
              {t("recours.cta")}
            </Button>
          </div>
        </div>

        {/* Bandeau remboursement */}
        <div className="mt-6 flex items-start gap-4 rounded-2xl bg-gradient-to-r from-primary to-primary-light p-6">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/20 text-base" aria-hidden>↩️</span>
          <p
            className="text-sm leading-relaxed text-white/95 [&>b]:font-bold [&>b]:text-white"
            dangerouslySetInnerHTML={{ __html: t.raw("banner") }}
          />
        </div>
      </div>
    </section>
  );
}
