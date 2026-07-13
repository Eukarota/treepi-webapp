import { defineRouting } from "next-intl/routing";

// Configuration des locales du site.
// Le français est la langue par défaut et n'est pas préfixé dans l'URL ;
// l'anglais est servi sous /en. La détection automatique (Accept-Language)
// est gérée par le middleware next-intl.
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
