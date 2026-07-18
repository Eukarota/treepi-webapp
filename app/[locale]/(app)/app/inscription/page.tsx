"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { creerCompte } from "@/lib/api/auth";
import { BrouillonInscription } from "@/lib/api/types";
import { useSession } from "@/components/app/SessionProvider";
import EcranApp from "@/components/app/EcranApp";
import FondApp from "@/components/app/ui/FondApp";
import PhaseEmail from "@/components/app/inscription/PhaseEmail";
import PhaseMotDePasse from "@/components/app/inscription/PhaseMotDePasse";
import PhaseInfos from "@/components/app/inscription/PhaseInfos";
import PhaseTelephone from "@/components/app/inscription/PhaseTelephone";
import EcranBravo from "@/components/app/inscription/EcranBravo";

/*
 * Flux d'inscription (section « Onboarding/Création de compte utilisateur »
 * des maquettes) : orchestration des 4 phases puis écran de confirmation.
 *
 *   email (3 sous-étapes) → mot de passe → informations personnelles
 *   (3 sous-étapes) → numéro de téléphone → « Bravo ! »
 *
 * Le brouillon d'inscription est accumulé phase par phase ; la création du
 * compte (simulée par lib/api, TODO backend) intervient à la validation du
 * téléphone et ouvre directement la session.
 */

type Phase = "email" | "motDePasse" | "infos" | "telephone" | "bravo";

export default function PageInscription() {
  const router = useRouter();
  const { ouvrirSession } = useSession();
  const [phase, setPhase] = useState<Phase>("email");
  const [brouillon, setBrouillon] = useState<BrouillonInscription>({});
  const [creation, setCreation] = useState(false);
  const [erreurCreation, setErreurCreation] = useState<string | null>(null);

  /** La croix annule l'inscription et ramène à la page d'accueil du site. */
  const quitter = () => router.push("/");
  /** La flèche retour de la première étape revient à l'écran de bienvenue. */
  const retourBienvenue = () => router.push("/app/bienvenue");

  /** Fin du flux : création du compte simulée puis écran « Bravo ! ». */
  const finaliser = async (telephone: string) => {
    setCreation(true);
    setErreurCreation(null);
    const complet = { ...brouillon, telephone };
    setBrouillon(complet);
    const resultat = await creerCompte(complet);
    setCreation(false);
    if (!resultat.ok) {
      // Cas limite (email déjà pris entre-temps) : retour à la phase email.
      setErreurCreation(resultat.erreur);
      setPhase("email");
      return;
    }
    ouvrirSession(resultat.donnees);
    setPhase("bravo");
  };

  return (
    <EcranApp className="bg-grey-light">
      {/* Fond de marque visible autour du panneau centré sur desktop. */}
      {phase !== "bravo" && <FondApp />}
      {phase === "email" && (
        <PhaseEmail
          emailInitial={brouillon.email}
          onTerminee={(email) => {
            setBrouillon((b) => ({ ...b, email }));
            setPhase("motDePasse");
          }}
          onAbandon={retourBienvenue}
          onQuitter={quitter}
        />
      )}
      {phase === "motDePasse" && (
        <PhaseMotDePasse
          onTerminee={(motDePasse) => {
            setBrouillon((b) => ({ ...b, motDePasse }));
            setPhase("infos");
          }}
          onRetour={() => setPhase("email")}
          onQuitter={quitter}
        />
      )}
      {phase === "infos" && (
        <PhaseInfos
          onTerminee={(infos) => {
            setBrouillon((b) => ({ ...b, ...infos }));
            setPhase("telephone");
          }}
          onRetour={() => setPhase("motDePasse")}
          onQuitter={quitter}
        />
      )}
      {phase === "telephone" && (
        <PhaseTelephone
          onTerminee={finaliser}
          onRetour={() => setPhase("infos")}
          onQuitter={quitter}
          enCours={creation}
        />
      )}
      {phase === "bravo" && <EcranBravo onContinuer={() => router.replace("/app/accueil")} />}

      {/* Erreur de création remontée par la simulation (rare). */}
      {erreurCreation && phase === "email" && (
        <p className="absolute inset-x-6 bottom-4 z-20 text-center text-xs leading-4 text-error">{erreurCreation}</p>
      )}
    </EcranApp>
  );
}
