import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

export const posts: BlogPost[] = [
  {
    slug: "what-a-small-business-website-actually-costs",
    title: "What a small business website actually costs in 2026",
    description:
      "An honest breakdown of what a small business pays for a website today — from $0 templates to $25k custom builds — and what each tier really gets you.",
    publishedAt: "2026-05-12",
    author: "Michal Bienias",
    readingMinutes: 6,
    tags: ["pricing", "small business", "websites"],
    body: (
      <>
        <p className="lede">
          We get this question almost every week, usually phrased the same way: <em>&ldquo;What does
          a website cost?&rdquo;</em> The honest answer is &ldquo;between zero and a hundred grand,
          depending on what you mean by website&rdquo; — which is unhelpful. So here is a useful version.
        </p>

        <h2>The four tiers, in plain English</h2>

        <h3>$0 — a templated site you build yourself</h3>
        <p>
          Squarespace, Wix, Carrd. You pay for hosting ($15–40/mo) and your own time. The work looks
          fine. It will probably look like 50,000 other sites in your industry. That is sometimes okay —
          a dentist&apos;s office doesn&apos;t need a bespoke design system.
        </p>

        <h3>$500–$2,500 — a freelancer on a template</h3>
        <p>
          You hire someone to customize a Squarespace or WordPress theme. You get a real human to talk
          to, copy edited by someone who is not you, and a site that is &ldquo;yours&rdquo; in a soft sense.
          The risk: in six months nobody remembers how to change the phone number on the homepage.
        </p>

        <h3>$3,000–$12,000 — a small studio, custom design, modern stack</h3>
        <p>
          This is most of our work. Custom visual design (no themes), built on Next.js / Astro / Eleventy,
          a CMS your team can actually use, analytics + forms + SEO wired up, plus 30 days of post-launch
          support. You should expect 2–4 weeks. If someone quotes you 6 months at this price, walk away.
        </p>

        <h3>$15,000+ — a real product build</h3>
        <p>
          Member portals, booking systems, anything with login. The price is mostly about the back-end
          and the second-order details: auth, billing, roles, observability. The marketing site is
          usually a small part of the total.
        </p>

        <h2>What people underestimate</h2>
        <ul>
          <li><strong>Copy.</strong> Most projects stall on copy, not design. Budget time for it.</li>
          <li><strong>Photography.</strong> Stock photography is free; it also looks free.</li>
          <li><strong>Maintenance.</strong> Plan on $50–200/mo for hosting, updates, and small fixes.</li>
          <li><strong>The next version.</strong> Sites are not done at launch. They start at launch.</li>
        </ul>

        <h2>So, what should you actually pay?</h2>
        <p>
          If you are a local business with five employees, the right number is probably $3,000–$6,000
          plus a small monthly retainer. If you are a 40-person org with a real marketing engine, $8,000–
          $15,000 is more honest. Anyone quoting you $499 for a &ldquo;custom site&rdquo; is selling you a template,
          which is fine — as long as you both know that&apos;s what it is.
        </p>

        <p>
          If you want a no-pressure ballpark for your specific situation, the <Link href="/quote">quote
          tool</Link> takes about 90 seconds and we&apos;ll respond within a day.
        </p>
      </>
    ),
  },
  {
    slug: "is-your-site-too-slow",
    title: "Is your site too slow? Here's how to know in 60 seconds",
    description:
      "A quick, jargon-free guide to checking whether your website is slow enough to be costing you customers — and what the numbers actually mean.",
    publishedAt: "2026-04-28",
    author: "Marcin Bienias",
    readingMinutes: 4,
    tags: ["performance", "seo", "diagnostics"],
    body: (
      <>
        <p className="lede">
          Site speed matters for two reasons: humans give up on slow pages, and Google quietly demotes them
          in search. The good news is that you can check yours in about a minute, no developer required.
        </p>

        <h2>The 60-second test</h2>
        <ol>
          <li>
            Open <a href="https://pagespeed.web.dev" target="_blank" rel="noreferrer noopener">
              pagespeed.web.dev
            </a> in a new tab.
          </li>
          <li>Paste your homepage URL. Hit analyze.</li>
          <li>Wait. Look at the <strong>Mobile</strong> tab (most of your traffic is mobile).</li>
        </ol>

        <h2>The three numbers that matter</h2>
        <p>
          Ignore the overall score for now. Scroll to <strong>Core Web Vitals</strong> and look at these
          three:
        </p>
        <ul>
          <li>
            <strong>LCP (Largest Contentful Paint).</strong> How long until the biggest thing on screen
            shows up. Under <strong>2.5s</strong> is good. Over 4s is bad.
          </li>
          <li>
            <strong>CLS (Cumulative Layout Shift).</strong> How much stuff jumps around as the page
            loads. Under <strong>0.1</strong> is good. Over 0.25 is jarring.
          </li>
          <li>
            <strong>INP (Interaction to Next Paint).</strong> How long the page takes to respond to a tap.
            Under <strong>200ms</strong> is good.
          </li>
        </ul>

        <h2>If your numbers are bad</h2>
        <p>The usual suspects, in order of how often they cause problems:</p>
        <ol>
          <li><strong>Unoptimized images.</strong> A 4MB hero photo on a phone over LTE is a real ask.</li>
          <li><strong>Too many scripts.</strong> Every analytics, chat widget, and tag manager adds weight.</li>
          <li><strong>Cheap hosting.</strong> Shared hosting that costs $4/mo performs like $4/mo hosting.</li>
          <li><strong>Old WordPress theme.</strong> Themes from 2018 ship for 2018 browsers.</li>
        </ol>

        <p>
          If you ran the test and the numbers are red, that is fixable. Most performance work pays for
          itself in a few months in better conversion and rankings. <Link href="/contact">Send us the
          PageSpeed link</Link> and we&apos;ll tell you whether it&apos;s a quick fix or a rebuild.
        </p>
      </>
    ),
  },
  {
    slug: "shopify-vs-custom-which-makes-sense",
    title: "Shopify vs custom: which one actually makes sense for your store?",
    description:
      "A practical guide for small business owners trying to decide between Shopify, WooCommerce, and a custom build — based on what you sell, not what looks shiny.",
    publishedAt: "2026-04-10",
    author: "Michal Bienias",
    readingMinutes: 5,
    tags: ["ecommerce", "shopify", "platforms"],
    body: (
      <>
        <p className="lede">
          We get asked &ldquo;Shopify or custom?&rdquo; a lot. The honest answer for most small stores is
          <em> Shopify</em>. Here is when that breaks down and a custom build starts making sense.
        </p>

        <h2>Start with Shopify if&hellip;</h2>
        <ul>
          <li>You sell physical products, 5–500 SKUs, mostly to consumers.</li>
          <li>You don&apos;t have an engineer on staff and don&apos;t want one.</li>
          <li>You ship from one or two locations, no complex inventory rules.</li>
          <li>Your margins can absorb 2% in platform fees.</li>
        </ul>
        <p>
          Shopify is the right answer for ~80% of small e-commerce stores. The product is mature, the
          ecosystem is enormous, and the cost of switching later is real but survivable.
        </p>

        <h2>Consider WooCommerce if&hellip;</h2>
        <ul>
          <li>You already run on WordPress and the content is the main thing.</li>
          <li>You sell &lt;50 SKUs and don&apos;t want monthly platform fees.</li>
          <li>You have someone on hand to keep plugins updated.</li>
        </ul>

        <h2>A custom build is worth it when&hellip;</h2>
        <ul>
          <li>
            You sell <strong>configurable</strong> products — quotes, made-to-order, multi-step builders.
            Shopify can do this with apps, but the apps fight each other.
          </li>
          <li>
            You sell <strong>B2B</strong>: net-30 terms, customer-specific pricing, approval workflows.
          </li>
          <li>
            You sell <strong>services</strong> with scheduling, capacity limits, or staff routing.
          </li>
          <li>
            You have <strong>real integrations</strong> with an ERP, warehouse system, or POS that
            don&apos;t have off-the-shelf Shopify connectors.
          </li>
        </ul>

        <h2>The trap to avoid</h2>
        <p>
          The trap is &ldquo;custom&rdquo; meaning &ldquo;built from scratch on a framework I read about
          in 2026.&rdquo; A custom storefront on top of <em>Shopify&apos;s</em> headless APIs (Hydrogen,
          Next.js, etc.) is often the right middle ground — you get a unique front-end and Shopify still
          handles checkout, taxes, and PCI.
        </p>

        <p>
          If you&apos;re weighing this for your business, write us a paragraph about what you sell and we
          will tell you the honest answer — even if it&apos;s &ldquo;just use Shopify, you don&apos;t need
          us.&rdquo; <Link href="/contact">Contact</Link>.
        </p>
      </>
    ),
  },
];
