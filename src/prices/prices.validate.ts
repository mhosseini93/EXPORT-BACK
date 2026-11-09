import { BadRequestException } from '@nestjs/common';
import { arr, bool, href, obj, oneOf, str } from '../common/validate.js';
import {
  COLUMN_TYPES,
  type PriceColumn,
  type PricePageInput,
  type PriceTable,
} from './prices.types.js';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COLUMN_ID = /^[a-z0-9_-]{1,24}$/i;
const NUMBER = /^-?\d+(\.\d+)?$/;

function columns(v: unknown, path: string): PriceColumn[] {
  const list = arr(v, path, 10);
  if (list.length === 0) {
    throw new BadRequestException(`${path} needs at least one column`);
  }
  const seen = new Set<string>();
  return list.map((raw, i) => {
    const p = `${path}[${i}]`;
    const c = obj(raw, p);
    const id = str(c.id, `${p}.id`, 24);
    if (!COLUMN_ID.test(id) || seen.has(id)) {
      throw new BadRequestException(`${p}.id must be a unique short key`);
    }
    seen.add(id);
    return {
      id,
      label: str(c.label, `${p}.label`, 40),
      shortLabel: str(c.shortLabel, `${p}.shortLabel`, 12, false),
      type: oneOf(c.type, COLUMN_TYPES, `${p}.type`),
    };
  });
}

function table(raw: unknown, p: string): PriceTable {
  const t = obj(raw, p);
  const cols = columns(t.columns, `${p}.columns`);
  const rows = arr(t.rows, `${p}.rows`, 200).map((rawRow, r) => {
    const row = obj(rawRow, `${p}.rows[${r}]`);
    // Keep only cells of existing columns, so deleted columns leave no stale data.
    return Object.fromEntries(
      cols.map((c) => {
        const cp = `${p}.rows[${r}] "${c.label}"`;
        const value = str(row[c.id] ?? '', cp, 120, false).replace(/^\+/, '');
        if (c.type !== 'text' && value && !NUMBER.test(value)) {
          throw new BadRequestException(`${cp} must be a number`);
        }
        return [c.id, value];
      }),
    );
  });
  return {
    title: str(t.title, `${p}.title`, 120),
    note: str(t.note, `${p}.note`, 300, false),
    columns: cols,
    rows,
  };
}

export function sanitizePricePage(input: unknown): PricePageInput {
  const b = obj(input, 'body');
  const slug = str(b.slug, 'slug', 80);
  if (!SLUG.test(slug)) {
    throw new BadRequestException(
      'slug may contain only lowercase letters, digits and single hyphens',
    );
  }
  const seo = obj(b.seo, 'seo');
  return {
    slug,
    name: str(b.name, 'name', 60),
    breadcrumb: str(b.breadcrumb, 'breadcrumb', 60),
    h1: str(b.h1, 'h1', 120),
    intro: str(b.intro, 'intro', 1000),
    summary: str(b.summary, 'summary', 200, false),
    image: href(b.image, 'image'),
    imageAlt: str(b.imageAlt, 'imageAlt', 160),
    tables: arr(b.tables, 'tables', 5).map((t, i) => table(t, `tables[${i}]`)),
    bottomTitle: str(b.bottomTitle, 'bottomTitle', 120, false),
    bottomText: str(b.bottomText, 'bottomText', 10000, false),
    faqs: arr(b.faqs, 'faqs', 20).map((raw, i) => {
      const f = obj(raw, `faqs[${i}]`);
      return {
        question: str(f.question, `faqs[${i}].question`, 200),
        answer: str(f.answer, `faqs[${i}].answer`, 1500),
      };
    }),
    seo: {
      title: str(seo.title, 'seo.title', 120, false),
      description: str(seo.description, 'seo.description', 300, false),
      canonical: href(seo.canonical, 'seo.canonical', false),
      index: bool(seo.index, 'seo.index'),
      follow: bool(seo.follow, 'seo.follow'),
    },
  };
}
