"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconeCheck, IconeCopier } from "./icones";

/*
 * Ligne d'information copiable (IBAN, BIC, référence...) : libellé, valeur et
 * bouton copier qui bascule en coche pendant ~1,5 s. Utilisée par les écrans
 * RIB (Recharge par virement, Recevoir).
 */
export default function LigneCopiable({ label, valeur }: { label: string; valeur: string }) {
  const c = useTranslations("app.commun");
  const [copie, setCopie] = useState(false);

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(valeur.replace(/\s/g, ""));
      setCopie(true);
      window.setTimeout(() => setCopie(false), 1500);
    } catch {
      // Presse-papiers indisponible : on ignore silencieusement.
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] leading-4 text-grey">{label}</p>
        <p className="truncate text-sm font-bold leading-5 text-dark">{valeur}</p>
      </div>
      <button
        type="button"
        onClick={copier}
        aria-label={c(copie ? "copie" : "copier")}
        className="grid size-8 shrink-0 place-items-center rounded-full text-primary-light transition-colors hover:bg-grey-light"
      >
        {copie ? <IconeCheck className="size-4" /> : <IconeCopier className="size-4" />}
      </button>
    </div>
  );
}
