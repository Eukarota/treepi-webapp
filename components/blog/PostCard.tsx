import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/blog";

/*
 * Carte d'article du blog Nomadee.
 * Correction du bug historique : la carte réagit désormais clairement au
 * survol, élévation + ombre renforcée + zoom doux de l'image de couverture.
 */

const CATEGORY_STYLES: Record<string, string> = {
  voyage: "bg-primary-lighter text-primary",
  visa: "bg-secondary/10 text-secondary",
  payment: "bg-info text-primary",
};

export default function PostCard({ post }: { post: BlogPost }) {
  const t = useTranslations("blog");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card-surface group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(18,35,71,0.15)]"
    >
      {post.cover && (
        <div className="h-44 overflow-hidden">
          <img
            src={post.cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${CATEGORY_STYLES[post.category] ?? "bg-grey-light text-navy"}`}>
            {post.category}
          </span>
          {post.readingTime && <span className="text-xs text-grey">{t("readingTime", { minutes: post.readingTime })}</span>}
        </div>
        <h3 className="mt-3 font-outfit text-lg font-bold leading-snug text-navy transition-colors duration-200 group-hover:text-primary">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-grey">{post.excerpt}</p>}
        <div className="mt-4 flex items-center gap-2.5">
          {post.avatar && <img src={post.avatar} alt="" className="h-8 w-8 rounded-full object-cover" loading="lazy" />}
          <div>
            <div className="text-xs font-bold text-navy">{post.author}</div>
            <div className="text-[11px] text-grey">{post.date}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
