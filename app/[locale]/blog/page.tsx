import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import CategorySection from "@/components/blog/CategorySection";
import { CATEGORIES, getPostsByCategory } from "@/lib/blog";

/*
 * Listing du blog Nomadee : bannière héro au dégradé Treepi,
 * puis une section par catégorie (voyage, visa, paiement).
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog.meta" });
  return { title: t("title"), description: t("description") };
}

function Content() {
  const t = useTranslations("blog");

  return (
    <>
      {/* Bannière Nomadee */}
      <section className="px-4 pt-4 sm:px-6">
        <div className="mask-treepi relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
          <div className="relative z-10 px-6 py-16 sm:px-12 md:py-20 lg:px-16">
            <h1 className="font-outfit text-5xl font-bold text-white sm:text-6xl">
              Nomad<span className="text-gradient-secondary">ee</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">{t("heroSubtitle")}</p>
          </div>
        </div>
      </section>

      {/* Sections par catégorie */}
      <div className="bg-grey-light">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          {CATEGORIES.map((category) => (
            <CategorySection key={category} title={t(`categories.${category}`)} posts={getPostsByCategory(category)} />
          ))}
        </div>
      </div>
    </>
  );
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Content />;
}
