import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/landing/Hero";
import TrustBar from "@/components/landing/TrustBar";
import Problem from "@/components/landing/Problem";
import TreepersCarousel from "@/components/landing/TreepersCarousel";
import Solutions from "@/components/landing/Solutions";
import GlobeSection from "@/components/landing/GlobeSection";
import AppShowcase from "@/components/landing/AppShowcase";
import VisaSteps from "@/components/landing/VisaSteps";
import TravelReasons from "@/components/landing/TravelReasons";
import SecurePayment from "@/components/landing/SecurePayment";
import RecoursInsurance from "@/components/landing/RecoursInsurance";
import Services from "@/components/landing/Services";
import Humanly from "@/components/landing/Humanly";
import Security from "@/components/landing/Security";
import LandingFaq from "@/components/landing/LandingFaq";

/*
 * Page d'accueil : reproduction 1:1 de la home en production (treepi.app).
 * L'ordre des sections suit exactement le site en ligne : héro, bandeau de
 * confiance, « Enfin un compte... », carrousel des Treepers, solutions,
 * globe « Voyage. Paye. », vitrine de l'app, « Visa facilité » (01/02/03),
 * « Je voyage pour », paiement simplifié, assurance recours, « Le plein de
 * services », impact humain, sécurité, FAQ. La barre de navigation et le
 * pied de page restent ceux du projet.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustBar />
      <Problem />
      <TreepersCarousel />
      <Solutions />
      <GlobeSection />
      <AppShowcase />
      <VisaSteps />
      <TravelReasons />
      <SecurePayment />
      <RecoursInsurance />
      <Services />
      <Humanly />
      <Security />
      <LandingFaq />
    </>
  );
}
