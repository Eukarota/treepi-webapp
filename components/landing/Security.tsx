import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";

/*
 * « Sécurité & confiance » : six cartes de réassurance.
 * Les icônes emoji sont posées sur des pastilles navy, comme la maquette.
 */
const ICONS: Record<string, string> = {
  lock: "🔒",
  bank: "🏛️",
  verify: "🔎",
  honest: "🤝",
  chat: "💬",
  secure: "🔐",
};

type Card = { icon: string; title: string; description: string };

export default function Security() {
  const t = useTranslations("landing.security");
  const cards = t.raw("cards") as Card[];

  return (
    <section className="bg-white" id="security">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="card-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-lg" aria-hidden>
                {ICONS[card.icon] ?? "✔️"}
              </span>
              <h3 className="mt-4 font-outfit text-base font-bold text-navy">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
