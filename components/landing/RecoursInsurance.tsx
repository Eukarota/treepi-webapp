"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

/*
 * « Une assurance recours en cas de refus de visa » : titre tricolore,
 * paragraphe, puis liste de garanties dont les coches se remplissent
 * progressivement (une toutes les 2 secondes, en boucle), comme sur le
 * site en production.
 */
export default function RecoursInsurance() {
  const t = useTranslations("landing.recours");
  const items = t.raw("items") as string[];
  const [cochees, setCochees] = useState(1);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLUListElement>(null);

  // Démarre la coche progressive quand la liste entre à l'écran.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const minuterie = setInterval(() => setCochees((n) => (n >= items.length ? 1 : n + 1)), 2000);
    return () => clearInterval(minuterie);
  }, [visible, items.length]);

  return (
    <div className="insurance bg-grey-light text-center">
      <section className="section">
        <h2 className="mx-auto max-w-xs font-outfit text-2xl font-bold max-sm:!text-[31.88px] max-sm:!leading-[42.5px] max-xs:!text-[24px] max-xs:!leading-[32px] lg:max-w-lg lg:text-5xl xl:max-w-2xl xl:text-6xl">
          <span className="text-primary">{t("title1")}</span>{" "}
          <span className="bg-gradient-to-r from-[#ff6567] to-[#ffc486] bg-clip-text text-transparent">
            {t("title2")}
          </span>{" "}
          <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text font-bold text-transparent">
            {t("title3")}
          </span>
        </h2>
        {/* Les retours à la ligne du message ne s'appliquent qu'à partir de sm,
            comme les <br class="hidden sm:inline"> du site en production. */}
        <div className="mx-auto max-w-3xl py-8 text-sm font-medium !leading-[22px] text-grey max-sm:!text-[18.59px] max-sm:!leading-[29.22px] max-xs:!text-[14px] max-xs:!leading-[22px] sm:whitespace-pre-line">
          {t("subtitle")}
        </div>
        <div className="flex justify-center">
          <ul ref={ref} className="flex flex-col gap-y-6 text-left text-base font-medium text-black max-md:text-sm">
            {items.map((item, i) => {
              const cochee = i < cochees;
              return (
                <li
                  key={item}
                  className="flex max-w-[22rem] items-center gap-x-4 max-md:gap-x-2 max-sm:!text-[18.59px] max-sm:!leading-[29.22px] max-xs:!text-[14px] max-xs:!leading-[22px]"
                >
                  <svg
                    className={`h-4 w-5 shrink-0 rounded-[0.25rem] border-[1px] transition-colors duration-500 max-sm:w-4 ${
                      cochee
                        ? "border-primary-light bg-primary-lighter text-primary-light"
                        : "border-gray-300 bg-transparent text-transparent"
                    }`}
                    viewBox="0 0 448 512"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                  </svg>
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
