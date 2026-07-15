"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import GabaritProfil from "@/components/app/profil/GabaritProfil";
import SelecteurLangue from "@/components/app/ui/SelecteurLangue";

/*
 * Hub « Mon profil » (maquette « Mon profil ») : carte de statistiques de
 * voyage (pays visités, voyages, durée moyenne) puis menu vers les trois
 * volets : infos personnelles, professionnelles et financières. En pied,
 * le sélecteur de langue et la déconnexion.
 */
export default function PageProfil() {
  const t = useTranslations("app.profil");
  const router = useRouter();
  const { fermerSession } = useSession();

  /** Déconnexion : purge la session simulée puis retour à l'accueil visiteur. */
  const deconnecter = async () => {
    await fermerSession();
    router.replace("/app/bienvenue");
  };

  const STATS = [
    { icone: "/app/icons/stat-globe.svg", valeur: "0", libelle: t("statsPays") },
    { icone: "/app/icons/stat-avion.svg", valeur: "0", libelle: t("statsVoyages") },
    { icone: "/app/icons/calendar.svg", valeur: "0", unite: t("statsJours"), libelle: t("statsDuree") },
  ];

  const ENTREES = [
    { href: "/app/profil/infos-personnelles", icone: "/app/icons/profil-user.svg", titre: t("infoPerso"), sous: t("infoPersoSous") },
    { href: "/app/profil/infos-professionnelles", icone: "/app/icons/profil-briefcase.svg", titre: t("infoPro"), sous: t("infoProSous") },
    { href: "/app/profil/infos-financieres", icone: "/app/icons/profil-euro.svg", titre: t("infoFi"), sous: t("infoFiSous") },
  ];

  return (
    <GabaritProfil>
      {/* Statistiques de voyage, réparties sur toute la largeur. */}
      <div className="mt-5 flex items-stretch rounded-lg border border-grey-200 bg-white p-2">
        {STATS.map((stat, i) => (
          <div key={stat.libelle} className={"flex flex-1 flex-col items-center py-1" + (i > 0 ? " border-l border-grey-200" : "")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={stat.icone} alt="" width={24} height={24} className="size-6" />
            <p className="font-outfit text-2xl font-bold leading-8 text-dark">
              {stat.valeur}
              {stat.unite && <span className="font-inter text-[10px] font-normal leading-4"> {stat.unite}</span>}
            </p>
            <p className="text-center text-[10px] leading-4 text-dark">{stat.libelle}</p>
          </div>
        ))}
      </div>

      {/* Menu du profil. */}
      <h2 className="mt-6 font-outfit text-base font-bold leading-6 text-dark">{t("sectionTitre")}</h2>
      <div className="mt-2 flex flex-col rounded-lg border border-grey-200 bg-white p-2">
        {ENTREES.map((entree, i) => (
          <Link key={entree.href} href={entree.href} className="group">
            {i > 0 && <hr className="border-grey-100" />}
            <span className="flex items-start gap-2 rounded-lg p-2 transition-colors group-hover:bg-grey-light">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={entree.icone} alt="" width={24} height={24} className="size-6 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold leading-[22px] text-dark">{entree.titre}</span>
                <span className="block text-[10px] leading-4 text-grey">{entree.sous}</span>
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/app/icons/caret-right.svg" alt="" width={20} height={20} className="size-5 shrink-0" />
            </span>
          </Link>
        ))}
      </div>

      {/* Langue + déconnexion. */}
      <div className="mt-6 rounded-lg border border-grey-200 bg-white p-2">
        <SelecteurLangue />
        <hr className="border-grey-100" />
        <button
          type="button"
          onClick={deconnecter}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-error transition-colors hover:bg-error/5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app/icons/logout.svg" alt="" width={18} height={18} className="size-[18px]" />
          {t("deconnexion")}
        </button>
      </div>
    </GabaritProfil>
  );
}
