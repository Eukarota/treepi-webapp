"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import BoutonApp from "@/components/app/ui/BoutonApp";
import PiedLegal from "@/components/app/ui/PiedLegal";

/*
 * Écran de bienvenue (maquette « SignUp ») : courbe corail décorative en
 * haut à gauche, illustration du voyageur à la carte, titre « Bienvenue sur
 * Treepi » (Treepi au dégradé corail), boutons « S'inscrire » (primaire) et
 * « Se connecter » (neutre), mention légale en bas.
 */
export default function PageBienvenue() {
  const t = useTranslations("app");
  const router = useRouter();

  return (
    <EcranApp className="md:justify-center">
      <FondApp />
      {/* Courbe corail de la maquette, inclinée, débordant en haut à gauche. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/app/illustrations/curve-coral.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[-204px] top-[-312px] w-[762px] max-w-none -rotate-[13.5deg]"
      />

      <div className="colonne-app relative z-10 pb-8 pt-10 md:py-16">
        {/* Sortie de l'app vers le site : croix sur mobile, bouton texte
            explicite « Retourner au site » sur desktop. */}
        <div className="flex h-8 items-center justify-end md:justify-start">
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label={t("bienvenue.quitter")}
            className="transition-opacity hover:opacity-70 md:hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/icons/close-teal.svg" alt="" width={32} height={32} />
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="hidden items-center gap-1.5 text-sm font-bold text-primary-light transition-opacity hover:opacity-70 md:flex"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/icons/arrow-left-teal.svg" alt="" width={20} height={20} className="size-5" />
            {t("bienvenue.quitter")}
          </button>
        </div>

        {/* Illustration « Travel » : voyageur qui déplie sa carte. */}
        <div className="mt-2 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/app/illustrations/travel.svg"
            alt=""
            width={272}
            height={272}
            className="size-[272px] max-w-full animate-fade-in"
          />
        </div>

        <h1 className="mt-6 text-center font-outfit text-2xl font-bold leading-8 text-dark">
          {t("commun.bienvenueSur")}
          <br />
          <span className="text-gradient-secondary">{t("commun.treepi")}</span>
        </h1>

        <div className="mt-auto flex flex-col md:mt-10">
          <BoutonApp onClick={() => router.push("/app/inscription")}>{t("bienvenue.inscrire")}</BoutonApp>
          <BoutonApp variante="neutre" onClick={() => router.push("/app/connexion")}>
            {t("bienvenue.connecter")}
          </BoutonApp>

          {/* Rappel des premiers pas : rejoue le walkthrough de découverte. */}
          <button
            type="button"
            onClick={() => router.push("/app/decouverte")}
            className="mx-auto mt-4 flex items-center gap-1.5 text-sm font-bold text-primary-light transition-opacity hover:opacity-70"
          >
            {t("bienvenue.premiersPas")}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app/icons/arrow-right-small.svg" alt="" width={16} height={16} className="size-4" />
          </button>
        </div>

        <div className="mt-8">
          <PiedLegal />
        </div>
      </div>
    </EcranApp>
  );
}
