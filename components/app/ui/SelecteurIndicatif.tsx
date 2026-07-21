"use client";

import { useCallback, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PAYS_AFRIQUE, drapeauEmoji } from "@/lib/data/afrique";
import PanneauDeroulant from "@/components/app/ui/PanneauDeroulant";

/*
 * Sélecteur d'indicatif téléphonique (inscription, phase téléphone).
 * Limité aux pays africains : fermé, il montre le drapeau + l'indicatif du
 * pays choisi ; ouvert, un panneau filtrable liste drapeau + nom + indicatif.
 * Même gabarit et mêmes interactions que SelecteurListe (panneau en portail
 * via PanneauDeroulant, recherche), la valeur échangée est le code ISO du pays.
 */
export default function SelecteurIndicatif({
  valeur,
  onChange,
}: {
  /** Code ISO 3166-1 alpha-2 du pays sélectionné. */
  valeur: string;
  onChange: (iso: string) => void;
}) {
  const c = useTranslations("app.commun");
  const t = useTranslations("app.inscription.telephone");
  const locale = useLocale();
  const [ouvert, setOuvert] = useState(false);
  const [filtre, setFiltre] = useState("");
  const conteneur = useRef<HTMLDivElement>(null);
  const fermer = useCallback(() => setOuvert(false), []);

  const choisi = PAYS_AFRIQUE.find((p) => p.iso === valeur) ?? PAYS_AFRIQUE[0];
  const nom = (p: (typeof PAYS_AFRIQUE)[number]) => (locale === "en" ? p.nomEn : p.nom);

  // Recherche sur le nom du pays ou l'indicatif (« cam », « +237 », « 237 »).
  const requete = filtre.trim().toLowerCase();
  const filtres = PAYS_AFRIQUE.filter(
    (p) => nom(p).toLowerCase().includes(requete) || p.indicatif.replace("+", "").includes(requete.replace("+", ""))
  );

  const choisir = (iso: string) => {
    onChange(iso);
    setFiltre("");
    setOuvert(false);
  };

  return (
    <div className="relative shrink-0" ref={conteneur}>
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-label={t("indicatifLabel")}
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        className={
          "flex h-[42px] items-center gap-1.5 rounded-xl border bg-white px-3 transition-colors " +
          (ouvert ? "border-primary-light" : "border-grey-100")
        }
      >
        <span aria-hidden>{drapeauEmoji(choisi.iso)}</span>
        <span className="text-sm font-medium text-dark">{choisi.indicatif}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={"shrink-0 text-grey transition-transform " + (ouvert ? "rotate-180" : "")}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {ouvert && (
        <PanneauDeroulant ancre={conteneur} largeur={256} onFermer={fermer}>
          <div className="border-b border-grey-100 p-2">
            <input
              autoFocus
              value={filtre}
              onChange={(e) => setFiltre(e.target.value)}
              placeholder={c("recherche")}
              className="h-9 w-full rounded-lg bg-grey-light px-3 text-sm text-dark outline-none placeholder:text-grey-300"
            />
          </div>
          <ul role="listbox" className="max-h-52 overflow-y-auto py-1">
            {filtres.length === 0 && <li className="px-3 py-2 text-sm text-grey">{c("aucunResultat")}</li>}
            {filtres.map((p) => (
              <li key={p.iso}>
                <button
                  type="button"
                  onClick={() => choisir(p.iso)}
                  className={
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-grey-light " +
                    (p.iso === valeur ? "font-bold text-primary-light" : "text-dark")
                  }
                >
                  <span aria-hidden>{drapeauEmoji(p.iso)}</span>
                  <span className="min-w-0 flex-1 truncate">{nom(p)}</span>
                  <span className={p.iso === valeur ? "" : "text-grey"}>{p.indicatif}</span>
                </button>
              </li>
            ))}
          </ul>
        </PanneauDeroulant>
      )}
    </div>
  );
}
