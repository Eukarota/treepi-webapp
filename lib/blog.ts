import postsData from "@/content/blog-posts.json";

/*
 * Accès aux articles du blog Nomadee.
 * Les articles sont issus de la migration du blog Treepi existant
 * (contenu en français) et stockés dans `content/blog-posts.json`.
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

export function getAllPosts(): BlogPost[] {
  return postsData as BlogPost[];
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
