import { useTranslations } from "next-intl";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";

/*
 * Bloc FAQ des pages produit : titre en deux teintes
 * (navy + dégradé corail) et accordéon du design system.
 */
export default function PageFaq({
  namespace,
  tone = "grey",
}: {
  namespace: string; // ex. « compteEuro.faq »
  tone?: "grey" | "white";
}) {
  const t = useTranslations(namespace);
  const items = t.raw("items") as AccordionItem[];

  return (
    <section className={tone === "grey" ? "bg-grey-light" : "bg-white"}>
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <div className="text-center"><span className="section-eyebrow">{t("eyebrow")}</span></div>
        <h2 className="mt-3 text-center font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl">
          {t("title1")}
          <span className="text-gradient-secondary">{t("titleHighlight")}</span>
        </h2>
        <Accordion className="mt-12" items={items} />
      </div>
    </section>
  );
}
