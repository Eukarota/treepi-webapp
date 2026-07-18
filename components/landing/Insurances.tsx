import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";

/*
 * Section « Les assurances » (reproduction 1:1 de la home live) :
 *  – titre centré, dernier mot en dégradé corail ;
 *  – sous-titre gris centré ;
 *  – deux colonnes : liste des garanties couvertes (puce ronde turquoise
 *    + coche) suivie d'un CTA dégradé corail, face à une illustration.
 * Le comparateur de prix (PriceCompareBars) reste exporté pour les pages
 * Tarifs et Assurance voyage qui le réutilisent.
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

  // Découpe du titre pour teinter le dernier mot en dégradé corail,
  // sans coder le texte en dur (il reste piloté par les traductions).
  const titre = t("title");
  const mots = titre.split(" ");
  const dernierMot = mots.pop() ?? "";
  const debutTitre = mots.join(" ");

  // Garanties couvertes, construites à partir de notre copie existante.
  const garanties = [
    t("voyage.title"),
    t("voyage.tagline"),
    t("recours.title"),
    t("recours.tagline"),
  ];

  return (
    <section className="bg-grey-light">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          title={
            <>
              {debutTitre}{" "}
              <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                {dernierMot}
              </span>
            </>
          }
          subtitle={t("subtitle")}
        />

        <div className="mt-14 grid items-center gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-16">
          {/* Colonne texte : liste des garanties + CTA corail */}
          <div className="mx-auto w-full max-w-md lg:mx-0">
            <ul className="flex flex-col gap-y-6 text-left text-base font-medium text-navy max-md:text-sm">
              {garanties.map((garantie) => (
                <li key={garantie} className="flex items-center gap-x-4 max-md:gap-x-3">
                  {/* Pastille turquoise clair + coche du design system */}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-lighter">
                    <img
                      src="/images/icons/check_circle.svg"
                      alt=""
                      aria-hidden
                      className="h-5 w-5"
                    />
                  </span>
                  {garantie}
                </li>
              ))}
            </ul>

            <Button variant="primary" size="lg" className="mt-10 w-full sm:w-auto" href="/assurance-recours">
              {t("recours.cta")}
            </Button>
          </div>

          {/* Colonne illustration : assurance voyage */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="/images/travel_insurance.svg"
              alt=""
              aria-hidden
              className="h-auto w-full max-w-sm lg:max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
