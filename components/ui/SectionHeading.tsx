import type { ReactNode } from "react";

/*
 * En-tête de section standard :
 *  – étiquette majuscule corail (« eyebrow ») ;
 *  – titre H2 avec mots en dégradé (passés en ReactNode) ;
 *  – sous-titre optionnel gris centré.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto" : ""} ${className}`}>
      {eyebrow && <div className={`section-eyebrow mb-3 ${alignCls}`}>{eyebrow}</div>}
      <h2 className={`font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-5xl ${alignCls}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base leading-relaxed text-grey ${alignCls}`}>{subtitle}</p>
      )}
    </div>
  );
}
