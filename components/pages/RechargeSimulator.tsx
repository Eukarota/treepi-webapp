"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

/*
 * Simulateur de recharge (page Recharge), carte sombre de la maquette.
 * Taux fixe XOF/XAF : 1 € = 655,957 FCFA. Frais indicatifs par méthode,
 * affichés comme au moment du paiement (transparence totale).
 */

const RATE = 655.957;

const METHODS = {
  card: { feeRate: 0.015 },     // 1,5 %, instantané
  cash: { feeRate: 0.02 },      // 2 %, sous 24 h
  transfer: { feeRate: 0.01 },  // 1 %, 72 h à 2 semaines
} as const;

type MethodKey = keyof typeof METHODS;

const COUNTRIES = ["🇨🇲 Cameroun", "🇸🇳 Sénégal", "🇨🇮 Côte d'Ivoire", "🇬🇦 Gabon", "🇧🇯 Bénin", "🇹🇬 Togo"];

export default function RechargeSimulator() {
  const t = useTranslations("recharge.simulator");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [method, setMethod] = useState<MethodKey>("card");
  const [amount, setAmount] = useState(196800);

  const { fees, total, received } = useMemo(() => {
    const fees = Math.round(amount * METHODS[method].feeRate);
    const total = amount + fees;
    const received = amount / RATE;
    return { fees, total, received };
  }, [amount, method]);

  const fmt = (n: number) => n.toLocaleString("fr-FR");

  return (
    <section className="px-4 py-20 sm:px-6" id="simulateur">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-3xl bg-gradient-to-br from-primary to-primary-light p-5 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] [&>*]:min-w-0">
        {/* Formulaire */}
        <div>
          <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white">{t("eyebrow")}</span>
          <h2 className="mt-3 font-outfit text-2xl font-bold text-white sm:text-3xl">{t("title")}</h2>
          <p
            className="mt-3 text-sm leading-relaxed text-white/70 [&>b]:font-bold [&>b]:text-white"
            dangerouslySetInnerHTML={{ __html: t.raw("subtitle") }}
          />

          <div className="mt-8 flex flex-col gap-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">{t("country")}</span>
              <select
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary-light [&>option]:text-navy"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <div>
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">{t("method")}</span>
              <div className="flex gap-2">
                {(Object.keys(METHODS) as MethodKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setMethod(key)}
                    className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                      method === key ? "bg-white text-navy shadow" : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                    aria-pressed={method === key}
                  >
                    {t(`methods.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/60">{t("amount")}</span>
              <div className="flex items-center gap-3">
                <div className="flex flex-1 items-center rounded-xl border border-white/15 bg-white/10 px-4">
                  <input
                    type="number"
                    min={1000}
                    step={100}
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full bg-transparent py-3 text-sm text-white outline-none"
                  />
                  <span className="text-xs font-bold text-white/60">FCFA (XAF)</span>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-white" aria-hidden>⇄</span>
                <div className="rounded-xl bg-primary-lighter/20 px-4 py-3 text-sm font-bold text-primary-light">
                  ≈ {received.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} € 🇪🇺
                </div>
              </div>
              <span className="mt-2 block text-[10px] text-white/40">{t("rateNote")}</span>
            </label>
          </div>
        </div>

        {/* Récapitulatif */}
        <div className="flex flex-col justify-center rounded-2xl bg-white p-5 shadow-[0_16px_50px_rgba(5,160,199,0.25)] sm:p-8">
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-grey">{t("youSend")}</dt>
              <dd className="font-bold text-navy">{fmt(amount)} FCFA</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-grey">{t("fees")}</dt>
              <dd className="font-bold text-navy">{fmt(fees)} FCFA</dd>
            </div>
            <div className="flex items-center justify-between border-b border-grey-light pb-3">
              <dt className="text-grey">{t("totalDebited")}</dt>
              <dd className="font-bold text-navy">{fmt(total)} FCFA</dd>
            </div>
            <div className="flex items-center justify-between pt-1">
              <dt className="text-grey">{t("youReceive")}</dt>
              <dd className="text-gradient-secondary font-outfit text-3xl font-bold">
                {received.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-grey">{t("availability")}</dt>
              <dd className="font-bold text-primary">
                {method === "card" ? t("instant") : method === "cash" ? "≈ 24 h" : "72 h – 2 sem."}
              </dd>
            </div>
          </dl>
          <Button variant="primary" className="mt-7" href="/compte-euro">
            {t("cta", { amount: `${received.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €` })}
          </Button>
          <p className="mt-4 text-center text-[10px] text-grey/80">{t("disclaimer")}</p>
        </div>
      </div>
    </section>
  );
}
