"use client";

import { useLocale, useTranslations } from "next-intl";
import { Transaction } from "@/lib/api/compte";

/*
 * Bloc « Transactions » du tableau de bord : titre + pilule « Voir tout »,
 * carte blanche listant les mouvements (icône carrée dégradée, libellé,
 * date, montant) ou l'état vide « Aucunes transactions » (maquette
 * « Frais de gestion »).
 */
export default function Transactions({ transactions }: { transactions: Transaction[] }) {
  const t = useTranslations("app.accueil");
  const locale = useLocale();

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })
      .format(new Date(iso))
      .replace(" à ", ", ");

  const formatMontant = (tx: Transaction) =>
    `${tx.sens === "debit" ? "-" : "+"} ${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(tx.montantEuros)} €`;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="font-outfit text-base font-bold leading-6 text-dark">{t("transactions")}</h2>
        <button type="button" title={t("bientot")} className="rounded-2xl bg-grey-100 px-2 py-1 text-[10px] leading-4 text-dark transition-colors hover:bg-grey-200">
          {t("voirTout")}
        </button>
      </div>

      <div className="rounded-lg border border-grey-200 bg-white p-4">
        {transactions.length === 0 ? (
          <p className="py-3 text-center text-sm leading-[22px] text-grey-300">{t("aucuneTransaction")}</p>
        ) : (
          <ul className="flex flex-col">
            {transactions.map((tx, i) => (
              <li key={tx.id}>
                {i > 0 && <hr className="my-2 border-grey-100" />}
                <div className="flex items-center gap-2">
                  <span
                    className={
                      "grid size-8 shrink-0 place-items-center rounded-sm bg-gradient-to-r " +
                      (tx.type === "recharge" ? "from-secondary to-secondary-light" : "from-primary to-primary-light")
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tx.type === "recharge" ? "/app/icons/plus.svg" : "/app/icons/arrows-left-right.svg"}
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 brightness-0 invert"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-0.5 truncate text-sm font-medium leading-[22px] text-dark">
                        {tx.titre.includes("→") ? (
                          <>
                            {tx.titre.split("→")[0].trim()}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/app/icons/arrow-right-small.svg" alt="→" width={16} height={16} className="mx-0.5 size-4" />
                            {tx.titre.split("→")[1].trim()}
                          </>
                        ) : (
                          tx.titre
                        )}
                      </span>
                      <span className={"shrink-0 text-sm font-medium leading-[22px] " + (tx.sens === "debit" ? "text-dark" : "text-primary-light")}>
                        {formatMontant(tx)}
                      </span>
                    </div>
                    <p className="text-[10px] leading-4 text-grey">{formatDate(tx.date)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
