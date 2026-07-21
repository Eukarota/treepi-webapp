"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { DEVISES, Devise, convertir, historiqueTaux, tauxEntre, tauxParEuro, trouverDevise } from "@/lib/api/change";
import { useTauxTempsReel } from "@/lib/hooks/useTaux";

/*
 * « Simulateur de transfert » du tableau de bord, fonctionnel : courbe du taux
 * (tracée en SVG à partir de la série de lib/api/change), source + clause, deux
 * champs de montant convertis en direct (saisie libre, sans les flèches
 * natives), chaque devise choisie via une pastille cliquable, bouton
 * d'inversion et CTA « Transférer » (flux à venir).
 */

/** Pastille ronde d'une devise : symbole sur fond de marque. */
function PastilleDevise({ devise, taille = 20 }: { devise: Devise; taille?: number }) {
  const classeTexte = devise.symbole.length <= 1 ? "text-[11px]" : devise.symbole.length === 2 ? "text-[9px]" : "text-[8px]";
  return (
    <span
      className={"grid shrink-0 place-items-center rounded-full font-bold leading-none text-white " + classeTexte}
      style={{ width: taille, height: taille, background: devise.couleur }}
      aria-hidden
    >
      {devise.symbole}
    </span>
  );
}

/** Chip devise + menu déroulant (ferme au clic extérieur). */
function SelecteurDevise({
  valeur,
  autre,
  onChange,
  label,
}: {
  valeur: string;
  /** Devise déjà utilisée de l'autre côté (désactivée dans la liste). */
  autre: string;
  onChange: (code: string) => void;
  label: string;
}) {
  const [ouvert, setOuvert] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const devise = trouverDevise(valeur);

  useEffect(() => {
    if (!ouvert) return;
    const auClic = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOuvert(false);
    };
    document.addEventListener("mousedown", auClic);
    return () => document.removeEventListener("mousedown", auClic);
  }, [ouvert]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        aria-label={label}
        className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-1.5 transition-colors hover:bg-grey-light"
      >
        <PastilleDevise devise={devise} />
        <span className="text-sm font-bold text-dark">{devise.code}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={"text-grey transition-transform " + (ouvert ? "rotate-180" : "")}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {ouvert && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-30 mt-1 max-h-64 w-56 overflow-auto rounded-2xl border border-grey-200 bg-white p-1.5 shadow-app"
        >
          {DEVISES.map((d) => {
            const actif = d.code === valeur;
            const desactive = d.code === autre;
            return (
              <li key={d.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={actif}
                  disabled={desactive}
                  onClick={() => {
                    onChange(d.code);
                    setOuvert(false);
                  }}
                  className={
                    "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors " +
                    (desactive ? "cursor-not-allowed opacity-40" : actif ? "bg-primary-lighter/40" : "hover:bg-grey-light")
                  }
                >
                  <PastilleDevise devise={d} taille={22} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold leading-4 text-dark">{d.code}</span>
                    <span className="block truncate text-[11px] leading-4 text-grey">{d.nom}</span>
                  </span>
                  {actif && (
                    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden className="text-primary-light">
                      <path d="M11.5 4L6 9.5 3 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Courbe du taux tracée en SVG à partir de la série de points. */
function CourbeTaux({ points }: { points: number[] }) {
  const L = 300;
  const H = 90;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const marge = max - min || max * 0.01;
  const bas = min - marge * 0.6;
  const haut = max + marge * 0.6;
  const x = (i: number) => (i / (points.length - 1)) * L;
  const y = (v: number) => H - 10 - ((v - bas) / (haut - bas)) * (H - 20);

  const ligne = points.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const aire = `${ligne} L${L},${H} L0,${H} Z`;
  const dx = x(points.length - 1);
  const dy = y(points[points.length - 1]);

  return (
    <svg viewBox={`0 0 ${L} ${H}`} className="w-full" role="img" aria-label="Évolution du taux de change">
      <defs>
        <linearGradient id="aire-taux" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#09d1c7" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#09d1c7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={aire} fill="url(#aire-taux)" />
      <path d={ligne} fill="none" stroke="#09d1c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={dx} cy={dy} r="3.5" fill="#09d1c7" stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

/** Parse une saisie libre (« 196 787 » / « 1,08 ») en nombre. */
function versNombre(saisie: string): number {
  const n = parseFloat(saisie.replace(/\s/g, "").replace(",", "."));
  return Number.isNaN(n) ? 0 : n;
}

export default function SimulateurTransfert() {
  const t = useTranslations("app.accueil");
  const locale = useLocale();

  // Charge les taux réels et recalcule le simulateur à chaque mise à jour.
  const derniereMaj = useTauxTempsReel();

  // deviseA = ligne du haut, deviseB = ligne du bas. `montant` est la saisie
  // brute du côté `cote` ; l'autre côté est calculé.
  const [deviseA, setDeviseA] = useState("XOF");
  const [deviseB, setDeviseB] = useState("EUR");
  const [montant, setMontant] = useState("300");
  const [cote, setCote] = useState<"A" | "B">("B");

  const nf = useMemo(
    () => (v: number) => new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", { maximumFractionDigits: v >= 100 ? 0 : 2 }).format(v),
    [locale]
  );

  const saisi = versNombre(montant);
  const valeurA = cote === "A" ? montant : nf(convertir(saisi, deviseB, deviseA));
  const valeurB = cote === "B" ? montant : nf(convertir(saisi, deviseA, deviseB));

  // Taux affiché : on part de la devise la plus « forte » (taux/EUR le plus
  // petit) pour un nombre lisible, ex. « 1 EUR = 655,957 CFA ».
  const [forte, faible] = tauxParEuro(deviseA) <= tauxParEuro(deviseB) ? [deviseA, deviseB] : [deviseB, deviseA];
  const taux = tauxEntre(forte, faible);
  const serie = historiqueTaux(forte, faible, 30);
  const tauxFmt = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", { maximumFractionDigits: taux >= 100 ? 3 : 4 }).format(taux);

  // Dates de l'axe (fenêtre glissante de 30 jours jusqu'à aujourd'hui).
  const dfmt = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long" });
  const aujourdhui = new Date();
  const ilY = (jours: number) => {
    const d = new Date(aujourdhui);
    d.setDate(d.getDate() - jours);
    return dfmt.format(d);
  };

  const onSaisie = (c: "A" | "B", valeur: string) => {
    // N'accepte que chiffres, espaces et séparateur décimal.
    setMontant(valeur.replace(/[^\d.,\s]/g, ""));
    setCote(c);
  };

  const changerDevise = (c: "A" | "B", code: string) => {
    // Fige la valeur affichée du côté modifié pour éviter un saut de montant.
    if (c === "A") {
      setMontant(valeurA.toString());
      setCote("A");
      setDeviseA(code);
    } else {
      setMontant(valeurB.toString());
      setCote("B");
      setDeviseB(code);
    }
  };

  const inverser = () => {
    const nouveauHaut = cote === "B" ? montant : valeurB.toString();
    setDeviseA(deviseB);
    setDeviseB(deviseA);
    setMontant(nouveauHaut);
    setCote("A");
  };

  // Rendu d'une ligne (fonction, pas un composant : garde le focus du champ).
  const ligne = (c: "A" | "B", devise: string, valeur: string) => (
    <div className="flex h-[46px] items-center gap-2 rounded-xl border border-grey-100 px-3 focus-within:border-primary-light">
      <input
        type="text"
        inputMode="decimal"
        value={valeur}
        onChange={(e) => onSaisie(c, e.target.value)}
        aria-label={trouverDevise(devise).nom}
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-dark outline-none"
      />
      <SelecteurDevise
        valeur={devise}
        autre={c === "A" ? deviseB : deviseA}
        onChange={(code) => changerDevise(c, code)}
        label={t("simulateurChoisirDevise")}
      />
    </div>
  );

  return (
    <section data-tuto="simulateur" className="flex flex-col gap-2">
      <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("simulateurTitre")}</h2>

      <div className="flex flex-col gap-2 rounded-lg border border-grey-200 bg-white p-4">
        <p className="text-center text-[10px] leading-4 text-grey">
          {derniereMaj
            ? t("simulateurTauxReel", {
                heure: new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", { hour: "2-digit", minute: "2-digit" }).format(
                  new Date(derniereMaj)
                ),
              })
            : t("simulateurIndicatif")}
          {" · "}
          <span className="underline">{t("simulateurClause")}</span>
        </p>

        {/* Courbe du taux (série lib/api/change, tracée en SVG). */}
        <div>
          <CourbeTaux points={serie} />
          <div className="flex justify-between px-2 text-[10px] leading-4 text-dark">
            <span>{ilY(29)}</span>
            <span>{ilY(15)}</span>
            <span>{t("simulateurAujourdhui")}</span>
          </div>
        </div>

        <p className="text-center text-[10px] leading-4 text-grey">{t("simulateurEquivalent")}</p>
        <p className="text-center text-[10px] leading-4 text-error">
          {t("simulateurTaux", { source: forte, taux: tauxFmt, cible: faible })}
        </p>

        {/* Ligne du haut. */}
        {ligne("A", deviseA, valeurA)}

        {/* Inversion des devises. */}
        <div className="relative z-10 -my-4 flex justify-center">
          <button
            type="button"
            onClick={inverser}
            aria-label={t("simulateurTitre")}
            className="grid size-9 rotate-90 place-items-center rounded-full bg-gradient-to-r from-secondary to-secondary-light shadow-[0_4px_14px_rgba(255,101,103,0.35)] transition-transform hover:scale-105"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/icons/arrows-left-right.svg" alt="" width={18} height={18} className="size-[18px] brightness-0 invert" />
          </button>
        </div>

        {/* Ligne du bas. */}
        {ligne("B", deviseB, valeurB)}

        <p className="text-center text-[10px] leading-4 text-grey underline">{t("simulateurFrais")}</p>

        <button
          type="button"
          title={t("bientot")}
          className="inline-flex h-[46px] w-full items-center justify-center rounded-full bg-primary-light text-sm font-bold text-white transition-all hover:brightness-105"
        >
          {t("simulateurTransferer")}
        </button>
      </div>
    </section>
  );
}
