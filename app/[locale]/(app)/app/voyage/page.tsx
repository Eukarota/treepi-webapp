"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import CoquilleApp from "@/components/app/CoquilleApp";
import { IconeBanque, IconeBouclier, IconeGlobe, IconePasseport, IconePersonne } from "@/components/app/flux/icones";

/*
 * Hub « Voyage & visa » (cible de l'entrée de navigation « Voyage » et du
 * « Voir tout » des services) : liste tous les services visa et voyage de
 * Treepi, chacun ouvrant son flux dédié. Écran connecté classique (coquille
 * avec navigation), colonne unique mobile, centrée sur desktop.
 */

interface ServiceVoyage {
  cle: string;
  titre: string;
  sous: string;
  href: string;
}

// Pastille colorée par service (glyphe fonctionnel, pas une illustration).
const VISUELS: Record<string, { icone: typeof IconePasseport; fond: string }> = {
  visa: { icone: IconePasseport, fond: "bg-primary-light" },
  attestation: { icone: IconeBanque, fond: "bg-secondary-light" },
  accompagnement: { icone: IconePersonne, fond: "bg-secondary" },
  recours: { icone: IconeGlobe, fond: "bg-primary" },
  assurance: { icone: IconeBouclier, fond: "bg-emerald-700" },
};

export default function PageVoyage() {
  const t = useTranslations("app.voyage");
  const router = useRouter();
  const { session, chargement } = useSession();

  useEffect(() => {
    if (!chargement && !session) router.replace("/app/bienvenue");
  }, [chargement, session, router]);

  if (!session) return null;
  const services = t.raw("services") as ServiceVoyage[];

  return (
    <EcranApp className="bg-grey-light">
      <FondApp />
      <CoquilleApp>
        <div className="mx-auto w-full max-w-md px-6 pb-28 pt-6 lg:max-w-3xl lg:px-10 lg:pb-16 lg:pt-10">
          <h1 className="font-outfit text-2xl font-bold leading-8 text-dark lg:text-3xl">
            {t("introAvant")}
            <span className="text-gradient-secondary">{t("introCle")}</span>
          </h1>
          <p className="mt-1 text-sm leading-[22px] text-grey">{t("sousTitre")}</p>

          <div className="mt-6 flex flex-col gap-3">
            {services.map((s) => {
              const visuel = VISUELS[s.cle];
              const Icone = visuel?.icone ?? IconePasseport;
              return (
                <Link
                  key={s.cle}
                  href={s.href}
                  className="flex items-center gap-4 rounded-2xl border border-grey-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-app"
                >
                  <span className={"grid size-12 shrink-0 place-items-center rounded-2xl text-white " + (visuel?.fond ?? "bg-primary-light")}>
                    <Icone className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-outfit text-[15px] font-bold leading-5 text-dark">{s.titre}</span>
                    <span className="mt-0.5 block text-xs leading-4 text-grey">{s.sous}</span>
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/app/icons/caret-right.svg" alt="" width={20} height={20} className="size-5 shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </CoquilleApp>
    </EcranApp>
  );
}
