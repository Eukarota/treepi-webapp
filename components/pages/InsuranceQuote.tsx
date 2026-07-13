"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

/*
 * Devis d'assurance voyage (page assurance-voyage), carte sombre de la maquette.
 * Règles tarifaires : 30 €/pers. ≤ 30 jours, 60 €/pers. de 31 à 90 jours,
 * ajustées par tranche d'âge. Conversion FCFA au taux fixe, à titre indicatif.
 */

const RATE_FCFA = 655.957;

const AGE_BRACKETS = [
  { key: "u18", multiplier: 0.85 },
  { key: "18-40", multiplier: 1 },
  { key: "41-60", multiplier: 1.15 },
  { key: "61-70", multiplier: 1.35 },
  { key: "71-80", multiplier: 1.65 },
] as const;

const COUNTRIES = ["🇫🇷 France", "🇧🇪 Belgique", "🇩🇪 Allemagne", "🇪🇸 Espagne", "🇮🇹 Italie", "🇵🇹 Portugal", "🇳🇱 Pays-Bas"];

export default function InsuranceQuote() {
  const t = useTranslations("assuranceVoyage.quote");
  const ageRows = t.raw("form.ageRows") as { label: string; value: string }[];

  const [country, setCountry] = useState(COUNTRIES[0]);
  const [days, setDays] = useState(15);
  const [travelers, setTravelers] = useState(1);
  const [ageIndex, setAgeIndex] = useState(1);

  const { formula, perPerson, total } = useMemo(() => {
    const base = days <= 30 ? 30 : 60;
    const perPerson = Math.round(base * AGE_BRACKETS[ageIndex].multiplier);
    return { formula: days <= 30 ? "formula1" : "formula3", perPerson, total: perPerson * travelers };
  }, [days, travelers, ageIndex]);

  const inputCls =
    "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-light [&>option]:text-navy";

  return (
    <section className="px-4 py-20 sm:px-6" id="devis">
      <div className="mx-auto max-w-6xl">
        <div className="section-eyebrow text-center">{t("eyebrow")}</div>
        <h2 className="mt-3 text-center font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl">
          {t("title1")}
          <span className="text-gradient-secondary">{t("titleHighlight")}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-grey">{t("subtitle")}</p>

        <div className="mt-12 grid gap-8 rounded-3xl bg-gradient-to-br from-primary to-primary-light p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Formulaire */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/60">{t("form.sectionLabel")}</div>
            <h3 className="mt-1 font-outfit text-xl font-bold text-white">{t("form.sectionTitle")}</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">{t("form.country")}</span>
                <select className={inputCls} value={country} onChange={(e) => setCountry(e.target.value)}>
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">{t("summary.duration")}</span>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={days}
                  onChange={(e) => setDays(Math.max(1, Math.min(90, Number(e.target.value) || 1)))}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">{t("form.travelers")}</span>
                <select className={inputCls} value={travelers} onChange={(e) => setTravelers(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {t("form.travelersUnit", { count: n })}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">{t("form.age")}</span>
                <select className={inputCls} value={ageIndex} onChange={(e) => setAgeIndex(Number(e.target.value))}>
                  {AGE_BRACKETS.map((bracket, i) => (
                    <option key={bracket.key} value={i}>
                      {ageRows[i].label} · {ageRows[i].value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {/* Rappel du barème par âge */}
            <div className="mt-6 rounded-xl bg-white/5 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">{t("form.ageTable")}</div>
              <dl className="mt-2 grid gap-x-6 gap-y-1 text-xs sm:grid-cols-2">
                {ageRows.map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <dt className="text-white/60">{row.label}</dt>
                    <dd className="font-bold text-white">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="flex flex-col rounded-2xl bg-white/10 p-7 backdrop-blur">
            <dl className="flex flex-col gap-2.5 text-sm">
              {[
                [t("summary.destination"), country],
                [t("summary.duration"), t("summary.durationValue", { days })],
                [t("summary.formula"), t(`summary.${formula}`)],
                [t("summary.travelers"), t("form.travelersUnit", { count: travelers })],
                [t("summary.age"), ageRows[ageIndex].label],
                [t("summary.pricePerPerson"), `${perPerson} €`],
              ].map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <dt className="text-white/60">{label}</dt>
                  <dd className="font-bold text-white">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex items-end justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-white/60">{t("summary.total")}</div>
              <div className="text-right">
                <div className="text-gradient-secondary font-outfit text-4xl font-bold">{total} €</div>
                <div className="text-[10px] text-white/50">
                  {t("summary.totalFcfa", { amount: Math.round(total * RATE_FCFA).toLocaleString("fr-FR") })}
                </div>
              </div>
            </div>
            <Button variant="primary" className="mt-6 w-full" href="/tarifs">
              {t("summary.cta")}
            </Button>
            <p className="mt-4 text-[10px] leading-relaxed text-white/45">{t("summary.note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
