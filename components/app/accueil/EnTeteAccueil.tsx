"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";

/*
 * En-tête du tableau de bord (haut de la maquette « Homepage ») :
 * burger (menu, à venir), cloche de notification centrée, avatar aux
 * initiales entouré de l'anneau de progression du profil (badge « x% » et
 * crayon d'édition), puis « Hello, %name » avec le prénom au dégradé corail.
 */
export default function EnTeteAccueil({ progression }: { progression: number }) {
  const t = useTranslations("app.accueil");
  const { session } = useSession();

  const prenom = session?.utilisateur.prenom || "toi";
  const initiales = session
    ? `${session.utilisateur.prenom.charAt(0)}${session.utilisateur.nom.charAt(0)}`.toUpperCase() || "TP"
    : "TP";

  return (
    <header className="relative">
      <div className="flex items-start justify-between">
        {/* Menu latéral : flux « Menu » à venir (TODO). */}
        <button type="button" title={t("bientot")} className="mt-2 transition-opacity hover:opacity-70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/icons/menu.svg" alt="" width={32} height={32} />
        </button>

        {/* Notifications (flux à venir). */}
        <button
          type="button"
          title={t("bientot")}
          className="mt-2 flex size-8 items-center justify-center rounded-full transition-colors hover:bg-grey-light"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/icons/bell.svg" alt="" width={22} height={22} />
        </button>

        {/* Avatar : anneau de progression + initiales + badge % + crayon. */}
        <Link href="/app/profil" className="group relative block h-[68px] w-[66px]" aria-label={t("hello") + prenom}>
          <span
            className="absolute left-0 top-1 grid size-[58px] place-items-center rounded-full"
            style={{
              background: `conic-gradient(#ff6567 ${progression * 3.6}deg, #d6dae1 0deg)`,
            }}
          >
            <span className="grid size-[52px] place-items-center rounded-full bg-white">
              <span className="grid size-[46px] place-items-center rounded-full bg-grey text-base font-bold text-white">
                {initiales}
              </span>
            </span>
          </span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-1.5 text-[8px] font-bold leading-3 text-white">
            {progression}%
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/app/icons/pencil.svg"
            alt=""
            width={16}
            height={16}
            className="absolute right-0 top-0 transition-transform group-hover:scale-110"
          />
        </Link>
      </div>

      <h1 className="mt-1 font-outfit text-lg font-bold leading-[26px] text-dark">
        {t("hello")}
        <span className="text-gradient-secondary">{prenom}</span>
      </h1>
    </header>
  );
}
