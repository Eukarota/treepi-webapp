"use client";

import FluxSouscription from "@/components/app/flux/FluxSouscription";

/*
 * Flux « Assurance voyage Schengen » : souscription à l'assurance obligatoire
 * pour le visa (90 €/an). Réutilise la mécanique de souscription commune.
 */
export default function PageAssurance() {
  return <FluxSouscription namespace="app.flux.assurance" serviceId="assurance" />;
}
