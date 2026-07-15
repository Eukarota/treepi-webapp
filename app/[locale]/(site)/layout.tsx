import { setRequestLocale } from "next-intl/server";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

/*
 * Layout du groupe (site) : toutes les pages marketing partagent
 * l'en-tête sticky et le pied de page 1:1 du site d'origine.
 * L'application (groupe (app)) n'utilise pas ce chrome.
 * setRequestLocale est requis ici aussi pour conserver le rendu statique.
 */
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
