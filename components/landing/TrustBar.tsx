import { useTranslations } from "next-intl";

/*
 * Bandeau de réassurance sous le héro : quatre arguments clés,
 * chacun précédé d'une pastille icône.
 */
const ICONS = ["🏛️", "🔎", "🛡️", "⚖️"];

export default function TrustBar() {
  const t = useTranslations("landing.hero");
  const items = t.raw("trust") as string[];

  return (
    <section className="border-b border-grey-light bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {items.map((html, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-grey-light text-sm">{ICONS[i]}</span>
            <p
              className="text-sm leading-snug text-navy [&>b]:font-bold"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
