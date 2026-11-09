import {
  integer,
  jsonb,
  pgTable,
  serial,
  smallint,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import type { HomeContent } from '../home/home.types.js';
import type { PricePageData } from '../prices/prices.types.js';

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
