"use client";

import { useEffect, useState } from "react";

/*
 * Mot tournant du héro (« africains », « camerounais », ...) : le mot actif
 * glisse vers le haut à intervalle régulier, comme sur le site en production.
 */
export default function RotatingWords({
  words,
  interval = 2500,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const minuterie = setInterval(() => {
      // Sortie du mot courant puis entrée du suivant.
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 300);
    }, interval);
    return () => clearInterval(minuterie);
  }, [words.length, interval]);

  return (
    <span
      className={`${className} inline-block transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
    >
      {words[index]}
    </span>
  );
}
