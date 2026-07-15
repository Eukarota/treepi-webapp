"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import NavBarApp from "@/components/app/accueil/NavBarApp";

/*
 * Gabarit des écrans « Mon profil » : fond clair à volute, TopNav avec
 * flèche retour et croix turquoise autour du titre « Mon profil » (Outfit
 * Bold 24 turquoise), avatar aux initiales entouré de l'anneau de
 * progression avec badge % et crayon, nom + email, puis le contenu de la
 * page. Version en bas, barre de navigation de l'app.
 */
export default function GabaritProfil({
  retourVers = "/app/accueil",
  children,
}: {
  /** Destination de la flèche retour (la croix ramène à l'accueil). */
  retourVers?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("app.profil");
  const router = useRouter();
  const { session, chargement } = useSession();

  useEffect(() => {
    if (!chargement && !session) router.replace("/app/bienvenue");
  }, [chargement, session, router]);

  if (!session) return null;

  const u = session.utilisateur;
  const initiales = `${u.prenom.charAt(0)}${u.nom.charAt(0)}`.toUpperCase() || "TP";
  const progression = 0;

  return (
    <EcranApp className="bg-grey-light">
      <FondApp />
      <NavBarApp />

      <div className="relative z-10 mx-auto w-full max-w-md px-6 pb-28 pt-4 lg:max-w-2xl lg:pl-64 lg:pt-10">
        {/* TopNav : retour, titre turquoise, fermeture. */}
        <div className="flex h-8 items-center justify-between">
          <button type="button" onClick={() => router.push(retourVers)} aria-label={t("retour")} className="transition-opacity hover:opacity-70">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/icons/arrow-left-teal.svg" alt="" width={32} height={32} />
          </button>
          <h1 className="font-outfit text-2xl font-bold leading-8 text-primary-light">{t("titre")}</h1>
          <button type="button" onClick={() => router.push("/app/accueil")} aria-label={t("fermer")} className="transition-opacity hover:opacity-70">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/icons/close-teal.svg" alt="" width={32} height={32} />
          </button>
        </div>

        {/* Avatar + identité. */}
        <div className="mt-4 flex items-center gap-4">
          <div className="relative h-[90px] w-[88px] shrink-0">
            <span
              className="absolute left-0 top-1 grid size-[78px] place-items-center rounded-full"
              style={{ background: `conic-gradient(#ff6567 ${progression * 3.6}deg, #d6dae1 0deg)` }}
            >
              <span className="grid size-[70px] place-items-center rounded-full bg-white">
                <span className="grid size-[64px] place-items-center rounded-full bg-grey text-3xl font-medium text-white">
                  {initiales}
                </span>
              </span>
            </span>
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-white px-2 text-[10px] font-bold leading-4 text-grey-light"
              style={{ backgroundImage: "linear-gradient(60deg, #ff6567 0%, #ffc486 100%)" }}
            >
              {progression}%
            </span>
            <span className="absolute right-0 top-0 grid size-6 place-items-center rounded-full bg-white shadow-app">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app/icons/pencil.svg" alt="" width={18} height={18} />
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate font-outfit text-base font-bold leading-6 text-dark">
              {u.prenom} {u.nom}
            </p>
            <p className="truncate text-sm font-medium leading-[22px] text-dark">{u.email}</p>
          </div>
        </div>

        {children}

        <p className="mt-8 text-center text-[10px] leading-4 text-grey-300">{t("version")}</p>
      </div>
    </EcranApp>
  );
}
