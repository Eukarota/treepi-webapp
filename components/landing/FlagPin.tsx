"use client";

import { useEffect, useState } from "react";

/*
 * Épingle de destination du planisphère « Voyage. Paye. » : l'asset
 * country_vector.svg (goutte turquoise) portant un drapeau rond, plantée
 * sur le pays visé. Les coordonnées sont exprimées en % de l'image
 * planete.svg ; l'épingle pivote pour viser le centre de la planète
 * (axe aligné sur le rayon, base parallèle à la surface). Elle glisse
 * d'un pays à l'autre toutes les 3 secondes, drapeau synchronisé.
 */

/* Coordonnées en % de la boîte 1280x405 du planisphère (pointe de la goutte
   posée sur le pays), calibrées sur capture. */
const DESTINATIONS = [
  /* USA : centre des États-Unis ; l'épingle penche vers la gauche. */
  { drapeau: "/images/usa.webp", alt: "Drapeau des USA", x: 17.2, y: 47.9, angle: -22 },
  /* France : Europe de l'Ouest, sous le sommet de l'arc. */
  { drapeau: "/images/france.webp", alt: "Drapeau de la France", x: 49.6, y: 30.9, angle: 0 },
  /* Japon : archipel à droite ; l'épingle penche vers la droite. */
  { drapeau: "/images/japan.webp", alt: "Drapeau du Japon", x: 84.4, y: 45.4, angle: 23 },
];

export default function FlagPin() {
  const [etape, setEtape] = useState(1);

  useEffect(() => {
    const minuterie = setInterval(() => setEtape((i) => (i + 1) % DESTINATIONS.length), 3000);
    return () => clearInterval(minuterie);
  }, []);

  const dest = DESTINATIONS[etape];

  return (
    <div
      className="absolute z-10 transition-all duration-1000 ease-in-out"
      style={{ left: `${dest.x}%`, top: `${dest.y}%` }}
      aria-hidden
    >
      {/* La pointe de la goutte est posée sur le pays (translate -50 %,
          -100 %), la rotation pivote autour de cette pointe. */}
      {/* Cotes du site en production : goutte 96x112 et drapeau 64px en lg. */}
      <div
        className="relative h-12 w-8 -translate-x-1/2 -translate-y-full transition-transform duration-1000 ease-in-out sm:h-20 sm:w-16 md:h-24 md:w-20 lg:h-28 lg:w-24"
        style={{ transform: `translate(-50%, -100%) rotate(${dest.angle}deg)`, transformOrigin: "50% 100%" }}
      >
        <img
          src="/images/country_vector.svg"
          alt="Ellipse"
          className="absolute left-0 top-0 h-full w-full object-contain"
        />
        <img
          key={dest.drapeau}
          src={dest.drapeau}
          alt={dest.alt}
          className="absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-[71%] rounded-full object-cover sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16"
        />
      </div>
    </div>
  );
}
