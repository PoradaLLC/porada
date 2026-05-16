import type { ReactNode } from "react";
import { posts as postModules } from "@/content/blog/posts";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  readingMinutes: number;
  tags: string[];
  body: ReactNode;
};

const byDateDesc = (a: BlogPost, b: BlogPost) =>
  b.publishedAt.localeCompare(a.publishedAt);

export function getAllPosts(): BlogPost[] {
  return [...postModules].sort(byDateDesc);
}

export function getPostSlugs(): string[] {
  return postModules.map((p) => p.slug);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return postModules.find((p) => p.slug === slug);
}

export function formatPublishDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
