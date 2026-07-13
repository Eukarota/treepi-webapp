import { useTranslations } from "next-intl";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import SectionHeading from "@/components/ui/SectionHeading";

/*
 * FAQ de la page d'accueil : « Les questions qu'on nous pose vraiment ».
 * Un seul élément ouvert à la fois (comportement de l'accordéon du DS).
 */
export default function LandingFaq() {
  const t = useTranslations("landing.faq");
  const items = t.raw("items") as { question: string; answer: string }[];

  return (
    <section className="bg-white" id="faq">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <Accordion className="mt-12" items={items as AccordionItem[]} />
      </div>
    </section>
  );
}
