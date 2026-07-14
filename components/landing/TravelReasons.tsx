import { useTranslations } from "next-intl";

/*
 * « Je voyage pour … » : le titre au mot défilant, repris du site historique.
 * L'animation text-slide (keyframes Tailwind) fait défiler les six motifs.
 */
export default function TravelReasons() {
  const t = useTranslations("landing.travel");
  const reasons = t.raw("reasons") as string[];

  return (
    <section className="bg-white pb-4 pt-10">
      <h2 className="text-center font-outfit text-3xl font-bold leading-tight sm:text-5xl">
        <span className="text-gradient-primary">{t("title")}</span>
        <br />
        <span className="inline-flex h-[2.5rem] flex-col overflow-hidden sm:h-[3.9rem]">
          <ul className="animate-text-slide text-center leading-none [&_li]:block [&_li]:whitespace-nowrap [&_li]:py-1">
            {reasons.map((reason) => (
              <li key={reason} className="text-gradient-secondary leading-none">
                {reason}
              </li>
            ))}
          </ul>
        </span>
      </h2>
    </section>
  );
}
