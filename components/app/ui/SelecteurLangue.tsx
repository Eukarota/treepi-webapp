"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

/*
 * Sélecteur de langue de l'app. Deux langues (FR/EN) : un simple bouton qui
 * bascule vers l'autre, en conservant la page courante. Deux variantes :
 *  - "barre" : globe + libellé, pour la colonne latérale dépliée et le profil ;
 *  - "icone" : globe + code, compact, pour la colonne latérale repliée.
 */

/** Globe à la Apple (une langue n'est pas un pays, donc pas de drapeau). */
function Globe({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={"size-[18px] shrink-0 " + className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9z" />
    </svg>
  );
}

export default function SelecteurLangue({ variante = "barre" }: { variante?: "barre" | "icone" }) {
  const t = useTranslations("app.commun");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const cible = locale === "fr" ? "en" : "fr";
  const basculer = () => router.replace(pathname, { locale: cible });

  if (variante === "icone") {
    return (
      <button
        type="button"
        onClick={basculer}
        title={`${t("langue")} : ${locale.toUpperCase()}`}
        aria-label={`${t("langue")} : ${locale.toUpperCase()}`}
        className="flex w-full flex-col items-center gap-0.5 rounded-xl py-2 text-grey transition-colors hover:bg-grey-light"
      >
        <Globe />
        <span className="text-[10px] font-bold uppercase leading-none">{locale}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={basculer}
      aria-label={`${t("langue")} : ${locale.toUpperCase()}`}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-grey transition-colors hover:bg-grey-light"
    >
      <Globe />
      <span className="flex-1 text-left text-sm font-medium text-dark">{t("langue")}</span>
      <span className="text-sm font-bold uppercase text-primary-light">{locale}</span>
    </button>
  );
}
