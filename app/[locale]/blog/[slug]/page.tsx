import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PostCard from "@/components/blog/PostCard";
import { getAllPosts, getPost, getRelatedPosts } from "@/lib/blog";
import { routing } from "@/i18n/routing";

/*
 * Page article du blog Nomadee.
 * Le corps de l'article (HTML nettoyé lors de la migration) est rendu
 * avec une mise en forme éditoriale maison, aux couleurs Treepi.
 */

export function generateStaticParams() {
  // Toutes les combinaisons locale × article sont pré-générées au build.
  return routing.locales.flatMap((locale) =>
    getAllPosts().map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title}, Nomadee`, description: post.excerpt };
}

const CATEGORY_STYLES: Record<string, string> = {
  voyage: "bg-primary-lighter text-primary",
  visa: "bg-secondary/10 text-secondary",
  payment: "bg-info text-primary",
};

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const post = getPost(slug);
  if (!post) notFound();
  const related = getRelatedPosts(slug);

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6">
        <Link href="/blog" className="text-sm font-bold text-primary transition-colors hover:text-navy">
          {t("backToBlog")}
        </Link>

        {/* En-tête */}
        <header className="mt-6">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_STYLES[post.category] ?? "bg-grey-light text-navy"}`}>
            {post.category}
          </span>
          <h1 className="mt-4 font-outfit text-3xl font-bold leading-tight text-navy sm:text-4xl">{post.title}</h1>
          <div className="mt-5 flex items-center gap-3">
            {post.avatar && <img src={post.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />}
            <div>
              <div className="text-sm font-bold text-navy">{post.author}</div>
              <div className="text-xs text-grey">
                {post.date}
                {post.readingTime ? ` · ${t("readingTime", { minutes: post.readingTime })}` : ""}
              </div>
            </div>
          </div>
          {locale !== "fr" && (
            <p className="mt-5 rounded-xl bg-info/60 px-4 py-3 text-xs font-medium text-navy">{t("frenchOnly")}</p>
          )}
          {post.cover && (
            <img src={post.cover} alt="" className="mt-8 h-64 w-full rounded-2xl object-cover sm:h-80 lg:h-96" />
          )}
        </header>

        {/* Corps de l'article, styles éditoriaux Treepi. */}
        <div
          className="mt-10 text-[15px] leading-relaxed text-navy/85
            [&_a]:font-bold [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/30 [&_a]:underline-offset-2 hover:[&_a]:decoration-primary
            [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-grey-light [&_blockquote]:p-5 [&_blockquote]:italic
            [&_h2]:mt-10 [&_h2]:font-outfit [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy
            [&_h3]:mt-8 [&_h3]:font-outfit [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-navy
            [&_h4]:mt-6 [&_h4]:font-outfit [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-navy
            [&_img]:my-8 [&_img]:w-full [&_img]:rounded-2xl
            [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6
            [&_p]:mt-4 [&_strong]:font-bold [&_strong]:text-navy
            [&_table]:mt-6 [&_table]:w-full [&_td]:border [&_td]:border-grey-light [&_td]:p-2.5 [&_th]:border [&_th]:border-grey-light [&_th]:bg-grey-light [&_th]:p-2.5
            [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </article>

      {/* À lire ensuite */}
      {related.length > 0 && (
        <section className="bg-grey-light">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <h2 className="font-outfit text-2xl font-bold text-navy">{t("continueReading")}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
