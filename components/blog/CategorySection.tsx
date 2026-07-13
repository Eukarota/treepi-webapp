"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PostCard from "@/components/blog/PostCard";
import type { BlogPost } from "@/lib/blog";

/*
 * Section de catégorie du listing Nomadee : trois articles visibles,
 * bouton « Voir plus » pour dérouler le reste de la catégorie.
 */
export default function CategorySection({ title, posts }: { title: string; posts: BlogPost[] }) {
  const t = useTranslations("blog");
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? posts : posts.slice(0, 3);

  if (!posts.length) return null;

  return (
    <section className="mt-12 first:mt-0">
      <h2 className="font-outfit text-xl font-bold text-navy sm:text-2xl">{title}</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      {posts.length > 3 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-xl bg-gradient-to-r from-primary to-primary-light px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(5,160,199,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(5,160,199,0.4)]"
          >
            {expanded ? t("seeLess") : t("seeMore")}
          </button>
        </div>
      )}
    </section>
  );
}
