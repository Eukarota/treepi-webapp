"use client";

import { useEffect, useRef } from "react";

/*
 * Volute continue des étapes « Visa facilité » (desktop uniquement) : le trait
 * turquoise arrondi se retire le long de son tracé au fil du défilement.
 * L'effacement démarre dès que la grille entre à l'écran et s'étale sur toute
 * sa traversée, jusqu'à disparition quand son bas atteint le quart haut de la
 * fenêtre. Piloté par stroke-dashoffset (le départ du tracé est en bas, la fin
 * en haut : l'offset croissant efface le trait par le haut).
 */

/* L'offset ne descend jamais sous 172.765 (valeur du site en production) : il
   escamote le segment du tracé qui sort du viewBox, l'extrémité visible garde
   donc sa coiffe arrondie. */
const OFFSET_PLANCHER = -300;
/* Marge au-delà de la longueur du tracé pour masquer aussi la coiffe ronde
   résiduelle du dernier point. */
const MARGE_COIFFE = 10;

export default function VoluteEtapes() {
  const conteneur = useRef<HTMLDivElement>(null);
  const trace = useRef<SVGPathElement>(null);

  useEffect(() => {
    const chemin = trace.current;
    const zone = conteneur.current;
    if (!chemin || !zone) return;

    const longueur = chemin.getTotalLength();
    chemin.style.strokeDasharray = `${longueur}`;

    // Trait figé, entièrement dessiné, si l'utilisateur limite les animations.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      chemin.style.strokeDashoffset = `${OFFSET_PLANCHER}`;
      return;
    }

    let rafId = 0;
    const peindre = () => {
      rafId = 0;
      const r = zone.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quand le haut de la grille touche le bas de l'écran, 1 quand son bas
      // atteint le quart haut : l'effacement suit tout le défilement de la
      // section, sans à-coup ni précipitation.
      const p = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh * 1.25)));
      const offset =
        OFFSET_PLANCHER + p * (longueur + MARGE_COIFFE - OFFSET_PLANCHER);
      chemin.style.strokeDashoffset = `${offset}`;
    };
    const surDefilement = () => {
      if (!rafId) rafId = requestAnimationFrame(peindre);
    };

    peindre();
    window.addEventListener("scroll", surDefilement, { passive: true });
    window.addEventListener("resize", surDefilement, { passive: true });
    return () => {
      window.removeEventListener("scroll", surDefilement);
      window.removeEventListener("resize", surDefilement);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={conteneur}
      className="pointer-events-none -ml-8 -mt-10 w-[calc(100%-150px)] max-xl:hidden md:absolute md:h-[calc(100%-100px)] lg:h-[calc(100%-88px)]"
    >
      <figure className="pointer-events-none absolute inset-0 z-0 h-full w-full translate-y-32 max-xl:hidden">
        <svg
          className="h-full w-full md:absolute"
          viewBox="0 0 1113 2150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <path
            ref={trace}
            d="M1020.5 1926.6C892.501 1849.6 277 2340.1 266 2006.1C255 1672.1 471.5 1683.1 507.5 1741.6C543.5 1800.1 443.5 1940.1 266 1866.6C88.4999 1793.1 266 1058.6 498 1134.1C729.999 1209.6 1028 1243.6 1081 1058.6C1123.4 910.598 917.666 828.598 809.5 806.098C656 777.765 271 644.131 333 526.631C395 409.131 661 604.631 720.5 491.631C780 378.631 648.281 183.213 480 87.631C287.335 -21.8009 149 33.1309 -104.5 108.631"
            stroke="url(#volute_visa_grad)"
            strokeWidth="52"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id="volute_visa_grad"
              x1="-104.5"
              y1="1074.94"
              x2="1086.67"
              y2="1074.94"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#05A0C7" />
              <stop offset="1" stopColor="#09D1C7" />
            </linearGradient>
          </defs>
        </svg>
      </figure>
    </div>
  );
}
