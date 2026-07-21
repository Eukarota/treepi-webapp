"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSession } from "@/components/app/SessionProvider";
import { CompteEuro, obtenirCompte } from "@/lib/api/compte";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import CoquilleApp from "@/components/app/CoquilleApp";
import EnTeteAccueil from "@/components/app/accueil/EnTeteAccueil";
import CarteSolde from "@/components/app/accueil/CarteSolde";
import CarteOuverture from "@/components/app/accueil/CarteOuverture";
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
  const t = useTranslations("app.accueil");
  const router = useRouter();
  const { session, chargement } = useSession();
  // État du compte simulé, lu au montage (rien côté serveur).
  const [compte, setCompte] = useState<CompteEuro | null>(() =>
    typeof window === "undefined" ? null : obtenirCompte(),
  );
  const etat = compte?.etatOuverture ?? "aucun";

  // Garde de session, puis aiguillage à l'activation : l'écran « Félicitations »
  // (/app/activation) est montré une seule fois quand le compte devient actif,
  // avant le tutoriel. Le tutoriel présente le tableau de bord complet : on ne
  // le déclenche qu'une fois le compte actif ; avant, l'accueil « découverte »
  // se résume au parcours d'ouverture et se passe d'explication.
  useEffect(() => {
    if (chargement) return;
    if (!session) {
      router.replace("/app/bienvenue");
      return;
    }
    if (!compte?.ouvert) return;
    if (!window.localStorage.getItem("treepi.activation-vue")) {
      router.replace("/app/activation");
      return;
    }
    if (!window.localStorage.getItem("treepi.tuto-vu")) {
      router.replace("/app/tutoriel");
    }
  }, [chargement, session, router, compte]);

  // Pendant la vérification du paiement d'ouverture : re-lecture périodique du
  // compte pour basculer sans rechargement dès que la validation (simulée)
  // aboutit. Le vrai backend préviendra par notification.
  useEffect(() => {
    if (etat !== "attente-validation") return;
    const id = window.setInterval(() => {
      const maj = obtenirCompte();
      if (maj.etatOuverture !== "attente-validation") setCompte(maj);
    }, 5000);
    return () => window.clearInterval(id);
  }, [etat]);

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
              {/* Tant que le compte n'est pas actif, la carte du solde cède sa
                  place au parcours d'ouverture : ouvrir le dossier, reprendre
                  le paiement, ou patienter pendant la vérification. */}
              {etat === "actif" ? (
                <CarteSolde soldeEuros={compte.soldeEuros} />
              ) : etat === "attente-paiement" ? (
                <CarteOuverture variante="paiement" />
              ) : etat === "attente-validation" ? (
                <div className="flex items-center gap-3 rounded-[20px] border border-grey-200 bg-white p-5 shadow-app lg:p-6">
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-lighter/40">
                    <span className="size-5 animate-spin rounded-full border-2 border-primary-light border-t-transparent" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold leading-5 text-dark">{t("ouverture.verificationTitre")}</span>
                    <span className="mt-0.5 block text-xs leading-4 text-grey">{t("ouverture.verificationTexte")}</span>
                  </span>
                </div>
              ) : (
                <CarteOuverture />
              )}

              {/* Compte actif mais jamais alimenté (pack « compte ») : pousser
                  la première recharge, qui constitue la preuve de fonds. */}
              {etat === "actif" && compte.soldeEuros === 0 && (
                <Link
                  href="/app/recharger"
                  className="flex items-center gap-3 rounded-2xl border border-secondary/30 bg-peach/60 p-3.5 transition-all hover:shadow-app"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold leading-5 text-dark">{t("financementTitre")}</span>
                    <span className="block text-xs leading-4 text-grey">{t("financementTexte")}</span>
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-grey-300">
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </Link>
              )}

              <Bandeaux phase={compte.phase} />
              {etat === "actif" && <Transactions transactions={compte.transactions} />}
              <CarteAjoutVisa statutInitial={compte.statutVisa ?? "aucun"} />
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
