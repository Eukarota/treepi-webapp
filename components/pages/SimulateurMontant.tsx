"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

/*
 * Simulateur de montant visa (page attestation), carte sombre de la maquette.
 * Restauré depuis l'ancienne section simulateur de la home.
 * Barèmes journaliers indicatifs par pays et type d'hébergement ,
 * la mention légale sous le résultat rappelle leur caractère estimatif.
 */

type AccommodationKey = "booked" | "none" | "hosted";

// Barème €/jour : [hébergement réservé, sans justificatif, hébergé par un proche].
const RATES: Record<string, Record<AccommodationKey, number>> = {
  France: { booked: 65, none: 120, hosted: 32.5 },
  Belgique: { booked: 50, none: 95, hosted: 45 },
  Allemagne: { booked: 45, none: 45, hosted: 45 },
  Espagne: { booked: 108, none: 108, hosted: 108 },
  Italie: { booked: 52, none: 52, hosted: 52 },
  Portugal: { booked: 40, none: 75, hosted: 40 },
  "Pays-Bas": { booked: 55, none: 55, hosted: 55 },
};

export default function SimulateurMontant() {
  const t = useTranslations("landing.simulator");
  const [country, setCountry] = useState("France");
  const [days, setDays] = useState(15);
  const [accommodation, setAccommodation] = useState<AccommodationKey>("booked");

  const rate = RATES[country][accommodation];
  const total = useMemo(() => Math.round(rate * days), [rate, days]);

  const selectCls =
    "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-light [&>option]:text-navy";

  return (
    <section className="px-4 pb-20 pt-6 sm:px-6" id="simulator">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-3xl bg-gradient-to-br from-primary to-primary-light p-5 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] [&>*]:min-w-0">
        {/* Formulaire */}
        <div>
          <h2 className="font-outfit text-2xl font-bold text-white sm:text-3xl">{t("title")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{t("subtitle")}</p>

          <div className="mt-8 flex flex-col gap-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">{t("country")}</span>
              <select className={selectCls} value={country} onChange={(e) => setCountry(e.target.value)}>
                {Object.keys(RATES).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">{t("duration")}</span>
              <input
                type="number"
                min={1}
                max={90}
                value={days}
                onChange={(e) => setDays(Math.max(1, Math.min(90, Number(e.target.value) || 1)))}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-light"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">{t("accommodation")}</span>
              <select className={selectCls} value={accommodation} onChange={(e) => setAccommodation(e.target.value as AccommodationKey)}>
                <option value="booked">{t("accommodations.booked")}</option>
                <option value="none">{t("accommodations.none")}</option>
                <option value="hosted">{t("accommodations.hosted")}</option>
              </select>
            </label>
          </div>
        </div>

        {/* Résultat */}
        <div className="flex flex-col justify-center rounded-2xl bg-white p-5 text-center shadow-[0_16px_50px_rgba(5,160,199,0.25)] sm:p-8">
          <div className="text-xs font-bold uppercase tracking-widest text-grey">{t("resultLabel")}</div>
          <div className="text-gradient-secondary mt-4 font-outfit text-6xl font-bold">
            {total.toLocaleString("fr-FR")} €
          </div>
          <p className="mt-4 text-xs leading-relaxed text-grey">
            {t("resultCaption", {
              country,
              days,
              accommodation: t(`accommodations.${accommodation}`),
              rate,
            })}
          </p>
          <Button variant="primary" className="mt-7" href="/compte-euro">
            {t("cta")}
          </Button>
          <p className="mt-5 text-[10px] leading-relaxed text-grey/80">{t("disclaimer")}</p>
        </div>
      </div>
    </section>
  );
}
