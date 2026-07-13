import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import "../globals.css";

// Métadonnées localisées : titre/description selon la langue de la page.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === "en"
      ? "Treepi, The European account for African travellers"
      : "Treepi, Le compte européen des voyageurs africains";
  const description =
    locale === "en"
      ? "The financial infrastructure for African travellers heading to Europe. Account, attestations, insurance, through the front door."
      : "L'infrastructure financière des voyageurs africains vers l'Europe. Compte, attestations, assurances, par la grande porte.";
  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "Treepi",
      title,
      description,
      url: "https://www.treepi.app/",
      images: [{ url: "https://www.treepi.app/web-app-manifest-512x512.png", alt: "Logo Treepi" }],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
  };
}

// Pré-génère les deux locales au build (site statique).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
        {/* Google Analytics + Tag Manager (repris du site d'origine). */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-3KTR438F2X" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-3KTR438F2X');`}
        </Script>
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-55KDCH9D');`}
        </Script>
      </body>
    </html>
  );
}
