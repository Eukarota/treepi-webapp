import { setRequestLocale, getTranslations } from "next-intl/server";
import Hero from "@/components/landing/Hero";
import TrustBar from "@/components/landing/TrustBar";
import Problem from "@/components/landing/Problem";
import Solutions from "@/components/landing/Solutions";
import AttestationSteps from "@/components/landing/AttestationSteps";
import TravelReasons from "@/components/landing/TravelReasons";
import Simulator from "@/components/landing/Simulator";
import Insurances from "@/components/landing/Insurances";
import GlobeSection from "@/components/landing/GlobeSection";
import Humanly from "@/components/landing/Humanly";
import Security from "@/components/landing/Security";
import Wall from "@/components/landing/Wall";
import LandingFaq from "@/components/landing/LandingFaq";
import FinalCta from "@/components/landing/FinalCta";

/*
 * Page d'accueil, structure issue de la maquette `wireframe/landing.png`,
 * habillée avec le design system Treepi (dégradés turquoise/corail, masques).
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing.finalCta");

  return (
    <>
      <Hero />
      <TrustBar />
      <Problem />
      <Solutions />
      <AttestationSteps />
      <TravelReasons />
      <Simulator />
      <Insurances />
      <GlobeSection />
      <Humanly />
      <Security />
      <Wall />
      <LandingFaq />
      <FinalCta title={t("title")} subtitle={t("subtitle")} />
    </>
  );
}
