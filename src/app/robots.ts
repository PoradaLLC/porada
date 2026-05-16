import type { MetadataRoute } from "next";

const SITE_URL = "https://poradasolutions.com";

const PRIVATE_PATHS = ["/admin", "/admin/", "/api", "/api/", "/auth", "/auth/", "/payment/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "anthropic-ai", "PerplexityBot", "Google-Extended"],
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
