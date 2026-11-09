import {
  date,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  smallint,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import type {
  BlogCategoryData,
  BlogPostData,
  BlogSettings,
  PostStatus,
} from '../blog/blog.types.js';
import type { HomeContent } from '../home/home.types.js';
import type { PricePageData } from '../prices/prices.types.js';
import type {
  ProjectData,
  ProjectStatus,
  ProjectsSettings,
} from '../projects/projects.types.js';

/** Single-row table (id = 1) holding the editable homepage content. */
export const homeContent = pgTable('home_content', {
  id: smallint('id').primaryKey().default(1),
  content: jsonb('content').$type<Omit<HomeContent, 'updatedAt'>>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** One row per price list page; the editable content lives in `data`. */
export const pricePages = pgTable('price_pages', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  position: integer('position').notNull().default(0),
  data: jsonb('data').$type<PricePageData>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const blogCategories = pgTable('blog_categories', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 80 }).notNull().unique(),
  position: integer('position').notNull().default(0),
  data: jsonb('data').$type<BlogCategoryData>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Status, date and category are real columns so lists can filter and sort on them. */
export const blogPosts = pgTable(
  'blog_posts',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 120 }).notNull().unique(),
    categoryId: integer('category_id').references(() => blogCategories.id, {
      onDelete: 'set null',
    }),
    status: varchar('status', { length: 16 }).$type<PostStatus>().notNull(),
    publishedAt: date('published_at'),
    data: jsonb('data').$type<BlogPostData>().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('blog_posts_published_idx').on(t.status, t.publishedAt),
    index('blog_posts_category_idx').on(t.categoryId),
  ],
);

/** Single-row table (id = 1) for the /blog page heading, intro and SEO. */
export const blogSettings = pgTable('blog_settings', {
  id: smallint('id').primaryKey().default(1),
  data: jsonb('data').$type<BlogSettings>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Reference projects; status is a column so the public list can filter on it. */
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  status: varchar('status', { length: 16 }).$type<ProjectStatus>().notNull(),
  position: integer('position').notNull().default(0),
  data: jsonb('data').$type<ProjectData>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Single-row table (id = 1) for the /projects page heading, intro and SEO. */
export const projectsSettings = pgTable('projects_settings', {
  id: smallint('id').primaryKey().default(1),
  data: jsonb('data').$type<ProjectsSettings>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
