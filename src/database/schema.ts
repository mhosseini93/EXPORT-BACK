import { jsonb, pgTable, smallint, timestamp } from 'drizzle-orm/pg-core';
import type { HomeContent } from '../home/home.types.js';

/** Single-row table (id = 1) holding the editable homepage content. */
export const homeContent = pgTable('home_content', {
  id: smallint('id').primaryKey().default(1),
  content: jsonb('content').$type<Omit<HomeContent, 'updatedAt'>>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
