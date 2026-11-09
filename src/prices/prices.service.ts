import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  type OnApplicationBootstrap,
} from '@nestjs/common';
import { asc, count, eq, sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service.js';
import { pricePages } from '../database/schema.js';
import { PRICE_PAGE_DEFAULTS } from './prices.defaults.js';
import type { PricePage, PricePageInput } from './prices.types.js';
import { sanitizePricePage } from './prices.validate.js';

type Row = typeof pricePages.$inferSelect;

function toPage(row: Row): PricePage {
  return {
    ...row.data,
    id: row.id,
    slug: row.slug,
    position: row.position,
    updatedAt: row.updatedAt.toISOString(),
  };
}

function split({ slug, ...data }: PricePageInput) {
  return { slug, data };
}

/** Postgres unique-violation on the slug column. */
function isDuplicateSlug(err: unknown): boolean {
  const cause = (err as { cause?: { code?: string } })?.cause;
  return (
    (err as { code?: string })?.code === '23505' || cause?.code === '23505'
  );
}

@Injectable()
export class PricesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PricesService.name);

  constructor(private readonly database: DatabaseService) {}

  private get db() {
    return this.database.db;
  }

  /** First run: seed the original price lists so the site is never empty. */
  async onApplicationBootstrap() {
    const [{ total }] = await this.db
      .select({ total: count() })
      .from(pricePages);
    if (total > 0) return;
    await this.db
      .insert(pricePages)
      .values(PRICE_PAGE_DEFAULTS.map((p, i) => ({ ...split(p), position: i })))
      .onConflictDoNothing();
    this.logger.log(`Seeded ${PRICE_PAGE_DEFAULTS.length} price pages`);
  }

  async list(): Promise<PricePage[]> {
    const rows = await this.db
      .select()
      .from(pricePages)
      .orderBy(asc(pricePages.position), asc(pricePages.id));
    return rows.map(toPage);
  }

  async bySlug(slug: string): Promise<PricePage> {
    const [row] = await this.db
      .select()
      .from(pricePages)
      .where(eq(pricePages.slug, slug));
    if (!row) throw new NotFoundException('Price page not found');
    return toPage(row);
  }

  async create(input: unknown): Promise<PricePage> {
    const page = sanitizePricePage(input);
    try {
      const [row] = await this.db
        .insert(pricePages)
        .values({
          ...split(page),
          position: sql`(select coalesce(max(${pricePages.position}), -1) + 1 from ${pricePages})`,
        })
        .returning();
      return toPage(row);
    } catch (err) {
      if (isDuplicateSlug(err)) {
        throw new ConflictException(`The slug "${page.slug}" is already used`);
      }
      throw err;
    }
  }

  async update(id: number, input: unknown): Promise<PricePage> {
    const page = sanitizePricePage(input);
    try {
      const [row] = await this.db
        .update(pricePages)
        .set({ ...split(page), updatedAt: new Date() })
        .where(eq(pricePages.id, id))
        .returning();
      if (!row) throw new NotFoundException('Price page not found');
      return toPage(row);
    } catch (err) {
      if (isDuplicateSlug(err)) {
        throw new ConflictException(`The slug "${page.slug}" is already used`);
      }
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.db
      .delete(pricePages)
      .where(eq(pricePages.id, id))
      .returning({ id: pricePages.id });
    if (deleted.length === 0)
      throw new NotFoundException('Price page not found');
  }

  /** Saves a new display order; `ids` must list every page exactly once. */
  async reorder(input: unknown): Promise<PricePage[]> {
    const ids = (input as { ids?: unknown })?.ids;
    const existing = await this.list();
    if (
      !Array.isArray(ids) ||
      ids.length !== existing.length ||
      new Set(ids).size !== ids.length ||
      !existing.every((p) => ids.includes(p.id))
    ) {
      throw new BadRequestException('ids must list every price page once');
    }
    await this.db.transaction(async (tx) => {
      for (const [position, id] of (ids as number[]).entries()) {
        await tx
          .update(pricePages)
          .set({ position })
          .where(eq(pricePages.id, id));
      }
    });
    return this.list();
  }
}
