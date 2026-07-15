"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { CompteEuro, obtenirCompte } from "@/lib/api/compte";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import NavBarApp from "@/components/app/accueil/NavBarApp";
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
 * Desktop (extrapolation mobile-first) : la navigation devient une colonne
 * latérale et le contenu s'organise en deux colonnes (flux principal à
 * gauche, services/simulateur/support à droite).
 */
export default function PageAccueil() {
  const router = useRouter();
  const { session, chargement } = useSession();
  const [compte, setCompte] = useState<CompteEuro | null>(null);

  // Garde de session + chargement de l'état du compte simulé.
  useEffect(() => {
    if (!chargement && !session) {
      router.replace("/app/bienvenue");
      return;
    }
    if (session) setCompte(obtenirCompte());
  }, [chargement, session, router]);

  if (!session || !compte) return null;

  return (
    <EcranApp className="bg-grey-light">
      <FondApp />
      <NavBarApp />

      {/* Colonne mobile 1:1 ; grille deux colonnes sur grand écran. */}
      <div className="relative z-10 mx-auto w-full max-w-md px-6 pb-28 pt-4 lg:max-w-6xl lg:pl-64 lg:pr-10 lg:pt-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-10">
          {/* Flux principal (colonne unique sur mobile, gauche sur desktop). */}
          <div className="flex flex-col gap-4 lg:min-w-0 lg:flex-1">
            <EnTeteAccueil progression={compte.progressionProfil} />
            <CarteSolde soldeEuros={compte.soldeEuros} />
            <Bandeaux phase={compte.phase} />
            <Transactions transactions={compte.transactions} />
            <CarteAjoutVisa />
          </div>

          {/* Suite du flux mobile, colonne droite sur desktop. */}
          <div className="flex flex-col gap-4 lg:w-[360px] lg:shrink-0">
            <ServicesTreepi />
            <SimulateurTransfert />
            <CarteSupport />
          </div>
        </div>
      </div>
    </EcranApp>
  );
}
