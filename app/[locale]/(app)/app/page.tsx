"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import EcranApp from "@/components/app/EcranApp";
import Swirl from "@/components/ui/Swirl";

/*
 * Écran de lancement (maquette « Launch Screen ») : plein dégradé turquoise
 * avec la volute en filigrane, logo Treepi centré (« ee » corail) et numéro
 * de version. Après un court instant, redirige selon l'état de session :
 *  – connecté            → accueil de l'app ;
 *  – walkthrough déjà vu → écran de bienvenue (SignUp) ;
 *  – premier lancement   → walkthrough de découverte.
 */
export default function PageLancement() {
  const t = useTranslations("app.lancement");
  const router = useRouter();
  const { session, chargement } = useSession();

  useEffect(() => {
    if (chargement) return;
    const minuteur = setTimeout(() => {
      if (session) {
        router.replace("/app/accueil");
      } else if (window.localStorage.getItem("treepi.walkthrough-vu")) {
        router.replace("/app/bienvenue");
      } else {
        router.replace("/app/decouverte");
      }
    }, 1800);
    return () => clearTimeout(minuteur);
  }, [chargement, session, router]);

  return (
    <EcranApp>
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary-light to-primary">
        {/* Volute « e » en filigrane, comme sur le héro du site. */}
        <Swirl className="absolute inset-0 h-full w-full" />
        {/* Logo vectoriel exporté de la maquette (« ee » corail). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app/logo-launch.svg" alt="Treepi" className="relative z-10 w-[243px] max-w-[70%] animate-fade-in" />
        <p className="absolute bottom-8 z-10 text-[10px] leading-4 text-white">{t("version")}</p>
      </div>
    </EcranApp>
  );
}
