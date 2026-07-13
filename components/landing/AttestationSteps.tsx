import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";

/*
 * « L'attestation de garantie financière » : les trois étapes 01 / 02 / 03,
 * numérotées en grand dégradé corail comme sur le site historique.
 */
export default function AttestationSteps() {
  const t = useTranslations("landing.attestation");
  const steps = t.raw("steps") as { title: string; description: string }[];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={<span className="[&>b]:font-bold [&>b]:text-navy" dangerouslySetInnerHTML={{ __html: t.raw("subtitle") }} />}
        />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i}>
              <div className="text-gradient-secondary font-outfit text-6xl font-bold">0{i + 1}</div>
              <h3 className="mt-3 font-outfit text-lg font-bold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grey">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
