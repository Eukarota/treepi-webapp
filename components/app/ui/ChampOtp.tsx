"use client";

import { useRef } from "react";

/*
 * Saisie du code OTP (maquette « Inscription/Email/Step3/3 ») : une case
 * par chiffre. Cases remplies : fond blanc bordé turquoise ; cases vides :
 * fond gris 100. Le focus avance/recule automatiquement à la saisie.
 */
export default function ChampOtp({
  longueur = 6,
  valeur,
  onChange,
}: {
  longueur?: number;
  /** Code en cours de saisie (chaîne de 0 à `longueur` chiffres). */
  valeur: string;
  onChange: (code: string) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const saisir = (index: number, texte: string) => {
    // Ne garde que les chiffres (gère aussi le collage d'un code complet).
    const chiffres = texte.replace(/\D/g, "");
    if (!chiffres) return;
    const suivant = (valeur.slice(0, index) + chiffres).slice(0, longueur);
    onChange(suivant);
    refs.current[Math.min(suivant.length, longueur - 1)]?.focus();
  };

  const effacer = (index: number) => {
    onChange(valeur.slice(0, Math.max(0, index)));
    refs.current[Math.max(0, index - 1)]?.focus();
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length: longueur }, (_, i) => {
        const chiffre = valeur[i] ?? "";
        return (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Chiffre ${i + 1}`}
            value={chiffre}
            onChange={(e) => saisir(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                e.preventDefault();
                effacer(chiffre ? i : i - 1);
              }
            }}
            className={
              "size-10 rounded-lg text-center text-base font-bold text-dark outline-none transition-colors " +
              (chiffre
                ? "border border-primary-light bg-white"
                : "border border-transparent bg-grey-100 focus:border-primary-light focus:bg-white")
            }
          />
        );
      })}
    </div>
  );
}
