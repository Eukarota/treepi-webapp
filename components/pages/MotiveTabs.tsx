"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/*
 * « Quel que soit ton motif de voyage » (page attestation) :
 * onglets Tourisme / Visite familiale / Mission pro / Médical.
 */
export default function MotiveTabs() {
  const t = useTranslations("attestation.motives");
  const tabs = t.raw("tabs") as { label: string; title: string; description: string }[];
  const [active, setActive] = useState(0);

  return (
    <section className="bg-grey-light">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <div className="section-eyebrow">{t("eyebrow")}</div>
        <h2 className="mt-3 font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl">
          {t("title1")}
          <span className="text-gradient-secondary">{t("titleHighlight")}</span>
        </h2>

        <div className="mt-8 inline-flex flex-wrap justify-center gap-1 rounded-full bg-white p-1 shadow-sm">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                active === i ? "bg-gradient-to-r from-primary to-primary-light text-white shadow" : "text-grey hover:text-navy"
              }`}
              aria-pressed={active === i}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          <h3 className="font-outfit text-lg font-bold text-navy">{tabs[active].title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-grey">{tabs[active].description}</p>
        </div>
      </div>
    </section>
  );
}
