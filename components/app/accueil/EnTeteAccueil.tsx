"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";

/*
 * En-tête du tableau de bord (haut de la maquette « Homepage »).
 *
 * Mobile, 1:1 maquette : burger (menu, à venir), cloche de notification,
 * avatar aux initiales entouré de l'anneau de progression du profil (badge
 * « x% » et crayon), puis « Hello, %name » avec le prénom au dégradé corail.
 *
 * Desktop : barre d'en-tête de SaaS classique sur toute la largeur du
 * contenu : salutation + date du jour à gauche, cloche et avatar à droite
 * (le burger disparaît, la navigation vit dans la colonne latérale).
 */
/** Avatar circulaire : anneau de progression + initiales. */
function Anneau({
  progression,
  initiales,
  taille,
  epaisseur,
}: {
  progression: number;
  initiales: string;
  taille: number;
  epaisseur: number;
}) {
  return (
    <span
      className="grid place-items-center rounded-full"
      style={{
        width: taille,
        height: taille,
        background: `conic-gradient(#ff6567 ${progression * 3.6}deg, #d6dae1 0deg)`,
      }}
    >
      <span
        className="grid place-items-center rounded-full bg-white"
        style={{ width: taille - epaisseur, height: taille - epaisseur }}
      >
        <span
          className="grid place-items-center rounded-full bg-grey text-base font-bold text-white"
          style={{ width: taille - epaisseur * 2, height: taille - epaisseur * 2 }}
        >
          {initiales}
        </span>
      </span>
    </span>
  );
}

export default function EnTeteAccueil({ progression }: { progression: number }) {
  const t = useTranslations("app.accueil");
  const locale = useLocale();
  const { session } = useSession();

  const prenom = session?.utilisateur.prenom || "toi";
  const initiales = session
    ? `${session.utilisateur.prenom.charAt(0)}${session.utilisateur.nom.charAt(0)}`.toUpperCase() || "TP"
    : "TP";

  // Date du jour (« mardi 15 juillet »), majuscule initiale pour le français.
  const dateBrute = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  const dateDuJour = dateBrute.charAt(0).toUpperCase() + dateBrute.slice(1);

  return (
    <header className="relative">
      {/* Variante mobile, fidèle à la maquette. */}
      <div className="lg:hidden">
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
            <span className="absolute left-0 top-1">
              <Anneau progression={progression} initiales={initiales} taille={58} epaisseur={6} />
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
      </div>

      {/* Variante desktop : salutation à gauche, actions à droite. */}
      <div className="hidden lg:flex lg:items-center lg:justify-between">
        <div>
          <h1 className="font-outfit text-[28px] font-bold leading-9 text-dark">
            {t("hello")}
            <span className="text-gradient-secondary">{prenom}</span>
          </h1>
          <p className="mt-0.5 text-sm leading-[22px] text-grey">{dateDuJour}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications (flux à venir). */}
          <button
            type="button"
            title={t("bientot")}
            className="grid size-11 place-items-center rounded-full border border-grey-200 bg-white transition-colors hover:bg-grey-light"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/icons/bell.svg" alt="" width={22} height={22} />
          </button>

          {/* Avatar : anneau de progression + badge %. */}
          <Link
            href="/app/profil"
            aria-label={t("hello") + prenom}
            className="relative block transition-transform hover:scale-105"
          >
            <Anneau progression={progression} initiales={initiales} taille={50} epaisseur={5} />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-white bg-secondary px-1.5 text-[8px] font-bold leading-3 text-white">
              {progression}%
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
