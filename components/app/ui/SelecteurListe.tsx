"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

/*
 * Sélecteur en liste déroulante réutilisable (pays, nationalités, villes...).
 * Champ au même gabarit que ChampTexte (label + pilule 42px) qui ouvre un
 * panneau de choix filtrable par recherche. Remplace les couples
 * <input> + <datalist> pour une expérience homogène et un vrai « dropdown ».
 * La saisie dans le champ de recherche filtre la liste ; la sélection ferme
 * le panneau. Ferme au clic extérieur ou à Échap.
 */
export default function SelecteurListe({
  label,
  value,
  onChange,
  options,
  placeholder,
  name,
}: {
  label: string;
  value: string;
  onChange: (valeur: string) => void;
  options: string[];
  placeholder: string;
  name?: string;
}) {
  const c = useTranslations("app.commun");
  const [ouvert, setOuvert] = useState(false);
  const [filtre, setFiltre] = useState("");
  const conteneur = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur / Échap.
  useEffect(() => {
    if (!ouvert) return;
    const surClic = (e: MouseEvent) => {
      if (conteneur.current && !conteneur.current.contains(e.target as Node)) setOuvert(false);
    };
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    window.addEventListener("mousedown", surClic);
    window.addEventListener("keydown", surTouche);
    return () => {
      window.removeEventListener("mousedown", surClic);
      window.removeEventListener("keydown", surTouche);
    };
  }, [ouvert]);

  const filtres = options.filter((o) => o.toLowerCase().includes(filtre.trim().toLowerCase()));

  const choisir = (o: string) => {
    onChange(o);
    setFiltre("");
    setOuvert(false);
  };

  return (
    <div className="relative flex w-full flex-col gap-2" ref={conteneur}>
      <label className="text-xs font-bold leading-[22px] text-dark">{label}</label>

      <button
        type="button"
        name={name}
        onClick={() => setOuvert((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        className={
          "flex h-[42px] w-full items-center gap-3 rounded-xl border bg-white p-3 text-left transition-colors " +
          (ouvert ? "border-primary-light" : "border-grey-100")
        }
      >
        <span className={"min-w-0 flex-1 truncate text-sm font-medium leading-[22px] " + (value ? "text-dark" : "text-grey-300")}>
          {value || placeholder}
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={"shrink-0 text-grey transition-transform " + (ouvert ? "rotate-180" : "")}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {ouvert && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-grey-100 bg-white shadow-app">
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
            {filtres.map((o) => (
              <li key={o}>
                <button
                  type="button"
                  onClick={() => choisir(o)}
                  className={
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-grey-light " +
                    (o === value ? "font-bold text-primary-light" : "text-dark")
                  }
                >
                  {o}
                  {o === value && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
