"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { CompteEuro, obtenirCompte } from "@/lib/api/compte";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import CoquilleApp from "@/components/app/CoquilleApp";
import EnTeteAccueil from "@/components/app/accueil/EnTeteAccueil";
import CarteSolde from "@/components/app/accueil/CarteSolde";
import Bandeaux from "@/components/app/accueil/Bandeaux";
import Transactions from "@/components/app/accueil/Transactions";
import CarteAjoutVisa from "@/components/app/accueil/CarteAjoutVisa";
import ServicesTreepi from "@/components/app/accueil/ServicesTreepi";
import SimulateurTransfert from "@/components/app/accueil/SimulateurTransfert";
import CarteSupport from "@/components/app/accueil/CarteSupport";

/*
 * Tableau de bord (maquette « Homepage ») : en-tête avec avatar, carte du
 * solde Euro et actions rapides, carrousel de bannières pré/post-visa,
 * transactions, carte « Ajouter mon visa », services, simulateur de
 * transfert et carte support, barre de navigation en bas.
 *
 * Desktop : mise en page de tableau de bord SaaS. Colonne latérale
 * repliable (profil en bas), en-tête sur toute la largeur (salutation +
 * cloche + avatar), rangée haute carte du solde + pile de bannières, puis
 * transactions et visa à gauche, services/simulateur/support à droite.
 */
export default function PageAccueil() {
  const router = useRouter();
  const { session, chargement } = useSession();
  // État du compte simulé, lu au montage (rien côté serveur).
  const [compte] = useState<CompteEuro | null>(() =>
    typeof window === "undefined" ? null : obtenirCompte(),
  );

  // Garde de session + tutoriel au premier accès (tant qu'il n'a pas été vu).
  useEffect(() => {
    if (chargement) return;
    if (!session) {
      router.replace("/app/bienvenue");
      return;
    }
    if (!window.localStorage.getItem("treepi.tuto-vu")) {
      router.replace("/app/tutoriel");
    }
  }, [chargement, session, router]);

  if (!session || !compte) return null;

  return (
    <EcranApp className="bg-grey-light">
      <FondApp />
      <CoquilleApp>
        {/* Colonne mobile 1:1 ; tableau de bord deux colonnes sur desktop. */}
        <div className="mx-auto w-full max-w-md px-6 pb-28 pt-4 lg:max-w-6xl lg:px-10 lg:pb-16 lg:pt-8">
          {/* En-tête sur toute la largeur du contenu. */}
          <EnTeteAccueil progression={compte.progressionProfil} />

          <div className="mt-4 flex flex-col gap-4 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
            {/* Flux principal (colonne unique sur mobile, gauche sur desktop). */}
            <div className="flex flex-col gap-4 lg:min-w-0 lg:gap-6">
              {/* Carte du solde pleine largeur, bannières en rangée dessous. */}
              <CarteSolde soldeEuros={compte.soldeEuros} />
              <Bandeaux phase={compte.phase} />
              <Transactions transactions={compte.transactions} />
              <CarteAjoutVisa />
            </div>

            {/* Suite du flux mobile, colonne droite sur desktop. */}
            <div className="flex flex-col gap-4 lg:gap-6">
              <ServicesTreepi />
              <SimulateurTransfert />
              <CarteSupport />
            </div>
          </div>
        </div>
      </CoquilleApp>
    </EcranApp>
  );
}
