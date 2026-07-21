"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PAYS_AFRIQUE, chiffresAttendus, formaterNumero } from "@/lib/data/afrique";
import GabaritEtape from "./GabaritEtape";
import BoutonApp from "@/components/app/ui/BoutonApp";
import SelecteurIndicatif from "@/components/app/ui/SelecteurIndicatif";

/*
 * Phase 4 de l'inscription : le numéro de téléphone (maquette « Ton numéro
 * de téléphone ») : sélecteur d'indicatif (pays africains uniquement, avec
 * drapeau) + champ du numéro piloté par les métadonnées du pays choisi :
 * placeholder au format national, formatage à la saisie, longueur maximale
 * et validation client avant de continuer.
 * L'authentification SMS sera branchée avec le backend (TODO API).
 */
export default function PhaseTelephone({
  onTerminee,
  onRetour,
  onQuitter,
  enCours,
}: {
  onTerminee: (telephone: string) => void;
  onRetour: () => void;
  onQuitter: () => void;
  /** Vrai pendant la création du compte (désactive le bouton). */
  enCours: boolean;
}) {
  const t = useTranslations("app.inscription");
  // Côte d'Ivoire par défaut (premier marché de Treepi).
  const [iso, setIso] = useState("CI");
  const [numero, setNumero] = useState("");
  const [touche, setTouche] = useState(false);

  const pays = PAYS_AFRIQUE.find((p) => p.iso === iso) ?? PAYS_AFRIQUE[0];
  const attendu = chiffresAttendus(pays.gabarit);
  const saisis = numero.replace(/\D/g, "").length;
  const numeroValide = saisis === attendu;
  // Erreur montrée après une première sortie du champ (pas pendant la frappe).
  const erreur = touche && numero !== "" && !numeroValide;

  /** Changement de pays : reformate la saisie selon le nouveau gabarit. */
  const changerPays = (nouvelIso: string) => {
    setIso(nouvelIso);
    setTouche(false);
    const gabarit = (PAYS_AFRIQUE.find((p) => p.iso === nouvelIso) ?? pays).gabarit;
    setNumero((n) => formaterNumero(n, gabarit));
  };

  return (
    <GabaritEtape
      phase={3}
      titreAvant={t("phases.telephone.titreAvant")}
      titreCle={t("phases.telephone.titreCle")}
      description={t("phases.telephone.description")}
      onRetour={onRetour}
      onQuitter={onQuitter}
    >
      <div className="flex w-full flex-col gap-2">
        <label htmlFor="telephone" className="text-xs font-bold leading-[22px] text-dark">
          {t("telephone.label")}
        </label>
        <div className="flex gap-2">
          <SelecteurIndicatif valeur={iso} onChange={changerPays} />
          <input
            id="telephone"
            type="tel"
            autoComplete="tel-national"
            inputMode="tel"
            placeholder={pays.gabarit}
            maxLength={pays.gabarit.length}
            value={numero}
            onChange={(e) => setNumero(formaterNumero(e.target.value, pays.gabarit))}
            onBlur={() => setTouche(true)}
            className={
              "h-[42px] min-w-0 flex-1 rounded-xl border bg-white p-3 text-sm font-medium leading-[22px] text-dark outline-none transition-colors placeholder:text-grey-300 " +
              (erreur ? "border-error" : "border-grey-100 focus:border-primary-light")
            }
          />
        </div>
        {erreur && (
          <p className="text-xs leading-4 text-error">
            {t("telephone.erreurFormat", { format: pays.gabarit, attendu })}
          </p>
        )}
      </div>

      <div className="mt-auto pt-8">
        <BoutonApp disabled={!numeroValide || enCours} onClick={() => onTerminee(`${pays.indicatif} ${numero.trim()}`)}>
          {t("continuer")}
        </BoutonApp>
      </div>
    </GabaritEtape>
  );
}
