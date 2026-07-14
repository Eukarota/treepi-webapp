import { useTranslations } from "next-intl";

/*
 * « Ce que Treepi change humainement », l'avant/après du site historique,
 * repensé : chips corail à gauche (avant), chips turquoise à droite (après).
 */

type Item = { icon: string; text: string };

function Chip({ item, tone }: { item: Item; tone: "before" | "after" }) {
  const border = tone === "before" ? "border-secondary/50" : "border-primary-light/60";
  return (
    <li
      className={`flex items-start gap-3 rounded-xl border-2 ${border} bg-white px-4 py-3 shadow-sm transition-transform duration-300 hover:-translate-y-0.5`}
    >
      <img src={item.icon} alt="" className="h-6 w-6 shrink-0" aria-hidden />
      <span className="text-sm font-bold leading-snug text-navy">{item.text}</span>
    </li>
  );
}

export default function Humanly() {
  const t = useTranslations("landing.humanly");
  const before = t.raw("beforeItems") as Item[];
  const after = t.raw("afterItems") as Item[];

  return (
    <section className="bg-grey-light">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-center font-outfit text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          <span className="text-gradient-primary">{t("title1")}</span>{" "}
          <span className="text-gradient-secondary">{t("title2")}</span>
        </h2>

        <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-2">
          <div>
            <div className="text-center font-outfit text-xl font-bold">
              <span className="text-gradient-secondary">{t("before")}</span>{" "}
              <span className="text-gradient-primary">{t("brand")}</span>
            </div>
            <ul className="mt-6 flex flex-col gap-4 md:items-end">
              {before.map((item) => (
                <Chip key={item.text} item={item} tone="before" />
              ))}
            </ul>
          </div>
          <div>
            <div className="text-center font-outfit text-xl font-bold">
              <span className="text-gradient-primary">{t("after")}</span>{" "}
              <span className="text-gradient-secondary">{t("brand")}</span>
            </div>
            <ul className="mt-6 flex flex-col gap-4 md:items-start">
              {after.map((item) => (
                <Chip key={item.text} item={item} tone="after" />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
