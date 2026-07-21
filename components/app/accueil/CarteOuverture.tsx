"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Swirl from "@/components/ui/Swirl";

/*
 * Carte du parcours d'ouverture : remplace la carte du solde tant que le
 * compte Euro n'est pas actif. Deux variantes selon la machine à états :
 *  – « ouvrir » (défaut) : pas de dossier, porte d'entrée du produit bancaire ;
 *  – « paiement » : dossier signé, reprise du paiement d'ouverture.
 * Reprend le gabarit visuel de la carte du solde (dégradé turquoise, volute,
 * coins 20px) pour occuper le même emplacement dans la grille du dashboard.
 */
export default function CarteOuverture({ variante = "ouvrir" }: { variante?: "ouvrir" | "paiement" }) {
  const t = useTranslations("app.accueil.ouverture");
  const paiement = variante === "paiement";

  return (
    <Link
      href={paiement ? "/app/compte-euro/paiement" : "/app/compte-euro"}
      data-tuto="carte"
      className="group relative block overflow-hidden rounded-[20px] bg-gradient-to-br from-primary-light to-primary p-5 text-white shadow-app transition-transform hover:-translate-y-0.5 lg:p-8"
    >
      <Swirl className="absolute inset-0 h-full w-full mix-blend-soft-light" />
      <div className="relative flex flex-col items-start gap-2 lg:max-w-md">
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold leading-4">
          {paiement ? t("paiementBadge") : t("badge")}
        </span>
        <h2 className="font-outfit text-2xl font-bold leading-8">{paiement ? t("paiementTitre") : t("titre")}</h2>
        <p className="text-[13px] leading-[18px] text-white/90">{paiement ? t("paiementTexte") : t("texte")}</p>
        <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-primary-light transition-transform group-hover:scale-[1.03]">
          {paiement ? t("paiementCta") : t("cta")}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
