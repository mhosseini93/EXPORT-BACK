import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  type OnApplicationBootstrap,
} from '@nestjs/common';
import { and, asc, count, desc, eq, sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service.js';
import { blogCategories, blogPosts, blogSettings } from '../database/schema.js';
import {
  BLOG_CATEGORY_DEFAULTS,
  BLOG_POST_DEFAULTS,
  BLOG_SETTINGS_DEFAULTS,
} from './blog.defaults.js';
import type {
  BlogCategory,
  BlogCategoryInput,
  BlogPost,
  BlogPostInput,
  BlogPostSummary,
  BlogSettings,
} from './blog.types.js';
import {
  sanitizeCategory,
  sanitizePost,
  sanitizeSettings,
} from './blog.validate.js';

type PostRow = typeof blogPosts.$inferSelect;
type CategoryRow = typeof blogCategories.$inferSelect;

/** Published and not scheduled for a future date. */
const isLive = and(
  eq(blogPosts.status, 'published'),
  sql`${blogPosts.publishedAt} <= current_date`,
);

const readingMinutes = (body: string) =>
  Math.max(1, Math.ceil(body.split(/\s+/).filter(Boolean).length / 200));

function toSummary(row: PostRow): BlogPostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.data.title,
    excerpt: row.data.excerpt,
    image: row.data.image,
    imageAlt: row.data.imageAlt,
    categoryId: row.categoryId,
    status: row.status,
    publishedAt: row.publishedAt ?? '',
    updatedAt: row.updatedAt.toISOString(),
    readingMinutes: readingMinutes(row.data.body),
    index: row.data.seo.index,
  };
}

function toPost(row: PostRow): BlogPost {
  return {
    ...row.data,
    id: row.id,
    slug: row.slug,
    categoryId: row.categoryId,
    status: row.status,
    publishedAt: row.publishedAt ?? '',
    updatedAt: row.updatedAt.toISOString(),
    readingMinutes: readingMinutes(row.data.body),
  };
}

function splitPost({
  slug,
  categoryId,
  status,
  publishedAt,
  ...data
}: BlogPostInput) {
  return {
    slug,
    categoryId,
    status,
    publishedAt: publishedAt || null,
    data,
  };
}

function splitCategory({ slug, ...data }: BlogCategoryInput) {
  return { slug, data };
}

/** Postgres unique-violation (duplicate slug). */
function isDuplicate(err: unknown): boolean {
  const e = err as { code?: string; cause?: { code?: string } };
  return e?.code === '23505' || e?.cause?.code === '23505';
}

@Injectable()
export class BlogService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BlogService.name);

  constructor(private readonly database: DatabaseService) {}

  private get db() {
    return this.database.db;
  }

  /* ---------- Seeding ---------- */

  async onApplicationBootstrap() {
    const [{ total }] = await this.db
      .select({ total: count() })
      .from(blogCategories);
    const [{ posts }] = await this.db
      .select({ posts: count() })
      .from(blogPosts);
    if (total > 0 || posts > 0) return;

    await this.db.transaction(async (tx) => {
      const categories = await tx
        .insert(blogCategories)
        .values(
          BLOG_CATEGORY_DEFAULTS.map((c, i) => ({
            ...splitCategory(c),
            position: i,
          })),
        )
        .returning({ id: blogCategories.id, slug: blogCategories.slug });
      const ids = new Map(categories.map((c) => [c.slug, c.id]));
      await tx
        .insert(blogPosts)
        .values(
          BLOG_POST_DEFAULTS.map(({ category, ...post }) => ({
            ...splitPost({ ...post, categoryId: ids.get(category) ?? null }),
            // Seeded posts were not edited after publishing, so no "Updated" date is shown.
            updatedAt: new Date(post.publishedAt),
          })),
        );
    });
    this.logger.log(
      `Seeded ${BLOG_CATEGORY_DEFAULTS.length} blog categories and ${BLOG_POST_DEFAULTS.length} posts`,
    );
  }

  /* ---------- Settings ---------- */

  async settings(): Promise<BlogSettings> {
    const [row] = await this.db
      .select()
      .from(blogSettings)
      .where(eq(blogSettings.id, 1));
    return row?.data ?? BLOG_SETTINGS_DEFAULTS;
  }

  async updateSettings(input: unknown): Promise<BlogSettings> {
    const data = sanitizeSettings(input);
    await this.db
      .insert(blogSettings)
      .values({ id: 1, data })
      .onConflictDoUpdate({
        target: blogSettings.id,
        set: { data, updatedAt: new Date() },
      });
    return data;
  }

  /* ---------- Categories ---------- */

  async categories(): Promise<BlogCategory[]> {
    const [rows, counts] = await Promise.all([
      this.db
        .select()
        .from(blogCategories)
        .orderBy(asc(blogCategories.position), asc(blogCategories.id)),
      this.db
        .select({ categoryId: blogPosts.categoryId, total: count() })
        .from(blogPosts)
        .where(isLive)
        .groupBy(blogPosts.categoryId),
    ]);
    const byId = new Map(counts.map((c) => [c.categoryId, c.total]));
    return rows.map((row) => this.toCategory(row, byId.get(row.id) ?? 0));
  }

  async categoryBySlug(slug: string): Promise<BlogCategory> {
    const category = (await this.categories()).find((c) => c.slug === slug);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async createCategory(input: unknown): Promise<BlogCategory> {
    const category = sanitizeCategory(input);
    const [row] = await this.unique(category.slug, () =>
      this.db
        .insert(blogCategories)
        .values({
          ...splitCategory(category),
          position: sql`(select coalesce(max(${blogCategories.position}), -1) + 1 from ${blogCategories})`,
        })
        .returning(),
    );
    return this.toCategory(row, 0);
  }

  async updateCategory(id: number, input: unknown): Promise<BlogCategory> {
    const category = sanitizeCategory(input);
    const [row] = await this.unique(category.slug, () =>
      this.db
        .update(blogCategories)
        .set({ ...splitCategory(category), updatedAt: new Date() })
        .where(eq(blogCategories.id, id))
        .returning(),
    );
    if (!row) throw new NotFoundException('Category not found');
    return (await this.categories()).find((c) => c.id === id)!;
  }

  /** Posts in a deleted category stay, without a category. */
  async deleteCategory(id: number): Promise<void> {
    const deleted = await this.db
      .delete(blogCategories)
      .where(eq(blogCategories.id, id))
      .returning({ id: blogCategories.id });
    if (!deleted.length) throw new NotFoundException('Category not found');
  }

  async reorderCategories(input: unknown): Promise<BlogCategory[]> {
    const ids = (input as { ids?: unknown })?.ids;
    const existing = await this.categories();
    if (
      !Array.isArray(ids) ||
      ids.length !== existing.length ||
      new Set(ids).size !== ids.length ||
      !existing.every((c) => ids.includes(c.id))
    ) {
      throw new BadRequestException('ids must list every category once');
    }
    await this.db.transaction(async (tx) => {
      for (const [position, id] of (ids as number[]).entries()) {
        await tx
          .update(blogCategories)
          .set({ position })
          .where(eq(blogCategories.id, id));
      }
    });
    return this.categories();
  }

  private toCategory(row: CategoryRow, postCount: number): BlogCategory {
    return {
      ...row.data,
      id: row.id,
      slug: row.slug,
      position: row.position,
      postCount,
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  /* ---------- Posts ---------- */

  /** Public list: live posts only, newest first, without bodies. */
  async livePosts(): Promise<BlogPostSummary[]> {
    const rows = await this.db
      .select()
      .from(blogPosts)
      .where(isLive)
      .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.id));
    return rows.map(toSummary);
  }

  async livePostBySlug(slug: string): Promise<BlogPost> {
    const [row] = await this.db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), isLive));
    if (!row) throw new NotFoundException('Post not found');
    return toPost(row);
  }

  /** Admin list: drafts and scheduled posts too. */
  async allPosts(): Promise<BlogPostSummary[]> {
    const rows = await this.db
      .select()
      .from(blogPosts)
      .orderBy(
        sql`${blogPosts.publishedAt} desc nulls first`,
        desc(blogPosts.id),
      );
    return rows.map(toSummary);
  }

  async postById(id: number): Promise<BlogPost> {
    const [row] = await this.db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    if (!row) throw new NotFoundException('Post not found');
    return toPost(row);
  }

  async createPost(input: unknown): Promise<BlogPost> {
    const post = await this.validPost(input);
    const [row] = await this.unique(post.slug, () =>
      this.db.insert(blogPosts).values(splitPost(post)).returning(),
    );
    return toPost(row);
  }

  async updatePost(id: number, input: unknown): Promise<BlogPost> {
    const post = await this.validPost(input);
    const [row] = await this.unique(post.slug, () =>
      this.db
        .update(blogPosts)
        .set({ ...splitPost(post), updatedAt: new Date() })
        .where(eq(blogPosts.id, id))
        .returning(),
    );
    if (!row) throw new NotFoundException('Post not found');
    return toPost(row);
  }

  async deletePost(id: number): Promise<void> {
    const deleted = await this.db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning({ id: blogPosts.id });
    if (!deleted.length) throw new NotFoundException('Post not found');
  }

  private async validPost(input: unknown): Promise<BlogPostInput> {
    const post = sanitizePost(input);
    if (post.categoryId !== null) {
      const [found] = await this.db
        .select({ id: blogCategories.id })
        .from(blogCategories)
        .where(eq(blogCategories.id, post.categoryId));
      if (!found) throw new BadRequestException('categoryId does not exist');
    }
    return post;
  }

  private async unique<T>(slug: string, run: () => Promise<T>): Promise<T> {
    try {
      return await run();
    } catch (err) {
      if (isDuplicate(err)) {
        throw new ConflictException(`The slug "${slug}" is already used`);
      }
      throw err;
    }
  }
}
