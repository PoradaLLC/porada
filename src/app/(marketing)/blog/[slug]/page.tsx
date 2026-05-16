import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatPublishDate,
  getAllPosts,
  getPostBySlug,
  getPostSlugs,
} from "@/lib/blog";

const SITE_URL = "https://poradasolutions.com";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Notes", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article>
        <header className="page-hero wrap">
          <div className="eyebrow" style={{ marginBottom: 20 }}>
            <Link href="/blog">§ Notes</Link> · {formatPublishDate(post.publishedAt)} ·{" "}
            {post.readingMinutes} min
          </div>
          <h1 className="display">{post.title}</h1>
          <p className="lede">{post.description}</p>
          <div className="post-byline">
            By <strong>{post.author}</strong>
          </div>
        </header>

        <section className="wrap">
          <div className="post-body">{post.body}</div>

          <div className="post-tags">
            {post.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </section>
      </article>

      {related.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="eyebrow" style={{ marginBottom: 24 }}>
              § Keep reading
            </div>
            <ul className="blog-list blog-list-compact">
              {related.map((p) => (
                <li key={p.slug} className="blog-list-item">
                  <Link href={`/blog/${p.slug}`} className="blog-list-link">
                    <div className="blog-list-meta">
                      <time dateTime={p.publishedAt}>{formatPublishDate(p.publishedAt)}</time>
                      <span aria-hidden="true">·</span>
                      <span>{p.readingMinutes} min read</span>
                    </div>
                    <h2 className="blog-list-title">{p.title}</h2>
                    <p className="blog-list-desc">{p.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2
            className="display"
            style={{
              fontSize: "clamp(32px, 4vw, 56px)",
              maxWidth: "22ch",
              margin: "0 auto",
              letterSpacing: "-0.02em",
            }}
          >
            Working on something we&apos;d be useful for?
          </h2>
          <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/quote" className="btn btn-primary">
              Get a quote →
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Or just say hi
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
