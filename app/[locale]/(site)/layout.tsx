import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

/*
 * Layout du groupe (site) : toutes les pages marketing partagent
 * l'en-tête sticky et le pied de page 1:1 du site d'origine.
 * L'application (groupe (app)) n'utilise pas ce chrome.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
