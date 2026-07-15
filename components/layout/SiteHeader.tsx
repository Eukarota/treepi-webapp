"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import Button from "@/components/ui/Button";

/*
 * En-tête du site, navigation resserrée pour ne pas perdre l'utilisateur :
 *  – trois entrées seulement : « Solutions » (méga-menu à deux groupes),
 *    « Tarifs » et « Nomadee » ;
 *  – à droite : sélecteur FR/EN, « Se connecter » et le CTA « Ouvrir mon compte » ;
 *  – barre translucide avec flou et ombre au défilement, menu plein écran mobile.
 */

type MenuEntry = { href: string; label: string; desc: string };

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-lg px-3.5 py-2 text-sm font-medium text-navy transition-colors duration-200 hover:bg-primary/5 hover:text-primary"
    >
      {label}
    </Link>
  );
}

/*
 * Langues disponibles. Pour en ajouter une : compléter cette liste (et la
 * config `routing`/les fichiers `messages/*.json`). Le drapeau est un emoji
 * régional — léger et sans asset à charger.
 */
type LangOption = { code: Locale; label: string; flag: string };

const LANGUAGES: LangOption[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

/* Sélecteur de langue : menu déroulant drapeau + libellé, garde la page courante. */
function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const switchTo = (target: Locale) => {
    setOpen(false);
    if (target !== locale) router.replace(pathname, { locale: target });
  };

  // Ferme au clic extérieur et à la touche Échap.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-200 hover:bg-primary/5 hover:text-primary ${
          open ? "bg-primary/5 text-primary" : "text-navy"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Langue : ${current.label}`}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="uppercase">{current.code}</span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 min-w-[168px] overflow-hidden rounded-xl bg-white p-1.5 shadow-[0_20px_60px_rgba(18,35,71,0.18)]"
        >
          {LANGUAGES.map((l) => {
            const active = l.code === locale;
            return (
              <li key={l.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => switchTo(l.code)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                    active ? "bg-primary/5 font-bold text-primary" : "font-medium text-navy hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <span className="text-base leading-none">{l.flag}</span>
                  <span className="flex-1 text-left">{l.label}</span>
                  {active && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M11.5 4L6 9.5 3 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const t = useTranslations("common.nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Les deux groupes du méga-menu « Solutions ».
  const groups: { title: string; entries: MenuEntry[] }[] = [
    {
      title: t("groupAccount"),
      entries: [
        { href: "/compte-euro", label: t("compteEuro"), desc: t("descCompteEuro") },
        { href: "/recharge", label: t("recharge"), desc: t("descRecharge") },
        { href: "/attestation-garantie", label: t("attestation"), desc: t("descAttestation") },
        { href: "/carte", label: t("carte"), desc: t("descCarte") },
      ],
    },
    {
      title: t("groupInsurance"),
      entries: [
        { href: "/assurance-voyage", label: t("assuranceVoyage"), desc: t("descAssuranceVoyage") },
        { href: "/assurance-recours", label: t("assuranceRecours"), desc: t("descAssuranceRecours") },
      ],
    },
  ];

  // Ombre légère dès que la page défile.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme le méga-menu au clic extérieur.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "shadow-[0_2px_20px_rgba(18,35,71,0.08)]" : ""
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4 sm:px-6" aria-label="Navigation principale">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="Treepi, accueil">
          <img src="/logo.webp" alt="Treepi" className="h-8 w-auto" />
        </Link>

        {/* Liens desktop : trois entrées seulement */}
        <div className="mx-auto hidden items-center gap-1 lg:flex" ref={menuRef}>
          <button
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200 hover:bg-primary/5 hover:text-primary ${
              menuOpen ? "bg-primary/5 text-primary" : "text-navy"
            }`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
          >
            {t("solutions")}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}>
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Méga-menu Solutions */}
          {menuOpen && (
            <div className="absolute left-1/2 top-full w-[620px] -translate-x-1/2 rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(18,35,71,0.18)]">
              <div className="grid grid-cols-2 gap-6">
                {groups.map((group) => (
                  <div key={group.title}>
                    <div className="px-3 text-xs font-bold uppercase tracking-wider text-grey">{group.title}</div>
                    <div className="mt-2 flex flex-col">
                      {group.entries.map((entry) => (
                        <Link
                          key={entry.href}
                          href={entry.href}
                          onClick={closeAll}
                          className="group rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-primary/5"
                        >
                          <span className="block text-sm font-bold text-navy transition-colors group-hover:text-primary">
                            {entry.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-grey">{entry.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <NavLink href="/tarifs" label={t("tarifs")} />
          <NavLink href="/blog" label={t("blog")} />
        </div>

        {/* Actions à droite */}
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <LangSwitcher />
          {/* TODO (phase webapp) : brancher sur les vraies pages d'authentification. */}
          <Button variant="ghost" size="sm" href="/compte-euro">
            {t("login")}
          </Button>
          <Button variant="primary" size="md" href="/compte-euro">
            {t("signup")}
          </Button>
        </div>

        {/* Burger mobile */}
        <button
          className="ml-auto grid h-10 w-10 place-items-center rounded-lg text-navy transition-colors hover:bg-primary/5 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          <div className="flex w-5 flex-col gap-1.5">
            <span className={`h-0.5 rounded bg-current transition-transform duration-300 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 rounded bg-current transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 rounded bg-current transition-transform duration-300 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Menu mobile : mêmes groupes que le méga-menu */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-grey-light bg-white px-4 pb-6 pt-3 lg:hidden">
          {groups.map((group) => (
            <div key={group.title} className="mb-4">
              <div className="px-3 pb-1 text-xs font-bold uppercase tracking-wider text-grey">{group.title}</div>
              {group.entries.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  onClick={closeAll}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-navy transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  {entry.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="mb-4 flex flex-col border-t border-grey-light pt-3">
            <NavLink href="/tarifs" label={t("tarifs")} onClick={closeAll} />
            <NavLink href="/blog" label={t("blog")} onClick={closeAll} />
          </div>
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <Button variant="ghost" size="sm" href="/compte-euro" onClick={closeAll}>
              {t("login")}
            </Button>
            <Button variant="primary" size="md" href="/compte-euro" className="flex-1" onClick={closeAll}>
              {t("signup")}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
