"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/*
 * Carte « Ajouter mon visa » (maquette « Service/Ajout VISA ») : vignette
 * dégradé turquoise avec le globe au bouclier, titre corail, sous-texte et
 * chevron. Ouvre le flux « Obtention de visa ».
 */
export default function CarteAjoutVisa() {
  const t = useTranslations("app.accueil");

  return (
    <Link
      href="/app/visa"
      className="flex w-full items-center gap-2 overflow-hidden rounded-lg border border-grey-200 bg-white text-left transition-shadow hover:shadow-app"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/app/accueil/ajout-visa.png" alt="" className="h-14 w-[92px] shrink-0 object-cover" />
      <span className="min-w-0 flex-1 py-2">
        <span className="text-gradient-secondary block text-xs font-bold leading-4">{t("ajoutVisaTitre")}</span>
        <span className="block text-xs leading-4 text-dark">{t("ajoutVisaTexte")}</span>
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/app/icons/caret-right.svg" alt="" width={20} height={20} className="mr-3 size-5 shrink-0" />
    </Link>
  );
}
