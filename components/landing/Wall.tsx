import { useTranslations } from "next-intl";

/*
 * « Le mur des départs » : compteur des Treepers + trois témoignages,
 * chacun coiffé d'une pastille itinéraire (Douala → Paris, etc.).
 */

const AVATARS = [
  "/images/tourist_01.webp",
  "/images/tourist_02.webp",
  "/images/tourist_03.webp",
  "/images/tourist_04.webp",
];

type Testimonial = { route: string; quote: string; name: string; role: string };

export default function Wall() {
  const t = useTranslations("landing.wall");
  const testimonials = t.raw("testimonials") as Testimonial[];

  return (
    <section className="bg-grey-light">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="section-eyebrow text-center">{t("eyebrow")}</div>

        {/* Compteur + avatars */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex -space-x-3">
            {AVATARS.map((src) => (
              <div key={src} className="rounded-full bg-gradient-to-r from-primary to-primary-light p-[2px]">
                <img src={src} alt="" className="h-12 w-12 rounded-full border-2 border-white object-cover sm:h-14 sm:w-14" />
              </div>
            ))}
          </div>
          <div>
            <div className="text-gradient-secondary font-outfit text-3xl font-bold">{t("count")}</div>
            <div className="text-sm font-medium text-primary">{t("caption")}</div>
            <div className="font-outfit text-lg font-bold text-navy">{t("you")}</div>
          </div>
        </div>

        {/* Témoignages */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="card-surface flex flex-col p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(18,35,71,0.12)]"
            >
              <span className="self-start rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
                {item.route}
              </span>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-navy/90">{item.quote}</blockquote>
              <figcaption className="mt-5">
                <div className="text-sm font-bold text-navy">{item.name}</div>
                <div className="text-xs text-grey">{item.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
