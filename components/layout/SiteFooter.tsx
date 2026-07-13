import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/*
 * Pied de page du site (structure de la maquette) :
 * logo + slogan, trois colonnes de liens, puis le paragraphe légal.
 */
export default function SiteFooter() {
  const t = useTranslations("common.footer");
  const nav = useTranslations("common.nav");

  const columns: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t("products"),
      links: [
        { label: nav("compteEuro"), href: "/compte-euro" },
        { label: nav("assuranceVoyage"), href: "/assurance-voyage" },
        { label: nav("assuranceRecours"), href: "/assurance-recours" },
        { label: nav("carte"), href: "/carte" },
      ],
    },
    {
      title: t("resources"),
      links: [
        { label: t("howItWorks"), href: "/attestation-garantie" },
        { label: t("faq"), href: "/#faq" },
        { label: t("simulator"), href: "/#simulator" },
        { label: t("sponsor"), href: "/recharge" },
        { label: nav("tarifs"), href: "/tarifs" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("blog"), href: "/blog" },
        { label: t("whatsapp"), href: "https://wa.me/33000000000" },
        { label: t("legal"), href: "/#" },
        { label: t("privacy"), href: "/#" },
      ],
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary-light to-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Marque */}
          <div>
            <img src="/logo-white.svg" alt="Treepi" className="h-9 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/85">{t("tagline")}</p>
          </div>
          {/* Colonnes de liens */}
          {columns.map((col) => (
            <div key={col.title}>
              <div className="font-outfit text-sm font-bold text-white">{col.title}</div>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-10 border-white/20" />
        <p className="text-xs leading-relaxed text-white/70">{t("disclaimer")}</p>
        <p className="mt-4 text-xs text-white/70">{t("rights")}</p>
      </div>
    </footer>
  );
}
