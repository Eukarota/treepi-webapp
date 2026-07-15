"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import GabaritEtape from "./GabaritEtape";
import BoutonApp from "@/components/app/ui/BoutonApp";

/*
 * Phase 4 de l'inscription : le numéro de téléphone (maquette « Ton numéro
 * de téléphone ») : sélecteur d'indicatif avec drapeau + champ du numéro.
 * L'authentification SMS sera branchée avec le backend (TODO API).
 */

/** Indicatifs proposés : France + principaux pays d'Afrique francophone. */
const INDICATIFS = [
  { code: "+33", drapeau: "🇫🇷" },
  { code: "+225", drapeau: "🇨🇮" },
  { code: "+221", drapeau: "🇸🇳" },
  { code: "+237", drapeau: "🇨🇲" },
  { code: "+212", drapeau: "🇲🇦" },
  { code: "+216", drapeau: "🇹🇳" },
  { code: "+213", drapeau: "🇩🇿" },
  { code: "+229", drapeau: "🇧🇯" },
  { code: "+228", drapeau: "🇹🇬" },
  { code: "+226", drapeau: "🇧🇫" },
  { code: "+223", drapeau: "🇲🇱" },
  { code: "+224", drapeau: "🇬🇳" },
  { code: "+243", drapeau: "🇨🇩" },
];

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
  const [indicatif, setIndicatif] = useState(INDICATIFS[0].code);
  const [numero, setNumero] = useState("");

  const drapeau = INDICATIFS.find((i) => i.code === indicatif)?.drapeau;
  const numeroValide = numero.replace(/\D/g, "").length >= 8;

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
          {/* Sélecteur d'indicatif : drapeau + code, chevron natif masqué. */}
          <div className="relative flex h-[42px] shrink-0 items-center gap-1 rounded-xl border border-grey-100 bg-white px-3">
            <span aria-hidden>{drapeau}</span>
            <select
              aria-label={t("telephone.label")}
              value={indicatif}
              onChange={(e) => setIndicatif(e.target.value)}
              className="appearance-none bg-transparent pr-4 text-sm font-medium text-dark outline-none"
            >
              {INDICATIFS.map((i) => (
                <option key={i.code} value={i.code}>
                  {i.code}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute right-2 text-[10px] text-grey-700">
              ▾
            </span>
          </div>
          <input
            id="telephone"
            type="tel"
            autoComplete="tel-national"
            inputMode="tel"
            placeholder={t("telephone.placeholder")}
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className="h-[42px] min-w-0 flex-1 rounded-xl border border-grey-100 bg-white p-3 text-sm font-medium leading-[22px] text-dark outline-none transition-colors placeholder:text-grey-300 focus:border-primary-light"
          />
        </div>
      </div>

      <div className="mt-auto pt-8">
        <BoutonApp disabled={!numeroValide || enCours} onClick={() => onTerminee(`${indicatif} ${numero.trim()}`)}>
          {t("continuer")}
        </BoutonApp>
      </div>
    </GabaritEtape>
  );
}
