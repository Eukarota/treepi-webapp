"use client";

import FluxSouscription from "@/components/app/flux/FluxSouscription";

/*
 * Flux « Recours visa » : souscription à l'assurance recours (offre non
 * détaillée dans le Figma, reprise du Pack 3 à 500 €/an). Réutilise la
 * mécanique de souscription commune.
 */
export default function PageRecours() {
  return <FluxSouscription namespace="app.flux.recours" serviceId="recours" teinte="corail" />;
}
