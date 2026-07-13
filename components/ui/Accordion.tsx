"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

/*
 * Accordéon FAQ du design system.
 * Cartes blanches arrondies, icône +/× corail, ouverture animée en hauteur.
 * Un seul élément ouvert à la fois (comportement des maquettes).
 */

export type AccordionItem = {
  question: ReactNode;
  answer: ReactNode;
};

function AccordionRow({
  item,
  open,
  onToggle,
}: {
  item: AccordionItem;
  open: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`card-surface overflow-hidden transition-shadow duration-300 ${
        open ? "shadow-[0_8px_30px_rgba(18,35,71,0.10)]" : "hover:shadow-[0_6px_24px_rgba(18,35,71,0.10)]"
      }`}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="font-outfit text-sm font-bold text-navy sm:text-base">{item.question}</span>
        {/* Icône +/× : rotation animée au lieu d'un swap brutal. */}
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary/10 text-secondary transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div
        ref={bodyRef}
        className="overflow-hidden px-6 transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? bodyRef.current?.scrollHeight ?? 1000 : 0 }}
      >
        <div className="pb-6 text-sm leading-relaxed text-grey">{item.answer}</div>
      </div>
    </div>
  );
}

export default function Accordion({ items, className = "" }: { items: AccordionItem[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {items.map((item, i) => (
        <AccordionRow
          key={i}
          item={item}
          open={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}
