import fs from "node:fs";
import path from "node:path";

/*
 * Accès aux articles du blog Nomadee.
 * Chaque article est un fichier JSON individuel dans `content/blog/`
 * (un fichier par article, nommé d'après son slug) afin de rester
 * scalable : ajouter un article = déposer un fichier.
 * Les articles sont issus de la migration du blog Treepi existant
 * (contenu en français).
 * Module serveur uniquement (lecture disque au build via `fs`).
 * TODO : brancher sur le CMS (Storyblok) lors de la phase webapp.
 */

export type BlogPost = {
  slug: string;
  category: "voyage" | "visa" | "payment";
  title: string;
  author: string;
  avatar: string | null;
  date: string;
  cover: string | null;
  body: string;
  readingTime?: number;
  excerpt?: string;
};

export const CATEGORIES = ["voyage", "visa", "payment"] as const;

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

/*
 * Les fichiers sont lus par ordre alphabétique de nom (= slug), ce qui
 * fixe l'ordre d'affichage. Mis en cache après la première lecture.
 */
let cachedPosts: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (cachedPosts) return cachedPosts;
  cachedPosts = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => JSON.parse(fs.readFileSync(path.join(POSTS_DIR, file), "utf8")) as BlogPost);
  return cachedPosts;
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

/* Articles « à lire ensuite » : même catégorie d'abord, puis les autres. */
export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const current = getPost(slug);
  if (!current) return [];
  const others = getAllPosts().filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, count);
}
