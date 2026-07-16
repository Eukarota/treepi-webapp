"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import ChampTexte from "@/components/app/ui/ChampTexte";
import BoutonApp from "@/components/app/ui/BoutonApp";

/*
 * Étape de paiement par carte, partagée par les flux de services (packs
 * d'accompagnement, recours visa, assurance...). Champs de carte + récapitulatif
 * fourni par le parent + bouton de validation. La saisie carte est simulée :
 * aucune donnée n'est transmise, le parent déclenche l'appel API à la validation.
 */
export default function EtapePaiement({
  recap,
  libelle,
  onPayer,
  envoi = false,
}: {
  /** Récapitulatif affiché sous les champs (lignes de montant, total...). */
  recap: ReactNode;
  /** Libellé du bouton de validation (ex. « Payer 100 € »). */
  libelle: string;
  onPayer: () => void;
  envoi?: boolean;
}) {
  const t = useTranslations("app.flux.paiement");
  const [carte, setCarte] = useState({ numero: "", exp: "", cvc: "", titulaire: "" });
  const complete = carte.numero.trim().length >= 12 && carte.exp.trim().length >= 4 && carte.cvc.trim().length >= 3;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("titre")}</h2>
      <ChampTexte label={t("numero")} name="num" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={carte.numero} onChange={(e) => setCarte({ ...carte, numero: e.target.value })} />
      <div className="flex gap-3">
        <ChampTexte label={t("exp")} name="exp" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" value={carte.exp} onChange={(e) => setCarte({ ...carte, exp: e.target.value })} />
        <ChampTexte label={t("cvc")} name="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={carte.cvc} onChange={(e) => setCarte({ ...carte, cvc: e.target.value })} />
      </div>
      <ChampTexte label={t("titulaire")} name="titulaire" autoComplete="cc-name" placeholder="Awa Diallo" value={carte.titulaire} onChange={(e) => setCarte({ ...carte, titulaire: e.target.value })} />

      {recap}

      <div className="mt-auto pt-4">
        <BoutonApp disabled={!complete || envoi} onClick={onPayer}>
          {libelle}
        </BoutonApp>
      </div>
    </div>
  );
}
