"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/*
 * « Foire aux questions » : deux colonnes de cartes blanches, question en
 * gras avec chevron, réponse dépliée en hauteur animée. Une seule entrée
 * ouverte à la fois, comme sur le site en production.
 */

type Entree = { q: string; a: string[] };

function CarteFaq({ entree, ouverte, surClic }: { entree: Entree; ouverte: boolean; surClic: () => void }) {
  return (
    <div className="w-full cursor-pointer overflow-hidden rounded-lg border-2 border-transparent bg-white transition duration-300 ease-in-out hover:bg-info">
      <button
        type="button"
        onClick={surClic}
        aria-expanded={ouverte}
        className="flex w-full flex-row items-center justify-between border-none px-[14px] py-[14px] text-left font-medium sm:py-5"
      >
        <div className="w-5/6 text-[14px] font-bold leading-snug text-dark max-sm:!text-[12.15px] max-sm:!leading-[19.09px] max-xs:!text-[9.15px] max-xs:!leading-[14.37px]">
          {entree.q}
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-dark transition-transform duration-300 ${ouverte ? "rotate-180" : ""}`}
          viewBox="0 0 512 512"
          fill="currentColor"
          aria-hidden
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </svg>
      </button>
      <div
        className={`overflow-hidden px-[15px] pr-[4px] text-[14px] transition-all duration-300 ease-in-out max-sm:!text-[12.15px] max-sm:!leading-[19.09px] max-xs:!text-[9.15px] max-xs:!leading-[14.37px] ${
          ouverte ? "max-h-[1000px] pb-4" : "max-h-0"
        }`}
      >
        <div className="w-5/6 leading-snug text-dark">
          {entree.a.map((ligne, i) =>
            ligne === "" ? <br key={i} /> : <div key={i}>{ligne}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandingFaq() {
  const t = useTranslations("landing.faq");
  const entrees = t.raw("items") as Entree[];
  const [ouverte, setOuverte] = useState<number | null>(null);
  // Trois entrées par colonne, comme sur le site en production.
  const colonnes = [entrees.slice(0, 3), entrees.slice(3)];

  return (
    <div className="bg-grey-light" id="faq">
      <section className="section">
        <h2 className="mx-auto max-w-xs text-center font-outfit text-2xl font-bold max-sm:!text-[31.88px] max-sm:!leading-[42.5px] max-xs:!text-[24px] max-xs:!leading-[32px] lg:max-w-lg lg:text-5xl xl:max-w-2xl xl:text-6xl [&>*]:bg-gradient-to-r [&>*]:bg-clip-text [&>*]:text-transparent">
          <span className="from-primary to-primary-light">{t("title1")}</span>{" "}
          <span className="from-secondary to-secondary-light">{t("title2")}</span>
        </h2>
        <div className="mx-auto mt-8 max-w-4xl md:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
            {colonnes.map((colonne, c) => (
              <div key={c} className="mb-4 flex flex-col gap-4">
                {colonne.map((entree, i) => {
                  const index = c * 3 + i;
                  return (
                    <CarteFaq
                      key={entree.q}
                      entree={entree}
                      ouverte={ouverte === index}
                      surClic={() => setOuverte(ouverte === index ? null : index)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
