import { useTranslations } from "next-intl";
import { grasDegrade } from "@/components/landing/texte";

/*
 * « Sécurité et fiabilité » : trois cartes gris clair au rayon de 30px,
 * illustration en tête, titre corail en dégradé (40px) et paragraphe dont
 * les mots clés portent le dégradé turquoise. Reproduction du site en
 * production.
 */

type Carte = { title: string; image: string; alt: string; body: string };

export default function Security() {
  const t = useTranslations("landing.security");
  const cartes = t.raw("cards") as Carte[];

  return (
    <section className="section" id="security">
      <h2 className="mx-auto max-w-xs text-center font-outfit text-2xl font-bold max-sm:!text-[31.88px] max-sm:!leading-[42.5px] max-xs:!text-[24px] max-xs:!leading-[32px] lg:max-w-lg lg:text-5xl xl:max-w-2xl xl:text-6xl [&>*]:bg-gradient-to-r [&>*]:bg-clip-text [&>*]:text-transparent">
        <span className="from-primary to-primary-light">{t("title1")}</span>{" "}
        <span className="from-secondary to-secondary-light">{t("title2")}</span>
      </h2>
      <div className="mx-auto mt-16 grid grid-cols-1 items-center justify-center gap-6 max-sm:mt-8 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
        {cartes.map((carte) => (
          <div key={carte.title} className="flex min-h-full flex-col rounded-[30px] bg-grey-light max-md:pb-4">
            <div className="relative h-48 overflow-hidden rounded-tl-3xl rounded-tr-3xl xl:h-[20rem]">
              <img
                src={carte.image}
                alt={carte.alt}
                title={carte.title}
                width={384}
                height={320}
                className="aspect-video h-full w-full object-cover"
              />
            </div>
            <h4 className="px-8 py-4 text-left font-outfit text-[40px] font-bold leading-none max-sm:pl-[24px] max-lg:text-2xl">
              <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                {carte.title}
              </span>
            </h4>
            <div className="flex flex-1 items-start justify-start px-8 text-left max-sm:px-6 md:min-h-[10em]">
              <div className="mb-8 text-black font-medium !leading-[22px] max-md:text-sm max-sm:!mb-0 max-sm:!text-[18.59px] max-sm:!leading-[29.22px] max-xs:!text-[14px] max-xs:!leading-[22px]">
                {grasDegrade(carte.body)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
