import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

/*
 * Bandeau d'appel à l'action final, réutilisé sur toutes les pages :
 * fond sombre (ou dégradé Treepi), titre, sous-titre et deux CTA.
 */
export default function FinalCta({
  title,
  subtitle,
  primaryLabel,
  primaryHref = "/compte-euro",
}: {
  title: string;
  subtitle: string;
  primaryLabel?: string;
  primaryHref?: string;
}) {
  const t = useTranslations("common.cta");

  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-primary to-primary-light px-6 py-16 text-center sm:px-12">
        <h2 className="font-outfit text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{subtitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="primary" size="lg" href={primaryHref}>
            {primaryLabel ?? t("openAccount")}
          </Button>
          <Button
            variant="white"
            size="lg"
            href="https://wa.me/33000000000"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("askWhatsapp")}
          </Button>
        </div>
      </div>
    </section>
  );
}
