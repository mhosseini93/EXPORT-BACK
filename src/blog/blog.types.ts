import type { SeoFields } from '../common/seo.js';

export const POST_STATUSES = ['draft', 'published'] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export interface BlogCategoryData {
  name: string;
  /** Empty = the name is used as the page heading. */
  h1: string;
  intro: string;
  seo: SeoFields;
}

export interface BlogCategoryInput extends BlogCategoryData {
  slug: string;
}

export interface BlogCategory extends BlogCategoryInput {
  id: number;
  position: number;
  /** Published, already-live posts in this category. */
  postCount: number;
  updatedAt: string;
}

export interface BlogPostData {
  /** The post's h1. */
  title: string;
  excerpt: string;
  /** Markdown-like text: "## h2", "### h3", "- list", "1. list", "> quote", [link](/url), **bold**. */
  body: string;
  image: string;
  imageAlt: string;
  faqs: { question: string; answer: string }[];
  seo: SeoFields;
}

export interface BlogPostInput extends BlogPostData {
  slug: string;
  categoryId: number | null;
  status: PostStatus;
  /** YYYY-MM-DD; a future date schedules the post. Empty = today when published. */
  publishedAt: string;
}

/** List item: everything except the body and FAQs. */
export interface BlogPostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  categoryId: number | null;
  status: PostStatus;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  index: boolean;
}

export interface BlogPost extends BlogPostInput {
  id: number;
  updatedAt: string;
  readingMinutes: number;
}

export interface BlogSettings {
  h1: string;
  intro: string;
  pageSize: number;
  seo: SeoFields;
}
