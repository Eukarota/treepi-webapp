"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Session } from "@/lib/api/types";
import { seDeconnecter, sessionCourante } from "@/lib/api/auth";

/*
 * Contexte de session de l'application.
 *
 * Restaure la session simulée au montage (localStorage) et expose de quoi
 * la mettre à jour après connexion/inscription. Quand le backend existera,
 * seule lib/api changera : ce contexte et les écrans resteront identiques.
 */

interface ContexteSession {
  /** Session active, null si visiteur. */
  session: Session | null;
  /** Vrai tant que la restauration initiale n'est pas terminée. */
  chargement: boolean;
  /** Mémorise la session renvoyée par lib/api après connexion/inscription. */
  ouvrirSession: (session: Session) => void;
  /** Déconnecte et purge la session persistée. */
  fermerSession: () => Promise<void>;
}

const Contexte = createContext<ContexteSession | null>(null);

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [chargement, setChargement] = useState(true);

  // Restauration de la session persistée, uniquement côté client.
  useEffect(() => {
    setSession(sessionCourante());
    setChargement(false);
  }, []);

  const ouvrirSession = useCallback((nouvelle: Session) => setSession(nouvelle), []);

  const fermerSession = useCallback(async () => {
    await seDeconnecter();
    setSession(null);
  }, []);

  const valeur = useMemo(
    () => ({ session, chargement, ouvrirSession, fermerSession }),
    [session, chargement, ouvrirSession, fermerSession]
  );

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

/** Accès au contexte de session (à utiliser sous SessionProvider). */
export function useSession(): ContexteSession {
  const contexte = useContext(Contexte);
  if (!contexte) throw new Error("useSession doit être utilisé sous SessionProvider.");
  return contexte;
}
