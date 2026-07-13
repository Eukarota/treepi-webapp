import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Middleware i18n : détecte la langue du navigateur (Accept-Language),
// sert le français par défaut à la racine et l'anglais sous /en.
export default createMiddleware(routing);

export const config = {
  // Exclut les fichiers statiques, l'API et les internes Next.js.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
