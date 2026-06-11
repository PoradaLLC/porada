import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatPublishDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Notes — Field notes on websites, web tech, and small business",
  description:
    "Practical writing from Porada Solutions on websites, web performance, platform choices, and small business tech — for owners, operators, and the people who hire us.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Notes | Porada Solutions",
    description:
      "Practical field notes on websites, web tech, and small business — from a three-person studio in NY/NJ/PA.",
    url: "/blog",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="page-hero wrap">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          § Notes · Field writing from the studio
        </div>
        <h1 className="display">
          Honest notes on <em>websites</em>, web tech, and small business.
        </h1>
        <p className="lede">
          We write when we have something useful to say — not on a content calendar. Pricing without
          theater, performance without jargon, platform choices without a referral fee. If a post helps
          you decide something, it did its job.
        </p>
      </section>

      <section className="wrap">
        <ul className="blog-list">
          {posts.map((post) => (
            <li key={post.slug} className="blog-list-item">
              <Link href={`/blog/${post.slug}`} className="blog-list-link">
                <div className="blog-list-meta">
                  <time dateTime={post.publishedAt}>{formatPublishDate(post.publishedAt)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
                <h2 className="blog-list-title">{post.title}</h2>
                <p className="blog-list-desc">{post.description}</p>
                <div className="blog-list-tags">
                  {post.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

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
            Got a question we should write about?
          </h2>
          <p className="lede" style={{ marginTop: 20, maxWidth: 540, marginInline: "auto" }}>
            Email it over. If it&apos;s the kind of thing other small business owners are asking, it
            probably deserves a post.
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-primary">
              Ask us a question →
            </Link>
            <Link href="/quote" className="btn btn-ghost">
              Or get a quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
