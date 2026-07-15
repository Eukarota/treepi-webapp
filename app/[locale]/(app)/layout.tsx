import SessionProvider from "@/components/app/SessionProvider";

/*
 * Layout du groupe (app) : coquille applicative sans chrome marketing.
 * Fournit le contexte de session simulée à tous les écrans de l'app.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
