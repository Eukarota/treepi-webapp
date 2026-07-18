"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Compteur animé (« + de 980 Treepers ») : compte de 0 à la valeur cible
 * quand l'élément entre dans le viewport, comme sur le site en production.
 */
export default function CounterUp({ value, duration = 1500 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    // Filet de sécurité : si l'observateur ne se déclenche pas (capture
    // automatisée, navigateur ancien), le compteur démarre quand même.
    const secours = setTimeout(() => setStarted(true), 2500);
    return () => {
      observer.disconnect();
      clearTimeout(secours);
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    const debut = performance.now();
    let rafId: number;
    const boucle = (t: number) => {
      const progression = Math.min((t - debut) / duration, 1);
      // Décélération douce en fin de course.
      setCurrent(Math.round(value * (1 - Math.pow(1 - progression, 3))));
      if (progression < 1) rafId = requestAnimationFrame(boucle);
    };
    rafId = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(rafId);
  }, [started, value, duration]);

  return <span ref={ref}>{current}</span>;
}
