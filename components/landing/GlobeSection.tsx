"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/*
 * Section « Voyage. Paye. Dépasse tes limites. », le planisphère et son marqueur.
 *
 * Le marqueur est ancré directement sur la carte par des coordonnées relevées
 * sur l'image (fx : fraction horizontale depuis le centre, fy : fraction de la
 * hauteur de la carte). Sa pointe touche le pays visé et il s'incline
 * proportionnellement à la longitude pour rester perpendiculaire à la surface
 * du globe (pointe orientée vers le centre de la Terre).
 */

const STOPS = [
  { flag: "/images/usa.webp", alt: "🇺🇸", fx: -0.37, fy: 0.46 },
  { flag: "/images/japan.webp", alt: "🇯🇵", fx: 0.355, fy: 0.5 },
  { flag: "/images/france.webp", alt: "🇫🇷", fx: -0.05, fy: 0.31 },
];

// Inclinaison max : ±55° au bord de la carte (lecture naturelle du fisheye).
const TILT_FACTOR = 55;

export default function GlobeSection() {
  const t = useTranslations("landing.globe");
  const [stop, setStop] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setStop((s) => (s + 1) % STOPS.length), 3000);
    return () => clearInterval(interval);
  }, []);

  const current = STOPS[stop];
  const angle = current.fx * TILT_FACTOR;

  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6">
        {/* Planisphère + marqueur ancré sur la carte */}
        <div className="relative mx-auto max-w-[1100px]">
          <img src="/images/planete.svg" alt="" className="h-auto w-full object-contain" />
          <div
            className="absolute transition-all duration-1000 ease-in-out"
            style={{
              left: `calc(50% + ${current.fx * 100}%)`,
              top: `${current.fy * 100}%`,
              // La pointe du marqueur (bas centre) touche le point visé.
              transform: `translate(-50%, -100%) rotate(${angle}deg)`,
              transformOrigin: "50% 100%",
            }}
          >
            <div className="relative h-16 w-12 sm:h-24 sm:w-[72px]">
              {/* Épingle : ratio intrinsèque 80 × 107, tête centrée à (50 %, 37.6 %). */}
              <img src="/images/country_vector.svg" alt="" className="absolute inset-0 h-full w-full" />
              <img
                key={current.flag}
                src={current.flag}
                alt={current.alt}
                className="absolute left-1/2 top-[37.6%] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover sm:h-12 sm:w-12"
              />
            </div>
          </div>
        </div>

        {/* Titre et engagement */}
        <div className="relative z-10 mx-auto -mt-10 max-w-3xl text-center sm:-mt-16">
          <h2 className="font-outfit text-4xl font-bold leading-tight sm:text-5xl">
            <span className="text-gradient-primary">{t("title1")}</span>{" "}
            <span className="text-gradient-secondary">{t("title2")}</span>
            <br />
            <span className="text-gradient-secondary">{t("title3")}</span>{" "}
            <span className="text-gradient-primary">{t("title4")}</span>
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-grey sm:text-base">{t("subtitle")}</p>
        </div>
      </div>
    </section>
  );
}
