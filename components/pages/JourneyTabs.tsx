"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/*
 * « Avant & après le visa » (page compte européen) :
 * bascule à deux onglets qui alterne les deux parcours en 4 étapes,
 * avec la note d'information sous la grille.
 */
export default function JourneyTabs() {
  const t = useTranslations("compteEuro.journey");
  const [tab, setTab] = useState<"before" | "after">("before");
  const steps = t.raw(tab === "before" ? "beforeSteps" : "afterSteps") as {
    title: string;
    description: string;
  }[];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center"><span className="section-eyebrow">{t("eyebrow")}</span></div>
        <h2 className="mt-3 text-center font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl">
          {t("title1")}
          <span className="text-gradient-secondary">{t("titleHighlight")}</span>
        </h2>

        {/* Bascule avant / après */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full bg-grey-light p-1">
            {(["before", "after"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-200 ${
                  tab === key
                    ? "bg-gradient-to-r from-secondary to-secondary-light text-white shadow"
                    : "text-grey hover:text-navy"
                }`}
                aria-pressed={tab === key}
              >
                {t(key)}
              </button>
            ))}
          </div>
        </div>

        {/* Étapes */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`rounded-2xl border-2 p-6 transition-all duration-300 ${
                i === 2 && tab === "before"
                  ? "border-secondary bg-white shadow-[0_10px_30px_rgba(255,101,103,0.15)]"
                  : "border-transparent bg-white shadow-[0_2px_20px_rgba(18,35,71,0.06)]"
              }`}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-lighter text-xs font-bold text-primary">
                {i + 1}
              </span>
              <h3 className="mt-3 text-sm font-bold text-navy">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-grey">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Note d'information */}
        <div
          className="mx-auto mt-8 max-w-3xl rounded-xl border-l-4 border-secondary bg-grey-light p-5 text-sm leading-relaxed text-navy/80 [&>b]:font-bold [&>b]:text-navy"
          dangerouslySetInnerHTML={{ __html: t.raw("note") }}
        />
      </div>
    </section>
  );
}
