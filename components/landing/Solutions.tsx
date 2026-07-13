import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";

/*
 * « Nos solutions » : trois cartes produit.
 * La carte centrale (compte européen) est mise en avant avec la
 * pastille « Populaire » et une bordure dégradé corail.
 */

type SolutionCard = {
  title: string;
  description: string;
  cta: string;
  features: string[];
  href: string;
};

function Check() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-lighter" aria-hidden>
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4l2.5 2.5L9 1" stroke="#05a0c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function Solutions() {
  const t = useTranslations("landing.solutions");
  const common = useTranslations("common.cta");
  const cards = t.raw("cards") as SolutionCard[];

  return (
    <section className="bg-white" id="solutions">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {cards.map((card, i) => {
            const featured = i === 1; // La carte « compte européen » est mise en avant.
            return (
              <div
                key={card.href}
                className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                  featured
                    ? "border-2 border-secondary bg-white shadow-[0_16px_50px_rgba(255,101,103,0.18)] hover:shadow-[0_22px_60px_rgba(255,101,103,0.25)] lg:-mt-4"
                    : "card-surface hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]"
                }`}
              >
                {featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-secondary to-secondary-light px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    {t("popular")}
                  </span>
                )}
                <h3 className="font-outfit text-xl font-bold text-navy">{card.title}</h3>
                <p
                  className="mt-2 text-sm leading-relaxed text-grey [&>b]:font-bold [&>b]:text-navy"
                  dangerouslySetInnerHTML={{ __html: card.description }}
                />
                <Button variant={featured ? "primary" : "outline"} className="mt-5 w-full" href={card.href}>
                  {card.cta}
                </Button>
                <ul className="mt-6 flex flex-col gap-3.5 border-t border-grey-light pt-6">
                  {card.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-navy/90">
                      <Check />
                      <span className="[&>b]:font-bold" dangerouslySetInnerHTML={{ __html: f }} />
                    </li>
                  ))}
                </ul>
                <Link
                  href={card.href}
                  className={`mt-6 inline-flex items-center gap-1 text-sm font-bold transition-colors ${
                    featured ? "text-secondary hover:text-navy" : "text-primary hover:text-navy"
                  }`}
                >
                  {common("learnMore")} <span aria-hidden>→</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
